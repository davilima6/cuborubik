import { describe, it, expect } from 'vitest';
import { parseAlgorithmString } from '../algorithms';

describe('Algorithms helpers', () => {
  it('parseAlgorithmString should parse valid tokens and ignore invalid ones', () => {
    const moves = parseAlgorithmString('R U invalid_token F2 X Y Z  D\'');
    expect(moves).toEqual(['R', 'U', 'F2', "D'"]);
  });

  it('parseAlgorithmString should handle extra whitespace', () => {
    const moves = parseAlgorithmString('  R   U\n\nR\'   U\'  ');
    expect(moves).toEqual(['R', 'U', "R'", "U'"]);
  });
});
