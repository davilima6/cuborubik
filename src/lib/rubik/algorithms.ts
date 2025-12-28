import { Algorithm, Move } from './types';

export const ALGORITHMS: Algorithm[] = [
  {
    id: 'sexy-move',
    nameEn: 'Sexy Move',
    namePt: 'Movimento Sexy',
    descriptionEn: 'The most fundamental algorithm. Used in many other algorithms.',
    descriptionPt: 'O algoritmo mais fundamental. Usado em muitos outros algoritmos.',
    moves: ['R', 'U', "R'", "U'"],
    category: 'beginner',
  },
  {
    id: 'sledgehammer',
    nameEn: 'Sledgehammer',
    namePt: 'Marreta',
    descriptionEn: 'Another fundamental trigger used in F2L and other algorithms.',
    descriptionPt: 'Outro gatilho fundamental usado em F2L e outros algoritmos.',
    moves: ["R'", 'F', 'R', "F'"],
    category: 'beginner',
  },
  {
    id: 'sune',
    nameEn: 'Sune',
    namePt: 'Sune',
    descriptionEn: 'One of the most important OLL algorithms. Orients 3 corners.',
    descriptionPt: 'Um dos algoritmos OLL mais importantes. Orienta 3 cantos.',
    moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
    category: 'oll',
  },
  {
    id: 'anti-sune',
    nameEn: 'Anti-Sune',
    namePt: 'Anti-Sune',
    descriptionEn: 'The inverse of Sune. Also orients 3 corners.',
    descriptionPt: 'O inverso do Sune. Também orienta 3 cantos.',
    moves: ["R'", "U'", 'R', "U'", "R'", 'U2', 'R'],
    category: 'oll',
  },
  {
    id: 't-perm',
    nameEn: 'T-Perm',
    namePt: 'T-Perm',
    descriptionEn: 'A fundamental PLL algorithm. Swaps 2 corners and 2 edges.',
    descriptionPt: 'Um algoritmo PLL fundamental. Troca 2 cantos e 2 arestas.',
    moves: ['R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'"],
    category: 'pll',
  },
  {
    id: 'u-perm-a',
    nameEn: 'U-Perm (a)',
    namePt: 'U-Perm (a)',
    descriptionEn: 'Cycles 3 edges clockwise on the top layer.',
    descriptionPt: 'Cicla 3 arestas no sentido horário na camada superior.',
    moves: ['R', "U'", 'R', 'U', 'R', 'U', 'R', "U'", "R'", "U'", 'R2'],
    category: 'pll',
  },
  {
    id: 'niklas',
    nameEn: 'Niklas',
    namePt: 'Niklas',
    descriptionEn: 'Cycles 3 corners. Very useful for corner permutation.',
    descriptionPt: 'Cicla 3 cantos. Muito útil para permutação de cantos.',
    moves: ["R'", 'U', "L'", 'U2', 'R', "U'", "L'"],
    category: 'beginner',
  },
  {
    id: 'double-sune',
    nameEn: 'Double Sune',
    namePt: 'Sune Duplo',
    descriptionEn: 'Sune performed twice. Orients all corners in some cases.',
    descriptionPt: 'Sune executado duas vezes. Orienta todos os cantos em alguns casos.',
    moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'", 'R', 'U', "R'", 'U', 'R', 'U2', "R'"],
    category: 'oll',
  },
];

export function parseAlgorithmString(algString: string): Move[] {
  const moves: Move[] = [];
  const tokens = algString.trim().split(/\s+/);
  
  for (const token of tokens) {
    if (isValidMove(token)) {
      moves.push(token as Move);
    }
  }
  
  return moves;
}

function isValidMove(move: string): boolean {
  const validMoves = [
    'U', "U'", 'U2',
    'D', "D'", 'D2',
    'F', "F'", 'F2',
    'B', "B'", 'B2',
    'L', "L'", 'L2',
    'R', "R'", 'R2',
  ];
  return validMoves.includes(move);
}

export function getInverseMoves(moves: Move[]): Move[] {
  return moves.map(move => {
    if (move.endsWith("'")) {
      return move.slice(0, -1) as Move;
    } else if (move.endsWith('2')) {
      return move as Move; // Double moves are their own inverse
    } else {
      return (move + "'") as Move;
    }
  }).reverse();
}
