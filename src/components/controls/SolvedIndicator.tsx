import { useCube } from '@/contexts/CubeContext';
import { isSolved } from '@/lib/rubik/cubeLogic';
import { t } from '@/lib/rubik/translations';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SolvedIndicator() {
  const { cubeState, language } = useCube();
  const solved = isSolved(cubeState);

  return (
    <AnimatePresence mode="wait">
      {solved ? (
        <motion.div
          key="solved"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 text-green-400"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{t('solved', language)}</span>
        </motion.div>
      ) : (
        <motion.div
          key="unsolved"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-muted-foreground"
        >
          <XCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{t('unsolved', language)}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
