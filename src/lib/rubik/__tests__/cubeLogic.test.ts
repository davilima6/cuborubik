import { describe, it, expect } from 'vitest';
import { 
  cloneCubeState, 
  applyMove, 
  applyMoves, 
  isSolved 
} from '../cubeLogic';
import { SOLVED_CUBE } from '../constants';
import { getInverseMoves } from '../algorithms';
import { Move } from '../types';

describe('Cube Logic', () => {
  describe('isSolved', () => {
    it('should return true for a solved cube', () => {
      expect(isSolved(SOLVED_CUBE)).toBe(true);
    });

    it('should return false for a scrambled cube', () => {
      const scrambled = applyMove(cloneCubeState(SOLVED_CUBE), 'R');
      expect(isSolved(scrambled)).toBe(false);
    });
  });

  describe('Move application', () => {
    it('R move followed by R\' should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMove(cube, 'R');
      cube = applyMove(cube, "R'");
      expect(isSolved(cube)).toBe(true);
    });

    it('R2 followed by R2 should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMove(cube, 'R2');
      cube = applyMove(cube, 'R2');
      expect(isSolved(cube)).toBe(true);
    });

    it('U move followed by U\' should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMove(cube, 'U');
      cube = applyMove(cube, "U'");
      expect(isSolved(cube)).toBe(true);
    });

    it('F move followed by F\' should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMove(cube, 'F');
      cube = applyMove(cube, "F'");
      expect(isSolved(cube)).toBe(true);
    });

    it('B move followed by B\' should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMove(cube, 'B');
      cube = applyMove(cube, "B'");
      expect(isSolved(cube)).toBe(true);
    });

    it('L move followed by L\' should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMove(cube, 'L');
      cube = applyMove(cube, "L'");
      expect(isSolved(cube)).toBe(true);
    });

    it('D move followed by D\' should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMove(cube, 'D');
      cube = applyMove(cube, "D'");
      expect(isSolved(cube)).toBe(true);
    });

    it('4 times R should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMoves(cube, ['R', 'R', 'R', 'R']);
      expect(isSolved(cube)).toBe(true);
    });

    it('4 times U should return to solved state', () => {
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMoves(cube, ['U', 'U', 'U', 'U']);
      expect(isSolved(cube)).toBe(true);
    });

    it('sexy move 6 times returns to solved state', () => {
      const sexyMove: Move[] = ['R', 'U', "R'", "U'"];
      let cube = cloneCubeState(SOLVED_CUBE);
      for (let i = 0; i < 6; i++) {
        cube = applyMoves(cube, sexyMove);
      }
      expect(isSolved(cube)).toBe(true);
    });
  });

  describe('Inverse moves', () => {
    it('applying moves then inverse moves returns to original', () => {
      const moves: Move[] = ['R', 'U', 'F', "L'", 'D2', 'B'];
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMoves(cube, moves);
      expect(isSolved(cube)).toBe(false);
      
      const inverseMoves = getInverseMoves(moves);
      cube = applyMoves(cube, inverseMoves);
      expect(isSolved(cube)).toBe(true);
    });

    it('scramble then inverse scramble returns to solved', () => {
      const scramble: Move[] = ['R', 'U', "R'", 'F', 'D', "B'", 'L2', "U'"];
      let cube = cloneCubeState(SOLVED_CUBE);
      cube = applyMoves(cube, scramble);
      
      const inverse = getInverseMoves(scramble);
      cube = applyMoves(cube, inverse);
      expect(isSolved(cube)).toBe(true);
    });
  });

  describe('Clone independence', () => {
    it('cloned cube should be independent', () => {
      const original = cloneCubeState(SOLVED_CUBE);
      const cloned = cloneCubeState(original);
      
      // Modify cloned - use valid FaceColor type
      cloned.U[0] = 'R' as any;
      
      // Original should be unchanged
      expect(original.U[0]).toBe('W');
    });
  });
});

