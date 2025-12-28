import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { 
  CubeState, 
  Move, 
  RenderMode, 
  Language, 
  Algorithm,
  AnimationState,
  AppMode,
  RotationAnimation,
  Face,
} from '@/lib/rubik/types';
import { 
  cloneCubeState, 
  applyMove, 
  getScrambledCube 
} from '@/lib/rubik/cubeLogic';
import { SOLVED_CUBE, DEFAULT_ANIMATION_SPEED } from '@/lib/rubik/constants';
import { ALGORITHMS, getInverseMoves } from '@/lib/rubik/algorithms';
import { getStepByGlobalIndex, getTotalTutorialSteps } from '@/lib/rubik/tutorial';

interface HistoryEntry {
  cubeState: CubeState;
  move: Move | null;
}

interface TutorialState {
  currentStepIndex: number;
  stepMoveIndex: number;
  isPlayingStep: boolean;
  stepStartCube: CubeState | null;
}

interface CubeContextType {
  // State
  cubeState: CubeState;
  renderMode: RenderMode;
  language: Language;
  selectedAlgorithm: Algorithm | null;
  animationState: AnimationState;
  currentMoves: Move[];
  executedMoves: Move[];
  cubeHistory: HistoryEntry[];
  historyIndex: number;
  appMode: AppMode;
  tutorialState: TutorialState;
  rotationAnimation: RotationAnimation | null;
  
  // Actions
  setRenderMode: (mode: RenderMode) => void;
  setLanguage: (lang: Language) => void;
  selectAlgorithm: (algorithm: Algorithm) => void;
  scrambleCube: () => void;
  resetCube: () => void;
  play: () => void;
  pause: () => void;
  rewind: () => void;
  setSpeed: (speed: number) => void;
  executeNextMove: () => void;
  executeMove: (move: Move) => void;
  goToHistoryPoint: (index: number) => void;
  setAppMode: (mode: AppMode) => void;
  // Tutorial actions
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  playTutorialStep: () => void;
  resetTutorialStep: () => void;
}

const CubeContext = createContext<CubeContextType | null>(null);

// Get the face being rotated from a move
function getFaceFromMove(move: Move): Face {
  return move.replace("'", "").replace("2", "") as Face;
}

// Get rotation direction and amount from move
// For visual animation: CW rotation = negative angle on R/U/F, positive on L/D/B
function getRotationFromMove(move: Move): { direction: 1 | -1; isDouble: boolean } {
  const face = move.replace("'", "").replace("2", "") as Face;
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");
  
  // R, U, F faces rotate "away" visually (negative angle for CW)
  // L, D, B faces rotate "towards" visually (positive angle for CW)
  const isPositiveFace = ['R', 'U', 'F'].includes(face);
  const baseDirection = isPositiveFace ? -1 : 1;
  
  return { 
    direction: (isPrime ? -baseDirection : baseDirection) as 1 | -1, 
    isDouble 
  };
}

