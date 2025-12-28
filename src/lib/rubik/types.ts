// Rubik's Cube Types

export type FaceColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';

export type Face = 'U' | 'D' | 'F' | 'B' | 'L' | 'R'; // Up, Down, Front, Back, Left, Right

export type Move = 
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2'
  | 'L' | "L'" | 'L2'
  | 'R' | "R'" | 'R2';

export interface Algorithm {
  id: string;
  nameEn: string;
  namePt: string;
  descriptionEn: string;
  descriptionPt: string;
  moves: Move[];
  category: 'beginner' | 'f2l' | 'oll' | 'pll';
}

// Each face is a 3x3 array of colors (indices 0-8, row by row)
export type FaceState = FaceColor[];

export interface CubeState {
  U: FaceState; // Up (white)
  D: FaceState; // Down (yellow)
  F: FaceState; // Front (green)
  B: FaceState; // Back (blue)
  L: FaceState; // Left (orange)
  R: FaceState; // Right (red)
}

export type RenderMode = '2d' | '3d';

export type Language = 'en' | 'pt';

export interface AnimationState {
  isPlaying: boolean;
  currentMoveIndex: number;
  speed: number; // ms per move
}
