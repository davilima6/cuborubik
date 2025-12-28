import { useCube } from '@/contexts/CubeContext';
import { Move } from '@/lib/rubik/types';
import { t } from '@/lib/rubik/translations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw } from 'lucide-react';

export function MoveHistory() {
  const { executedMoves, language, goToHistoryPoint, cubeHistory } = useCube();

  const getMoveColor = (move: Move): string => {
    const base = move[0];
    const colors: Record<string, string> = {
      'R': 'bg-rubik-red/20 text-rubik-red border-rubik-red/40',
      'L': 'bg-rubik-orange/20 text-rubik-orange border-rubik-orange/40',
      'U': 'bg-rubik-white/20 text-rubik-white border-rubik-white/40',
      'D': 'bg-rubik-yellow/20 text-rubik-yellow border-rubik-yellow/40',
      'F': 'bg-rubik-green/20 text-rubik-green border-rubik-green/40',
      'B': 'bg-rubik-blue/20 text-rubik-blue border-rubik-blue/40',
    };
    return colors[base] || 'bg-muted text-foreground';
  };

  if (executedMoves.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          {t('history', language)}
        </h3>
        <p className="text-xs text-muted-foreground/60 text-center py-4">
          {t('noMoves', language)}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('history', language)}
        </h3>
        <span className="text-xs text-muted-foreground/60">
          {executedMoves.length} {t('moves', language)}
        </span>
      </div>
      
      <ScrollArea className="h-[200px] pr-2">
        <div className="space-y-1">
          {/* Initial state */}
          <button
            onClick={() => goToHistoryPoint(0)}
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors group text-left"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-mono">
              0
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground">
              {t('initialState', language)}
            </span>
            <RotateCcw className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
          </button>
          
          {/* Move history */}
          {executedMoves.map((move, index) => (
            <button
              key={index}
              onClick={() => goToHistoryPoint(index + 1)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors group text-left"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-mono">
                {index + 1}
              </div>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border text-sm ${getMoveColor(move)}`}>
                {move}
              </span>
              <RotateCcw className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
