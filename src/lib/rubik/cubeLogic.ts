import { CubeState, FaceState, Move, FaceColor } from './types';
import { SOLVED_CUBE } from './constants';

// Deep clone a cube state
export function cloneCubeState(state: CubeState): CubeState {
  return {
    U: [...state.U],
    D: [...state.D],
    F: [...state.F],
    B: [...state.B],
    L: [...state.L],
    R: [...state.R],
  };
}

// Rotate a face 90 degrees clockwise
function rotateFaceCW(face: FaceState): FaceState {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ];
}

// Rotate a face 90 degrees counter-clockwise
function rotateFaceCCW(face: FaceState): FaceState {
  return [
    face[2], face[5], face[8],
    face[1], face[4], face[7],
    face[0], face[3], face[6],
  ];
}

// Rotate a face 180 degrees
function rotateFace180(face: FaceState): FaceState {
  return [
    face[8], face[7], face[6],
    face[5], face[4], face[3],
    face[2], face[1], face[0],
  ];
}

// Apply a single move to the cube state
export function applyMove(state: CubeState, move: Move): CubeState {
  const newState = cloneCubeState(state);
  
  const baseMove = move.replace("'", "").replace("2", "") as 'U' | 'D' | 'F' | 'B' | 'L' | 'R';
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");
  
  // Rotate the face itself
  if (isDouble) {
    newState[baseMove] = rotateFace180(newState[baseMove]);
  } else if (isPrime) {
    newState[baseMove] = rotateFaceCCW(newState[baseMove]);
  } else {
    newState[baseMove] = rotateFaceCW(newState[baseMove]);
  }
  
  // Handle edge pieces based on the move
  const times = isDouble ? 2 : 1;
  for (let i = 0; i < times; i++) {
    const direction = isPrime && !isDouble ? 'ccw' : 'cw';
    rotateEdges(newState, baseMove, direction);
  }
  
  return newState;
}

