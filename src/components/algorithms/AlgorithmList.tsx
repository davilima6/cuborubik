import { useCube } from '@/contexts/CubeContext';
import { ALGORITHMS } from '@/lib/rubik/algorithms';
import { t } from '@/lib/rubik/translations';
import { cn } from '@/lib/utils';

export function AlgorithmList() {
  const { language, selectedAlgorithm, selectAlgorithm } = useCube();

  const categories = ['beginner', 'oll', 'pll'] as const;
  const categoryNames: Record<string, { en: string; pt: string }> = {
    beginner: { en: 'Beginner', pt: 'Iniciante' },
    oll: { en: 'OLL', pt: 'OLL' },
    pll: { en: 'PLL', pt: 'PLL' },
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <h3 className="text-lg font-semibold text-foreground">
        {t('algorithms', language)}
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {categories.map((category) => {
          const categoryAlgorithms = ALGORITHMS.filter(a => a.category === category);
          if (categoryAlgorithms.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {categoryNames[category][language]}
              </h4>
              <div className="space-y-1">
                {categoryAlgorithms.map((algorithm) => (
                  <button
                    key={algorithm.id}
                    onClick={() => selectAlgorithm(algorithm)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all duration-200',
                      'hover:bg-accent/50',
                      selectedAlgorithm?.id === algorithm.id
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'bg-card border-l-4 border-transparent hover:border-muted-foreground/30'
                    )}
                  >
                    <div className="font-medium text-foreground">
                      {language === 'pt' ? algorithm.namePt : algorithm.nameEn}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono">
                      {algorithm.moves.join(' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
