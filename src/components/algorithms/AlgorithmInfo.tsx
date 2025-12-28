import { useCube } from '@/contexts/CubeContext';
import { t } from '@/lib/rubik/translations';

export function AlgorithmInfo() {
  const { language, selectedAlgorithm } = useCube();

  if (!selectedAlgorithm) {
    return (
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-muted-foreground text-center">
          {t('selectAlgorithm', language)}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border space-y-3">
      <h3 className="text-xl font-bold text-foreground">
        {language === 'pt' ? selectedAlgorithm.namePt : selectedAlgorithm.nameEn}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {language === 'pt' ? selectedAlgorithm.descriptionPt : selectedAlgorithm.descriptionEn}
      </p>
      <div className="pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {t('moveNotation', language)}
        </span>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {t('notationHelp', language)}
        </p>
      </div>
    </div>
  );
}
