import { describe, it, expect } from 'vitest';
import { Move } from '../types';

// Helper function to simulate inverse move calculation
function getInverseMove(move: Move): Move {
  if (move.endsWith("'")) {
    return move.slice(0, -1) as Move;
  } else if (move.endsWith('2')) {
    return move as Move; // Double moves are their own inverse
  } else {
    return (move + "'") as Move;
  }
}

// Helper to build navigation moves
function buildNavigationMoves(
  currentIndex: number,
  targetIndex: number,
  history: { move: Move | null }[]
): Move[] {
  const moves: Move[] = [];
  
  if (targetIndex < currentIndex) {
    // Going backwards - inverse moves in reverse order
    for (let i = currentIndex; i > targetIndex; i--) {
      const move = history[i].move;
      if (move) {
        moves.push(getInverseMove(move));
      }
    }
  } else {
    // Going forward - execute moves as-is
    for (let i = currentIndex + 1; i <= targetIndex; i++) {
      const move = history[i].move;
      if (move) {
        moves.push(move);
      }
    }
  }
  
  return moves;
}

describe('History Navigation', () => {
  describe('buildNavigationMoves', () => {
    const mockHistory = [
      { move: null },      // 0: initial
      { move: 'R' as Move },  // 1
      { move: 'U' as Move },  // 2
      { move: "R'" as Move }, // 3
      { move: "U'" as Move }, // 4
      { move: 'F' as Move },  // 5
      { move: 'B2' as Move }, // 6
      { move: "L'" as Move }, // 7
      { move: 'D' as Move },  // 8
    ];

    it('should return empty array when navigating to same position', () => {
      const moves = buildNavigationMoves(5, 5, mockHistory);
      expect(moves).toEqual([]);
    });

    it('should return forward moves when going from position 0 to 3', () => {
      const moves = buildNavigationMoves(0, 3, mockHistory);
      expect(moves).toEqual(['R', 'U', "R'"]);
    });

    it('should return inverse moves when going backwards from position 8 to 5', () => {
      const moves = buildNavigationMoves(8, 5, mockHistory);
      // From 8 to 5: inverse of D, L', B2 (in that order)
      // D -> D', L' -> L, B2 -> B2
      expect(moves).toEqual(["D'", 'L', 'B2']);
    });

    it('should handle going backwards a single step', () => {
      const moves = buildNavigationMoves(4, 3, mockHistory);
      // Inverse of U' is U
      expect(moves).toEqual(['U']);
    });

    it('should handle going forward a single step', () => {
      const moves = buildNavigationMoves(3, 4, mockHistory);
      expect(moves).toEqual(["U'"]);
    });

    it('should handle double moves correctly (they are their own inverse)', () => {
      const moves = buildNavigationMoves(7, 5, mockHistory);
      // From 7 to 5: inverse of L' (-> L), inverse of B2 (-> B2)
      expect(moves).toEqual(['L', 'B2']);
    });

    it('should handle prime moves correctly (inverse removes prime)', () => {
      const moves = buildNavigationMoves(4, 2, mockHistory);
      // From 4 to 2: inverse of U' (-> U), inverse of R' (-> R)
      expect(moves).toEqual(['U', 'R']);
    });

    it('should handle regular moves correctly (inverse adds prime)', () => {
      const moves = buildNavigationMoves(2, 0, mockHistory);
      // From 2 to 0: inverse of U (-> U'), inverse of R (-> R')
      expect(moves).toEqual(["U'", "R'"]);
    });

    it('should handle navigating from end to start', () => {
      const moves = buildNavigationMoves(8, 0, mockHistory);
      // All moves in reverse, inverted
      expect(moves).toEqual(["D'", 'L', 'B2', "F'", 'U', 'R', "U'", "R'"]);
    });

    it('should handle navigating from start to end', () => {
      const moves = buildNavigationMoves(0, 8, mockHistory);
      expect(moves).toEqual(['R', 'U', "R'", "U'", 'F', 'B2', "L'", 'D']);
    });
  });

  describe('getInverseMove', () => {
    it('should add prime to regular moves', () => {
      expect(getInverseMove('R')).toBe("R'");
      expect(getInverseMove('U')).toBe("U'");
      expect(getInverseMove('F')).toBe("F'");
    });

    it('should remove prime from prime moves', () => {
      expect(getInverseMove("R'")).toBe('R');
      expect(getInverseMove("U'")).toBe('U');
      expect(getInverseMove("L'")).toBe('L');
    });

    it('should keep double moves the same', () => {
      expect(getInverseMove('R2')).toBe('R2');
      expect(getInverseMove('U2')).toBe('U2');
      expect(getInverseMove('B2')).toBe('B2');
    });
  });
});
