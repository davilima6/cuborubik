import { Monitor } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCube } from '@/contexts/CubeContext';
import { t } from '@/lib/rubik/translations';
import { RenderMode, Language } from '@/lib/rubik/types';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const { language, setLanguage, renderMode, setRenderMode } = useCube();
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="rubik-icon w-10 h-10 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🎲</span>
        </div>
        <div className={isMobile ? 'hidden' : ''}>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {t('title', language)}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t('subtitle', language)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector - First on mobile so it's visible */}
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as Language)}
        >
          <SelectTrigger className="w-[60px] h-9" aria-label={language === 'pt' ? 'Idioma' : 'Language'}>
            <SelectValue>
              <span 
                role="img" 
                aria-label={language === 'pt' ? 'Português Brasileiro' : 'American English'}
                className="text-lg"
              >
                {language === 'pt' ? '🇧🇷' : '🇺🇸'}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt">
              <span className="flex items-center gap-2">
                <span role="img" aria-label="Português Brasileiro" className="text-lg">🇧🇷</span>
                <span className="sr-only sm:not-sr-only">Português</span>
              </span>
            </SelectItem>
            <SelectItem value="en">
              <span className="flex items-center gap-2">
                <span role="img" aria-label="American English" className="text-lg">🇺🇸</span>
                <span className="sr-only sm:not-sr-only">English</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Render Mode Selector */}
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select
            value={renderMode}
            onValueChange={(value) => setRenderMode(value as RenderMode)}
          >
            <SelectTrigger className="w-[80px] sm:w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3d">{t('mode3d', language)}</SelectItem>
              <SelectItem value="2d">{t('mode2d', language)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
