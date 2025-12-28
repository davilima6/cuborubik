import { useCube } from '@/contexts/CubeContext';
import { t } from '@/lib/rubik/translations';
import { Move } from '@/lib/rubik/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const MOVE_BUTTONS: { move: Move; label: string }[] = [
  { move: 'U', label: 'U' },
  { move: "U'", label: "U'" },
  { move: 'U2', label: 'U2' },
  { move: 'D', label: 'D' },
  { move: "D'", label: "D'" },
  { move: 'D2', label: 'D2' },
  { move: 'F', label: 'F' },
  { move: "F'", label: "F'" },
  { move: 'F2', label: 'F2' },
  { move: 'B', label: 'B' },
  { move: "B'", label: "B'" },
  { move: 'B2', label: 'B2' },
  { move: 'L', label: 'L' },
  { move: "L'", label: "L'" },
  { move: 'L2', label: 'L2' },
  { move: 'R', label: 'R' },
  { move: "R'", label: "R'" },
  { move: 'R2', label: 'R2' },
];

const FACE_GROUPS = [
  { face: 'U', label: 'Up', color: 'bg-white text-black' },
  { face: 'D', label: 'Down', color: 'bg-yellow-400 text-black' },
  { face: 'F', label: 'Front', color: 'bg-green-500 text-white' },
  { face: 'B', label: 'Back', color: 'bg-blue-500 text-white' },
  { face: 'L', label: 'Left', color: 'bg-orange-500 text-white' },
  { face: 'R', label: 'Right', color: 'bg-red-500 text-white' },
];

export function PracticeMode() {
  const { 
    language, 
    executeMove, 
    scrambleCube, 
    resetCube,
    executedMoves,
    rotationAnimation,
  } = useCube();

  const handleMoveClick = (move: Move) => {
    if (rotationAnimation?.isAnimating) return;
    executeMove(move);
  };

  return (
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

        {/* Move buttons grouped by face */}
        <div className="space-y-3">
          {FACE_GROUPS.map(({ face, label, color }) => (
            <div key={face} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <div className="flex gap-1">
                {MOVE_BUTTONS.filter(m => m.move.startsWith(face)).map(({ move, label }) => (
                  <motion.div key={move} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveClick(move)}
                      disabled={rotationAnimation?.isAnimating}
                      className="w-12 font-mono text-sm hover:bg-primary hover:text-primary-foreground"
                    >
                      {label}
                    </Button>
                  </motion.div>
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
  );
}
