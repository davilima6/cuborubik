import { FaceColor, CubeState } from './types';

export const FACE_COLORS: Record<FaceColor, string> = {
  white: '#FFFFFF',
  yellow: '#FFD500',
  red: '#B90000',
  orange: '#FF5900',
  blue: '#0045AD',
  green: '#009B48',
};

export const SOLVED_CUBE: CubeState = {
  U: Array(9).fill('white') as FaceColor[],
  D: Array(9).fill('yellow') as FaceColor[],
  F: Array(9).fill('green') as FaceColor[],
  B: Array(9).fill('blue') as FaceColor[],
  L: Array(9).fill('orange') as FaceColor[],
  R: Array(9).fill('red') as FaceColor[],
};

export const DEFAULT_ANIMATION_SPEED = 500; // ms per move
