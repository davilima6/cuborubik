import { Play, Pause, RotateCcw, SkipBack, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useCube } from '@/contexts/CubeContext';
import { t } from '@/lib/rubik/translations';

export function PlaybackControls() {
  const {
    language,
    animationState,
    currentMoves,
    play,
    pause,
    rewind,
    resetCube,
    scrambleCube,
    setSpeed,
  } = useCube();

  const { isPlaying, currentMoveIndex, speed } = animationState;
  const isComplete = currentMoveIndex >= currentMoves.length;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={rewind}
          disabled={currentMoveIndex === 0}
          className="control-button"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={isPlaying ? pause : play}
          className="play-button w-14 h-14 rounded-full"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={resetCube}
          className="control-button"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="secondary"
        onClick={scrambleCube}
        className="w-full gap-2"
      >
        <Shuffle className="h-4 w-4" />
        {t('scramble', language)}
      </Button>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('speed', language)}</span>
          <span className="text-foreground font-mono">{speed}ms</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('fast', language)}</span>
          <Slider
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            min={100}
            max={1000}
            step={50}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">{t('slow', language)}</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {t('step', language)} {currentMoveIndex} {t('of', language)} {currentMoves.length}
        {isComplete && currentMoves.length > 0 && (
          <span className="block text-primary font-medium mt-1">✓ {t('solved', language)}</span>
        )}
      </div>
    </div>
  );
}