export function CubeProvider({ children }: { children: React.ReactNode }) {
  const [cubeState, setCubeState] = useState<CubeState>(() => {
    const { cube } = getScrambledCube(15);
    return cube;
  });
  const [renderMode, setRenderMode] = useState<RenderMode>('3d');
  const [language, setLanguage] = useState<Language>('pt');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(ALGORITHMS[0]);
  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    currentMoveIndex: 0,
    speed: DEFAULT_ANIMATION_SPEED,
  });
  const [currentMoves, setCurrentMoves] = useState<Move[]>(ALGORITHMS[0]?.moves || []);
  const [executedMoves, setExecutedMoves] = useState<Move[]>([]);
  const [cubeHistory, setCubeHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [appMode, setAppMode] = useState<AppMode>('learn');
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    currentStepIndex: 0,
    stepMoveIndex: 0,
    isPlayingStep: false,
    stepStartCube: null,
  });
  const [rotationAnimation, setRotationAnimation] = useState<RotationAnimation | null>(null);
  
  const animationFrameRef = useRef<number>();
  const pendingMoveRef = useRef<{ move: Move; callback?: () => void } | null>(null);

  // Initialize history when cube is first set
  useEffect(() => {
    if (cubeHistory.length === 0) {
      setCubeHistory([{ cubeState: cloneCubeState(cubeState), move: null }]);
      setHistoryIndex(0);
    }
  }, []);

  // Animation loop for rotation
  useEffect(() => {
    if (!rotationAnimation?.isAnimating) {
      if (pendingMoveRef.current) {
        const { move, callback } = pendingMoveRef.current;
        pendingMoveRef.current = null;
        
        // Apply the actual move to cube state
        setCubeState(prev => {
          const newState = applyMove(prev, move);
          // When adding a new move, truncate any future history and add new entry
          setCubeHistory(history => {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push({ cubeState: cloneCubeState(newState), move });
            return newHistory;
          });
          setHistoryIndex(prev => prev + 1);
          return newState;
        });
        setExecutedMoves(prev => [...prev, move]);
        setRotationAnimation(null);
        
        if (callback) callback();
      }
      return;
    }

    const animate = () => {
      setRotationAnimation(prev => {
        if (!prev) return null;
        
        const step = 8; // degrees per frame
        const newAngle = prev.angle + (prev.targetAngle > 0 ? step : -step);
        
        if (Math.abs(newAngle) >= Math.abs(prev.targetAngle)) {
          return { ...prev, angle: prev.targetAngle, isAnimating: false };
        }
        
        return { ...prev, angle: newAngle };
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rotationAnimation?.isAnimating, historyIndex]);

  const executeMove = useCallback((move: Move, callback?: () => void) => {
    if (rotationAnimation?.isAnimating) return;
    
    const face = getFaceFromMove(move);
    const { direction, isDouble } = getRotationFromMove(move);
    const targetAngle = direction * (isDouble ? 180 : 90);
    
    pendingMoveRef.current = { move, callback };
    
    setRotationAnimation({
      face,
      angle: 0,
      targetAngle,
      isAnimating: true,
    });
  }, [rotationAnimation?.isAnimating]);

  const selectAlgorithm = useCallback((algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setCurrentMoves(algorithm.moves);
    setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
  }, []);

  const scrambleCube = useCallback(() => {
    const { cube } = getScrambledCube(15);
    setCubeState(cube);
    setExecutedMoves([]);
    setCubeHistory([{ cubeState: cloneCubeState(cube), move: null }]);
    setHistoryIndex(0);
    setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
    setRotationAnimation(null);
  }, []);

  const resetCube = useCallback(() => {
    const solved = cloneCubeState(SOLVED_CUBE);
    setCubeState(solved);
    setExecutedMoves([]);
    setCubeHistory([{ cubeState: cloneCubeState(solved), move: null }]);
    setHistoryIndex(0);
    setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
    setRotationAnimation(null);
  }, []);

  const executeNextMove = useCallback(() => {
    if (animationState.currentMoveIndex < currentMoves.length) {
      const move = currentMoves[animationState.currentMoveIndex];
      executeMove(move, () => {
        setAnimationState(prev => ({
          ...prev,
          currentMoveIndex: prev.currentMoveIndex + 1,
        }));
      });
    } else {
      setAnimationState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [animationState.currentMoveIndex, currentMoves, executeMove]);

  const play = useCallback(() => {
    if (animationState.currentMoveIndex >= currentMoves.length) {
      setAnimationState(prev => ({ ...prev, currentMoveIndex: 0 }));
    }
    setAnimationState(prev => ({ ...prev, isPlaying: true }));
  }, [animationState.currentMoveIndex, currentMoves.length]);

  const pause = useCallback(() => {
    setAnimationState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const rewind = useCallback(() => {
    const inverseMoves = getInverseMoves(executedMoves);
    let newState = cubeState;
    for (const move of inverseMoves) {
      newState = applyMove(newState, move);
    }
    setCubeState(newState);
    setExecutedMoves([]);
    setCubeHistory([{ cubeState: cloneCubeState(newState), move: null }]);
    setHistoryIndex(0);
    setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
    setRotationAnimation(null);
  }, [cubeState, executedMoves]);

  // Navigate to any point in history without destroying it
  const goToHistoryPoint = useCallback((index: number) => {
    if (index >= 0 && index < cubeHistory.length) {
      const targetEntry = cubeHistory[index];
      setCubeState(cloneCubeState(targetEntry.cubeState));
      setHistoryIndex(index);
      // Update executedMoves to reflect the moves up to this point
      const movesUpToPoint = cubeHistory.slice(1, index + 1).map(e => e.move).filter((m): m is Move => m !== null);
      setExecutedMoves(movesUpToPoint);
      setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
      setRotationAnimation(null);
    }
  }, [cubeHistory]);

  const setSpeed = useCallback((speed: number) => {
    setAnimationState(prev => ({ ...prev, speed }));
  }, []);

  // Tutorial actions
  const nextTutorialStep = useCallback(() => {
    const totalSteps = getTotalTutorialSteps();
    setTutorialState(prev => ({
      ...prev,
      currentStepIndex: Math.min(prev.currentStepIndex + 1, totalSteps - 1),
      stepMoveIndex: 0,
      isPlayingStep: false,
      stepStartCube: null,
    }));
  }, []);

  const prevTutorialStep = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      currentStepIndex: Math.max(prev.currentStepIndex - 1, 0),
      stepMoveIndex: 0,
      isPlayingStep: false,
      stepStartCube: null,
    }));
  }, []);

  const playTutorialStep = useCallback(() => {
    const stepData = getStepByGlobalIndex(tutorialState.currentStepIndex);
    if (!stepData || stepData.step.moves.length === 0) return;

    // Save current cube state if starting fresh
    if (tutorialState.stepMoveIndex === 0) {
      setTutorialState(prev => ({
        ...prev,
        isPlayingStep: true,
        stepStartCube: cloneCubeState(cubeState),
      }));
    } else {
      setTutorialState(prev => ({ ...prev, isPlayingStep: true }));
    }
  }, [tutorialState.currentStepIndex, tutorialState.stepMoveIndex, cubeState]);

  const resetTutorialStep = useCallback(() => {
    if (tutorialState.stepStartCube) {
      setCubeState(cloneCubeState(tutorialState.stepStartCube));
    }
    setTutorialState(prev => ({
      ...prev,
      stepMoveIndex: 0,
      isPlayingStep: false,
    }));
  }, [tutorialState.stepStartCube]);

  // Tutorial animation loop
  useEffect(() => {
    if (!tutorialState.isPlayingStep || rotationAnimation?.isAnimating) return;

    const stepData = getStepByGlobalIndex(tutorialState.currentStepIndex);
    if (!stepData) return;

    const moves = stepData.step.moves;
    if (tutorialState.stepMoveIndex >= moves.length) {
      setTutorialState(prev => ({ ...prev, isPlayingStep: false }));
      return;
    }

    const timer = setTimeout(() => {
      const move = moves[tutorialState.stepMoveIndex];
      executeMove(move, () => {
        setTutorialState(prev => ({
          ...prev,
          stepMoveIndex: prev.stepMoveIndex + 1,
        }));
      });
    }, animationState.speed);

    return () => clearTimeout(timer);
  }, [tutorialState.isPlayingStep, tutorialState.stepMoveIndex, tutorialState.currentStepIndex, rotationAnimation?.isAnimating, animationState.speed, executeMove]);

  // Learn mode animation loop
  useEffect(() => {
    if (!animationState.isPlaying || rotationAnimation?.isAnimating || appMode !== 'learn') return;

    const timer = setTimeout(() => {
      executeNextMove();
    }, animationState.speed);

    return () => clearTimeout(timer);
  }, [animationState.isPlaying, animationState.speed, rotationAnimation?.isAnimating, appMode, executeNextMove]);

  return (
    <CubeContext.Provider
      value={{
        cubeState,
        renderMode,
        language,
        selectedAlgorithm,
        animationState,
        currentMoves,
        executedMoves,
        cubeHistory,
        historyIndex,
        appMode,
        tutorialState,
        rotationAnimation,
        setRenderMode,
        setLanguage,
        selectAlgorithm,
        scrambleCube,
        resetCube,
        play,
        pause,
        rewind,
        setSpeed,
        executeNextMove,
        executeMove,
        goToHistoryPoint,
        setAppMode,
        nextTutorialStep,
        prevTutorialStep,
        playTutorialStep,
        resetTutorialStep,
      }}
    >
      {children}
    </CubeContext.Provider>
  );
}

export function useCube() {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error('useCube must be used within a CubeProvider');
  }
  return context;
}
