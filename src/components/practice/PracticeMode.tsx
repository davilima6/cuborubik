import { useEffect, useCallback } from 'react';
import { useCube } from '@/contexts/CubeContext';
import { Move } from '@/lib/rubik/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shuffle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const FACE_GROUPS = [
  { face: 'U', label: 'Up', color: 'bg-white text-black border border-border' },
  { face: 'D', label: 'Down', color: 'bg-yellow-400 text-black' },
  { face: 'F', label: 'Front', color: 'bg-green-500 text-white' },
  { face: 'B', label: 'Back', color: 'bg-blue-500 text-white' },
  { face: 'L', label: 'Left', color: 'bg-orange-500 text-white' },
  { face: 'R', label: 'Right', color: 'bg-red-500 text-white' },
] as const;

// Keyboard mappings
const KEY_TO_FACE: Record<string, 'U' | 'D' | 'F' | 'B' | 'L' | 'R'> = {
  'u': 'U',
  'd': 'D',
  'f': 'F',
  'b': 'B',
  'l': 'L',
  'r': 'R',
};

export function PracticeMode() {
  const { 
    language, 
    executeMove, 
    scrambleCube, 
    resetCube,
    executedMoves,
    rotationAnimation,
    appMode,
  } = useCube();

  const handleMoveClick = useCallback((move: Move) => {
    if (rotationAnimation?.isAnimating) return;
    executeMove(move);
  }, [rotationAnimation?.isAnimating, executeMove]);

  // Keyboard shortcuts - only active in practice mode
  useEffect(() => {
    if (appMode !== 'practice') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const key = e.key.toLowerCase();
      const face = KEY_TO_FACE[key];
      
      if (face && !rotationAnimation?.isAnimating) {
        e.preventDefault();
        
        // Shift = prime (counter-clockwise), Ctrl/Cmd = double
        let move: Move;
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          // Should not happen often, but handle gracefully
          move = face as Move;
        } else if (e.shiftKey) {
          move = `${face}'` as Move;
        } else if (e.ctrlKey || e.metaKey) {
          move = `${face}2` as Move;
        } else {
          move = face as Move;
        }
        
        executeMove(move);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appMode, rotationAnimation?.isAnimating, executeMove]);

  const getMoveButtons = (face: string): { move: Move; label: string }[] => [
    { move: face as Move, label: face },
    { move: `${face}'` as Move, label: `${face}'` },
    { move: `${face}2` as Move, label: `${face}2` },
  ];

  return (
    <TooltipProvider>
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-primary">
              {language === 'pt' ? 'Modo Prática' : 'Practice Mode'}
            </CardTitle>
            <Badge variant="secondary">
              {executedMoves.length} {language === 'pt' ? 'movimentos' : 'moves'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrambleCube}
              className="flex-1"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Embaralhar' : 'Scramble'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetCube}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Resetar' : 'Reset'}
            </Button>
          </div>

          {/* Keyboard hint */}
          <p className="text-xs text-muted-foreground text-center">
            {language === 'pt' 
              ? 'Teclado: U D F B L R (+ Shift = inverso)' 
              : 'Keyboard: U D F B L R (+ Shift = inverse)'}
          </p>

          {/* Move buttons grouped by face */}
          <div className="grid grid-cols-2 gap-3">
            {FACE_GROUPS.map(({ face, label, color }) => (
              <div key={face} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  <kbd className="ml-auto text-[10px] bg-muted px-1 rounded font-mono">{face}</kbd>
                </div>
                <div className="flex gap-1">
                  {getMoveButtons(face).map(({ move, label }) => (
                    <Tooltip key={move}>
                      <TooltipTrigger asChild>
                        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveClick(move)}
                            disabled={rotationAnimation?.isAnimating}
                            className="w-full font-mono text-xs hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-1"
                            tabIndex={0}
                          >
                            {label}
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {move.includes("'") 
                          ? (language === 'pt' ? 'Anti-horário' : 'Counter-clockwise')
                          : move.includes("2")
                            ? (language === 'pt' ? 'Meia volta' : 'Half turn')
                            : (language === 'pt' ? 'Horário' : 'Clockwise')}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recent moves */}
          {executedMoves.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                {language === 'pt' ? 'Últimos movimentos:' : 'Recent moves:'}
              </p>
              <div className="flex flex-wrap gap-1">
                {executedMoves.slice(-12).map((move, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono"
                  >
                    {move}
                  </span>
                ))}
                {executedMoves.length > 12 && (
                  <span className="text-xs text-muted-foreground">
                    +{executedMoves.length - 12}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}