import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  CubeState, 
  Move, 
  RenderMode, 
  Language, 
  Algorithm,
  AnimationState 
} from '@/lib/rubik/types';
import { 
  cloneCubeState, 
  applyMove, 
  getScrambledCube 
} from '@/lib/rubik/cubeLogic';
import { SOLVED_CUBE, DEFAULT_ANIMATION_SPEED } from '@/lib/rubik/constants';
import { ALGORITHMS, getInverseMoves } from '@/lib/rubik/algorithms';

interface HistoryEntry {
  cubeState: CubeState;
  move: Move | null; // null for initial state
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
}

const CubeContext = createContext<CubeContextType | null>(null);

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

  // Initialize history when cube is first set
  useEffect(() => {
    if (cubeHistory.length === 0) {
      setCubeHistory([{ cubeState: cloneCubeState(cubeState), move: null }]);
    }
  }, []);

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
    setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
  }, []);

  const resetCube = useCallback(() => {
    const solved = cloneCubeState(SOLVED_CUBE);
    setCubeState(solved);
    setExecutedMoves([]);
    setCubeHistory([{ cubeState: cloneCubeState(solved), move: null }]);
    setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
  }, []);

  const executeMove = useCallback((move: Move) => {
    setCubeState(prev => {
      const newState = applyMove(prev, move);
      setCubeHistory(history => [...history, { cubeState: cloneCubeState(newState), move }]);
      return newState;
    });
    setExecutedMoves(prev => [...prev, move]);
  }, []);

  const executeNextMove = useCallback(() => {
    if (animationState.currentMoveIndex < currentMoves.length) {
      const move = currentMoves[animationState.currentMoveIndex];
      executeMove(move);
      setAnimationState(prev => ({
        ...prev,
        currentMoveIndex: prev.currentMoveIndex + 1,
      }));
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
    // Apply inverse moves to go back
    const inverseMoves = getInverseMoves(executedMoves);
    let newState = cubeState;
    for (const move of inverseMoves) {
      newState = applyMove(newState, move);
    }
    setCubeState(newState);
    setExecutedMoves([]);
    setCubeHistory([{ cubeState: cloneCubeState(newState), move: null }]);
    setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
  }, [cubeState, executedMoves]);

  const goToHistoryPoint = useCallback((index: number) => {
    if (index >= 0 && index < cubeHistory.length) {
      const targetEntry = cubeHistory[index];
      setCubeState(cloneCubeState(targetEntry.cubeState));
      setExecutedMoves(cubeHistory.slice(1, index + 1).map(e => e.move!).filter(Boolean));
      setCubeHistory(cubeHistory.slice(0, index + 1));
      setAnimationState(prev => ({ ...prev, currentMoveIndex: 0, isPlaying: false }));
    }
  }, [cubeHistory]);

  const setSpeed = useCallback((speed: number) => {
    setAnimationState(prev => ({ ...prev, speed }));
  }, []);

  // Animation loop
  useEffect(() => {
    if (!animationState.isPlaying) return;

    const timer = setTimeout(() => {
      executeNextMove();
    }, animationState.speed);

    return () => clearTimeout(timer);
  }, [animationState.isPlaying, animationState.speed, executeNextMove]);

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
