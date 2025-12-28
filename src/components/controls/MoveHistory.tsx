import { useState } from 'react';
import { useCube } from '@/contexts/CubeContext';
import { Move } from '@/lib/rubik/types';
import { t } from '@/lib/rubik/translations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function MoveHistory() {
  const { language, goToHistoryPoint, cubeHistory, historyIndex, isNavigatingHistory } = useCube();
  const [animateOnClick, setAnimateOnClick] = useState(true);

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

  const canGoBack = historyIndex > 0 && !isNavigatingHistory;
  const canGoForward = historyIndex < cubeHistory.length - 1 && !isNavigatingHistory;

  const handlePrev = () => {
    if (canGoBack) {
      goToHistoryPoint(historyIndex - 1, animateOnClick);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      goToHistoryPoint(historyIndex + 1, animateOnClick);
    }
  };

  const handleHistoryClick = (index: number) => {
    if (!isNavigatingHistory && index !== historyIndex) {
      goToHistoryPoint(index, animateOnClick);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('history', language)}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handlePrev}
            disabled={!canGoBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[40px] text-center">
            {historyIndex} / {cubeHistory.length - 1}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleNext}
            disabled={!canGoForward}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Animate checkbox */}
      <TooltipProvider>
        <div className="flex items-center gap-2 mb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="animate-history"
                  checked={animateOnClick}
                  onCheckedChange={(checked) => setAnimateOnClick(checked === true)}
                  disabled={isNavigatingHistory}
                  className="h-3.5 w-3.5"
                />
                <label
                  htmlFor="animate-history"
                  className="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  {t('animateHistory', language)}
                </label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {language === 'pt' 
                ? 'Animar movimentos ao navegar no histórico' 
                : 'Animate moves when navigating history'}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      
      {cubeHistory.length <= 1 ? (
        <p className="text-xs text-muted-foreground/60 text-center py-4">
          {t('noMoves', language)}
        </p>
      ) : (
        <ScrollArea className="h-[200px] pr-2">
          <div className="space-y-1">
            {cubeHistory.map((entry, index) => {
              const isCurrentPosition = index === historyIndex;
              const isFuture = index > historyIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(index)}
                  disabled={isNavigatingHistory}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors group text-left ${
                    isCurrentPosition 
                      ? 'bg-primary/20 border border-primary/40' 
                      : isFuture 
                        ? 'opacity-50 hover:opacity-100 hover:bg-muted/50'
                        : 'hover:bg-primary/10'
                  } ${isNavigatingHistory ? 'cursor-wait' : ''}`}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono ${
                    isCurrentPosition ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {index}
                  </div>
                  
                  {index === 0 ? (
                    <span className="text-xs text-muted-foreground group-hover:text-foreground">
                      {t('initialState', language)}
                    </span>
                  ) : entry.move ? (
                    <span className={`font-mono font-bold px-2 py-0.5 rounded border text-sm ${getMoveColor(entry.move)}`}>
                      {entry.move}
                    </span>
                  ) : null}
                  
                  {!isCurrentPosition && !isNavigatingHistory && (
                    <RotateCcw className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                  )}
                  
                  {isCurrentPosition && (
                    <span className="ml-auto text-xs text-primary font-medium">
                      {language === 'pt' ? 'atual' : 'current'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
