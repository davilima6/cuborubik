import { Move } from './types';

export interface TutorialStep {
  id: string;
  titleEn: string;
  titlePt: string;
  descriptionEn: string;
  descriptionPt: string;
  moves: Move[];
  tipEn?: string;
  tipPt?: string;
}

export interface TutorialPhase {
  id: string;
  nameEn: string;
  namePt: string;
  descriptionEn: string;
  descriptionPt: string;
  steps: TutorialStep[];
}

// Beginner's method tutorial - Layer by Layer
export const TUTORIAL_PHASES: TutorialPhase[] = [
  {
    id: 'white-cross',
    nameEn: 'White Cross',
    namePt: 'Cruz Branca',
    descriptionEn: 'Create a white cross on top, matching center colors',
    descriptionPt: 'Crie uma cruz branca no topo, alinhando com as cores centrais',
    steps: [
      {
        id: 'cross-intro',
        titleEn: 'Understanding the Cross',
        titlePt: 'Entendendo a Cruz',
        descriptionEn: 'The goal is to place 4 white edges around the white center, with colors matching adjacent centers.',
        descriptionPt: 'O objetivo é posicionar 4 arestas brancas ao redor do centro branco, com cores alinhadas aos centros adjacentes.',
        moves: [],
        tipEn: 'Start by finding white edge pieces',
        tipPt: 'Comece encontrando as arestas brancas',
      },
      {
        id: 'cross-edge-front',
        titleEn: 'Front Edge Setup',
        titlePt: 'Configurar Aresta Frontal',
        descriptionEn: 'Move a white edge to the top layer',
        descriptionPt: 'Mova uma aresta branca para a camada superior',
        moves: ['F', 'F'],
        tipEn: 'Double moves keep orientation',
        tipPt: 'Movimentos duplos mantêm a orientação',
      },
      {
        id: 'cross-edge-right',
        titleEn: 'Right Edge Setup',
        titlePt: 'Configurar Aresta Direita',
        descriptionEn: 'Align and insert another edge',
        descriptionPt: 'Alinhe e insira outra aresta',
        moves: ['R', 'R'],
      },
    ],
  },
  {
    id: 'white-corners',
    nameEn: 'White Corners',
    namePt: 'Cantos Brancos',
    descriptionEn: 'Complete the first layer by inserting white corners',
    descriptionPt: 'Complete a primeira camada inserindo os cantos brancos',
    steps: [
      {
        id: 'corner-intro',
        titleEn: 'Finding Corners',
        titlePt: 'Encontrando Cantos',
        descriptionEn: 'White corners have 3 colors. Position them below their target spot.',
        descriptionPt: 'Cantos brancos têm 3 cores. Posicione-os abaixo do local de destino.',
        moves: [],
        tipEn: 'Look for corners in the bottom layer',
        tipPt: 'Procure cantos na camada inferior',
      },
      {
        id: 'corner-insert-right',
        titleEn: 'Right Corner Insert',
        titlePt: 'Inserir Canto Direito',
        descriptionEn: 'Use the Sexy Move to insert corners',
        descriptionPt: 'Use o Movimento Sexy para inserir cantos',
        moves: ['R', 'U', "R'", "U'"],
        tipEn: 'Repeat 1-5 times until corner is placed',
        tipPt: 'Repita 1-5 vezes até o canto estar posicionado',
      },
      {
        id: 'corner-insert-left',
        titleEn: 'Left Corner Insert',
        titlePt: 'Inserir Canto Esquerdo',
        descriptionEn: 'Mirror algorithm for left corners',
        descriptionPt: 'Algoritmo espelhado para cantos esquerdos',
        moves: ["L'", "U'", 'L', 'U'],
      },
    ],
  },
  {
    id: 'second-layer',
    nameEn: 'Second Layer',
    namePt: 'Segunda Camada',
    descriptionEn: 'Insert edges into the middle layer',
    descriptionPt: 'Insira arestas na camada do meio',
    steps: [
      {
        id: 'f2l-intro',
        titleEn: 'Edge Pieces',
        titlePt: 'Peças de Aresta',
        descriptionEn: 'Find edges without yellow and position them above their slot.',
        descriptionPt: 'Encontre arestas sem amarelo e posicione-as acima do encaixe.',
        moves: [],
      },
      {
        id: 'f2l-right',
        titleEn: 'Insert Right',
        titlePt: 'Inserir à Direita',
        descriptionEn: 'Algorithm to insert edge to the right',
        descriptionPt: 'Algoritmo para inserir aresta à direita',
        moves: ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F'],
      },
      {
        id: 'f2l-left',
        titleEn: 'Insert Left',
        titlePt: 'Inserir à Esquerda',
        descriptionEn: 'Algorithm to insert edge to the left',
        descriptionPt: 'Algoritmo para inserir aresta à esquerda',
        moves: ["U'", "L'", 'U', 'L', 'U', 'F', "U'", "F'"],
      },
    ],
  },
  {
    id: 'yellow-cross',
    nameEn: 'Yellow Cross',
    namePt: 'Cruz Amarela',
    descriptionEn: 'Create a yellow cross on the bottom',
    descriptionPt: 'Crie uma cruz amarela na base',
    steps: [
      {
        id: 'oll-cross',
        titleEn: 'Yellow Cross Algorithm',
        titlePt: 'Algoritmo da Cruz Amarela',
        descriptionEn: 'This algorithm orients yellow edges. May need to repeat.',
        descriptionPt: 'Este algoritmo orienta arestas amarelas. Pode precisar repetir.',
        moves: ['F', 'R', 'U', "R'", "U'", "F'"],
        tipEn: 'Start from L shape or line',
        tipPt: 'Comece de forma L ou linha',
      },
    ],
  },
  {
    id: 'yellow-face',
    nameEn: 'Yellow Face',
    namePt: 'Face Amarela',
    descriptionEn: 'Orient all yellow pieces',
    descriptionPt: 'Oriente todas as peças amarelas',
    steps: [
      {
        id: 'oll-sune',
        titleEn: 'Sune Algorithm',
        titlePt: 'Algoritmo Sune',
        descriptionEn: 'Orients yellow corners',
        descriptionPt: 'Orienta cantos amarelos',
        moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
        tipEn: 'Position yellow corner at front-right',
        tipPt: 'Posicione canto amarelo na frente-direita',
      },
    ],
  },
  {
    id: 'final-layer',
    nameEn: 'Final Layer',
    namePt: 'Camada Final',
    descriptionEn: 'Permute the last layer pieces',
    descriptionPt: 'Permute as peças da última camada',
    steps: [
      {
        id: 'pll-corners',
        titleEn: 'Corner Permutation',
        titlePt: 'Permutação de Cantos',
        descriptionEn: 'Swap corners until correct',
        descriptionPt: 'Troque cantos até ficarem corretos',
        moves: ["R'", 'F', "R'", 'B2', 'R', "F'", "R'", 'B2', 'R2'],
      },
      {
        id: 'pll-edges',
        titleEn: 'Edge Permutation',
        titlePt: 'Permutação de Arestas',
        descriptionEn: 'Final algorithm to solve the cube',
        descriptionPt: 'Algoritmo final para resolver o cubo',
        moves: ['R', "U'", 'R', 'U', 'R', 'U', 'R', "U'", "R'", "U'", 'R2'],
        tipEn: 'Congratulations! Cube solved!',
        tipPt: 'Parabéns! Cubo resolvido!',
      },
    ],
  },
];

export function getTotalTutorialSteps(): number {
  return TUTORIAL_PHASES.reduce((acc, phase) => acc + phase.steps.length, 0);
}

export function getStepByGlobalIndex(index: number): { phase: TutorialPhase; step: TutorialStep; phaseIndex: number; stepIndex: number } | null {
  let currentIndex = 0;
  for (let phaseIndex = 0; phaseIndex < TUTORIAL_PHASES.length; phaseIndex++) {
    const phase = TUTORIAL_PHASES[phaseIndex];
    for (let stepIndex = 0; stepIndex < phase.steps.length; stepIndex++) {
      if (currentIndex === index) {
        return { phase, step: phase.steps[stepIndex], phaseIndex, stepIndex };
      }
      currentIndex++;
    }
  }
  return null;
}
