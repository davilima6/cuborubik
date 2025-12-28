import { useCube } from '@/contexts/CubeContext';
import { AppMode } from '@/lib/rubik/types';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MODES: { mode: AppMode; labelEn: string; labelPt: string; icon: React.ReactNode }[] = [
  { mode: 'learn', labelEn: 'Learn', labelPt: 'Aprender', icon: <BookOpen className="h-4 w-4" /> },
  { mode: 'tutorial', labelEn: 'Tutorial', labelPt: 'Tutorial', icon: <GraduationCap className="h-4 w-4" /> },
  { mode: 'practice', labelEn: 'Practice', labelPt: 'Prática', icon: <Gamepad2 className="h-4 w-4" /> },
];

export function ModeSelector() {
  const { appMode, setAppMode, language } = useCube();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
      {MODES.map(({ mode, labelEn, labelPt, icon }) => (
        <motion.div key={mode} whileTap={{ scale: 0.98 }}>
          <Button
            variant={appMode === mode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setAppMode(mode)}
            className={`relative ${appMode === mode ? 'bg-primary text-primary-foreground' : ''}`}
          >
            {icon}
            <span className="ml-2">{language === 'pt' ? labelPt : labelEn}</span>
            {appMode === mode && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 bg-primary rounded-md -z-10"
                transition={{ type: 'spring', duration: 0.3 }}
              />
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
