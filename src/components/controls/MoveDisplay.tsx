import { useCube } from '@/contexts/CubeContext';
import { Move } from '@/lib/rubik/types';

export function MoveDisplay() {
  const { currentMoves, animationState } = useCube();
  const { currentMoveIndex } = animationState;

  const getMoveColor = (move: Move): string => {
    const base = move[0];
    const colors: Record<string, string> = {
      'R': 'text-rubik-red',
      'L': 'text-rubik-orange',
      'U': 'text-rubik-white',
      'D': 'text-rubik-yellow',
      'F': 'text-rubik-green',
      'B': 'text-rubik-blue',
    };
    return colors[base] || 'text-foreground';
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4 rounded-xl bg-card border border-border min-h-[60px]">
      {currentMoves.map((move, index) => (
        <span
          key={index}
          className={`
            font-mono text-lg font-bold px-2 py-1 rounded transition-all duration-200
            ${getMoveColor(move)}
            ${index === currentMoveIndex 
              ? 'bg-primary/20 ring-2 ring-primary scale-110' 
              : index < currentMoveIndex 
                ? 'opacity-40' 
                : 'opacity-80'
            }
          `}
        >
          {move}
        </span>
      ))}
      {currentMoves.length === 0 && (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  );
}