function rotateEdges(state: CubeState, face: 'U' | 'D' | 'F' | 'B' | 'L' | 'R', direction: 'cw' | 'ccw'): void {
  const temp: FaceColor[] = [];
  
  switch (face) {
    case 'U':
      if (direction === 'cw') {
        temp[0] = state.F[0]; temp[1] = state.F[1]; temp[2] = state.F[2];
        state.F[0] = state.R[0]; state.F[1] = state.R[1]; state.F[2] = state.R[2];
        state.R[0] = state.B[0]; state.R[1] = state.B[1]; state.R[2] = state.B[2];
        state.B[0] = state.L[0]; state.B[1] = state.L[1]; state.B[2] = state.L[2];
        state.L[0] = temp[0]; state.L[1] = temp[1]; state.L[2] = temp[2];
      } else {
        temp[0] = state.F[0]; temp[1] = state.F[1]; temp[2] = state.F[2];
        state.F[0] = state.L[0]; state.F[1] = state.L[1]; state.F[2] = state.L[2];
        state.L[0] = state.B[0]; state.L[1] = state.B[1]; state.L[2] = state.B[2];
        state.B[0] = state.R[0]; state.B[1] = state.R[1]; state.B[2] = state.R[2];
        state.R[0] = temp[0]; state.R[1] = temp[1]; state.R[2] = temp[2];
      }
      break;
      
    case 'D':
      if (direction === 'cw') {
        temp[0] = state.F[6]; temp[1] = state.F[7]; temp[2] = state.F[8];
        state.F[6] = state.L[6]; state.F[7] = state.L[7]; state.F[8] = state.L[8];
        state.L[6] = state.B[6]; state.L[7] = state.B[7]; state.L[8] = state.B[8];
        state.B[6] = state.R[6]; state.B[7] = state.R[7]; state.B[8] = state.R[8];
        state.R[6] = temp[0]; state.R[7] = temp[1]; state.R[8] = temp[2];
      } else {
        temp[0] = state.F[6]; temp[1] = state.F[7]; temp[2] = state.F[8];
        state.F[6] = state.R[6]; state.F[7] = state.R[7]; state.F[8] = state.R[8];
        state.R[6] = state.B[6]; state.R[7] = state.B[7]; state.R[8] = state.B[8];
        state.B[6] = state.L[6]; state.B[7] = state.L[7]; state.B[8] = state.L[8];
        state.L[6] = temp[0]; state.L[7] = temp[1]; state.L[8] = temp[2];
      }
      break;
      
    case 'F':
      if (direction === 'cw') {
        temp[0] = state.U[6]; temp[1] = state.U[7]; temp[2] = state.U[8];
        state.U[6] = state.L[8]; state.U[7] = state.L[5]; state.U[8] = state.L[2];
        state.L[2] = state.D[0]; state.L[5] = state.D[1]; state.L[8] = state.D[2];
        state.D[0] = state.R[6]; state.D[1] = state.R[3]; state.D[2] = state.R[0];
        state.R[0] = temp[0]; state.R[3] = temp[1]; state.R[6] = temp[2];
      } else {
        temp[0] = state.U[6]; temp[1] = state.U[7]; temp[2] = state.U[8];
        state.U[6] = state.R[0]; state.U[7] = state.R[3]; state.U[8] = state.R[6];
        state.R[0] = state.D[2]; state.R[3] = state.D[1]; state.R[6] = state.D[0];
        state.D[0] = state.L[2]; state.D[1] = state.L[5]; state.D[2] = state.L[8];
        state.L[2] = temp[2]; state.L[5] = temp[1]; state.L[8] = temp[0];
      }
      break;
      
    case 'B':
      if (direction === 'cw') {
        temp[0] = state.U[0]; temp[1] = state.U[1]; temp[2] = state.U[2];
        state.U[0] = state.R[2]; state.U[1] = state.R[5]; state.U[2] = state.R[8];
        state.R[2] = state.D[8]; state.R[5] = state.D[7]; state.R[8] = state.D[6];
        state.D[6] = state.L[0]; state.D[7] = state.L[3]; state.D[8] = state.L[6];
        state.L[0] = temp[2]; state.L[3] = temp[1]; state.L[6] = temp[0];
      } else {
        temp[0] = state.U[0]; temp[1] = state.U[1]; temp[2] = state.U[2];
        state.U[0] = state.L[6]; state.U[1] = state.L[3]; state.U[2] = state.L[0];
        state.L[0] = state.D[6]; state.L[3] = state.D[7]; state.L[6] = state.D[8];
        state.D[6] = state.R[8]; state.D[7] = state.R[5]; state.D[8] = state.R[2];
        state.R[2] = temp[0]; state.R[5] = temp[1]; state.R[8] = temp[2];
      }
      break;
      
    case 'L':
      if (direction === 'cw') {
        temp[0] = state.U[0]; temp[1] = state.U[3]; temp[2] = state.U[6];
        state.U[0] = state.B[8]; state.U[3] = state.B[5]; state.U[6] = state.B[2];
        state.B[2] = state.D[6]; state.B[5] = state.D[3]; state.B[8] = state.D[0];
        state.D[0] = state.F[0]; state.D[3] = state.F[3]; state.D[6] = state.F[6];
        state.F[0] = temp[0]; state.F[3] = temp[1]; state.F[6] = temp[2];
      } else {
        temp[0] = state.U[0]; temp[1] = state.U[3]; temp[2] = state.U[6];
        state.U[0] = state.F[0]; state.U[3] = state.F[3]; state.U[6] = state.F[6];
        state.F[0] = state.D[0]; state.F[3] = state.D[3]; state.F[6] = state.D[6];
        state.D[0] = state.B[8]; state.D[3] = state.B[5]; state.D[6] = state.B[2];
        state.B[2] = temp[2]; state.B[5] = temp[1]; state.B[8] = temp[0];
      }
      break;
      
    case 'R':
      if (direction === 'cw') {
        temp[0] = state.U[2]; temp[1] = state.U[5]; temp[2] = state.U[8];
        state.U[2] = state.F[2]; state.U[5] = state.F[5]; state.U[8] = state.F[8];
        state.F[2] = state.D[2]; state.F[5] = state.D[5]; state.F[8] = state.D[8];
        state.D[2] = state.B[6]; state.D[5] = state.B[3]; state.D[8] = state.B[0];
        state.B[0] = temp[2]; state.B[3] = temp[1]; state.B[6] = temp[0];
      } else {
        temp[0] = state.U[2]; temp[1] = state.U[5]; temp[2] = state.U[8];
        state.U[2] = state.B[6]; state.U[5] = state.B[3]; state.U[8] = state.B[0];
        state.B[0] = state.D[8]; state.B[3] = state.D[5]; state.B[6] = state.D[2];
        state.D[2] = state.F[2]; state.D[5] = state.F[5]; state.D[8] = state.F[8];
        state.F[2] = temp[0]; state.F[5] = temp[1]; state.F[8] = temp[2];
      }
      break;
  }
}

// Apply a sequence of moves
export function applyMoves(state: CubeState, moves: Move[]): CubeState {
  let currentState = state;
  for (const move of moves) {
    currentState = applyMove(currentState, move);
  }
  return currentState;
}

// Generate a random scramble
export function generateScramble(length: number = 20): Move[] {
  const baseMoves: ('U' | 'D' | 'F' | 'B' | 'L' | 'R')[] = ['U', 'D', 'F', 'B', 'L', 'R'];
  const modifiers = ['', "'", '2'];
  const scramble: Move[] = [];
  let lastMove = '';
  
  for (let i = 0; i < length; i++) {
    let move: string;
    do {
      const baseMove = baseMoves[Math.floor(Math.random() * baseMoves.length)];
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      move = baseMove + modifier;
    } while (move[0] === lastMove[0]); // Avoid same face twice in a row
    
    scramble.push(move as Move);
    lastMove = move;
  }
  
  return scramble;
}

// Get a scrambled cube
export function getScrambledCube(scrambleLength: number = 20): { cube: CubeState; scramble: Move[] } {
  const scramble = generateScramble(scrambleLength);
  const cube = applyMoves(cloneCubeState(SOLVED_CUBE), scramble);
  return { cube, scramble };
}

// Check if cube is solved
export function isSolved(state: CubeState): boolean {
  const faces = ['U', 'D', 'F', 'B', 'L', 'R'] as const;
  for (const face of faces) {
    const color = state[face][4]; // Center color
    if (!state[face].every(c => c === color)) {
      return false;
    }
  }
  return true;
}
