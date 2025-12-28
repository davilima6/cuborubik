import { useCube } from '@/contexts/CubeContext';
import { t } from '@/lib/rubik/translations';
import { TUTORIAL_PHASES, getTotalTutorialSteps, getStepByGlobalIndex } from '@/lib/rubik/tutorial';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Play, RotateCcw, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TutorialMode() {
  const { 
    language, 
    tutorialState, 
    nextTutorialStep, 
    prevTutorialStep,
    playTutorialStep,
    resetTutorialStep,
  } = useCube();

  const totalSteps = getTotalTutorialSteps();
  const currentStepData = getStepByGlobalIndex(tutorialState.currentStepIndex);
  
  if (!currentStepData) return null;

  const { phase, step, phaseIndex } = currentStepData;
  const progress = ((tutorialState.currentStepIndex + 1) / totalSteps) * 100;

  const title = language === 'pt' ? step.titlePt : step.titleEn;
  const description = language === 'pt' ? step.descriptionPt : step.descriptionEn;
  const phaseName = language === 'pt' ? phase.namePt : phase.nameEn;
  const tip = language === 'pt' ? step.tipPt : step.tipEn;

  return (
    <Card className="bg-card/80 backdrop-blur border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary">
            {language === 'pt' ? 'Tutorial' : 'Tutorial'}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {tutorialState.currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Phase indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          {TUTORIAL_PHASES.map((p, i) => (
            <div
              key={p.id}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                i === phaseIndex 
                  ? 'bg-primary text-primary-foreground' 
                  : i < phaseIndex 
                    ? 'bg-primary/30 text-primary' 
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {language === 'pt' ? p.namePt : p.nameEn}
            </div>
          ))}
        </div>

        {/* Current step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>

            {/* Moves display */}
            {step.moves.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {language === 'pt' ? 'Movimentos:' : 'Moves:'}
                </span>
                {step.moves.map((move, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded text-sm font-mono ${
                      tutorialState.stepMoveIndex > i
                        ? 'bg-primary text-primary-foreground'
                        : tutorialState.stepMoveIndex === i && tutorialState.isPlayingStep
                          ? 'bg-accent text-accent-foreground animate-pulse'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {move}
                  </span>
                ))}
              </div>
            )}

            {/* Tip */}
            {tip && (
              <div className="flex items-start gap-2 p-2 rounded bg-accent/20 border border-accent/30">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent-foreground">{tip}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTutorialStep}
            disabled={tutorialState.currentStepIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'pt' ? 'Anterior' : 'Previous'}
          </Button>

          <div className="flex items-center gap-2">
            {step.moves.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetTutorialStep}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={playTutorialStep}
                  disabled={tutorialState.isPlayingStep}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Executar' : 'Execute'}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextTutorialStep}
            disabled={tutorialState.currentStepIndex >= totalSteps - 1}
          >
            {language === 'pt' ? 'Próximo' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
