import { Globe, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function Header() {
  const { language, setLanguage, renderMode, setRenderMode } = useCube();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="rubik-icon w-10 h-10 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🎲</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {t('title', language)}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t('subtitle', language)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Render Mode Selector */}
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <Select
            value={renderMode}
            onValueChange={(value) => setRenderMode(value as RenderMode)}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3d">{t('mode3d', language)}</SelectItem>
              <SelectItem value="2d">{t('mode2d', language)}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
