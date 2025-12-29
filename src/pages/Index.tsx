// Rubik's Cube Academy - Main Page
import { CubeProvider, useCube } from '@/contexts/CubeContext';
import { Header } from '@/components/layout/Header';
import { FullscreenCubeViewer } from '@/components/mobile/FullscreenCubeViewer';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { MoveDisplay } from '@/components/controls/MoveDisplay';
import { MoveHistory } from '@/components/controls/MoveHistory';
import { SolvedIndicator } from '@/components/controls/SolvedIndicator';
import { ModeSelector } from '@/components/controls/ModeSelector';
import { AlgorithmList } from '@/components/algorithms/AlgorithmList';
import { AlgorithmInfo } from '@/components/algorithms/AlgorithmInfo';
import { TutorialMode } from '@/components/tutorial/TutorialMode';
import { PracticeMode } from '@/components/practice/PracticeMode';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function MobileContent() {
  const { appMode, language } = useCube();
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Import t function inline to avoid circular deps
  const translations = {
    en: { historyShort: 'History', controls: 'Controls', tutorial: 'Tutorial', practice: 'Practice' },
    pt: { historyShort: 'Histórico', controls: 'Controles', tutorial: 'Tutorial', practice: 'Prática' },
  };
  const t = (key: keyof typeof translations.en) => translations[language][key];

  const getControlsLabel = () => {
    if (appMode === 'learn') return t('controls');
    if (appMode === 'tutorial') return t('tutorial');
    return t('practice');
  };

  return (
    <main className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
      {/* Mode selector at top */}
      <div className="flex items-center justify-between gap-2">
        <ModeSelector />
        <SolvedIndicator />
      </div>

      {/* Collapsible tutorial - above history, only in tutorial mode */}
      {appMode === 'tutorial' && (
        <Collapsible open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {t('tutorial')}
              {isTutorialOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="p-3 rounded-lg bg-card/50 border border-border max-h-[40vh] overflow-y-auto">
              <TutorialMode />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Collapsible history - above cube */}
      <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {t('historyShort')}
            {isHistoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="max-h-[30vh] overflow-y-auto">
            <MoveHistory />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cube viewer - takes priority */}
      <div className="flex-shrink-0">
        <FullscreenCubeViewer />
      </div>

      {/* Current move display */}
      <MoveDisplay />

      {/* Collapsible controls section - learn and practice modes only */}
      {appMode !== 'tutorial' && (
        <Collapsible open={isControlsOpen} onOpenChange={setIsControlsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {getControlsLabel()}
              {isControlsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="p-3 rounded-lg bg-card/50 border border-border max-h-[40vh] overflow-y-auto">
              {appMode === 'learn' && (
                <>
                  <AlgorithmList />
                  <div className="mt-4">
                    <PlaybackControls />
                  </div>
                  <AlgorithmInfo />
                </>
              )}
              {appMode === 'practice' && <PracticeMode />}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </main>
  );
}

function DesktopContent() {
  const { appMode } = useCube();

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <aside className="lg:col-span-3 order-3 lg:order-1">
          <div className="lg:sticky lg:top-6 h-auto lg:h-[calc(100vh-120px)] p-4 rounded-xl bg-card/50 border border-border overflow-y-auto">
            {appMode === 'learn' && <AlgorithmList />}
            {appMode === 'tutorial' && <TutorialMode />}
            {appMode === 'practice' && <PracticeMode />}
          </div>
        </aside>

        {/* Center Panel - Cube Viewer */}
        <section className="lg:col-span-6 order-1 lg:order-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <ModeSelector />
            <SolvedIndicator />
          </div>
          <FullscreenCubeViewer />
          <MoveDisplay />
          {appMode === 'learn' && <AlgorithmInfo />}
        </section>

        {/* Right Panel - Controls */}
        <aside className="lg:col-span-3 order-2 lg:order-3">
          <div className="lg:sticky lg:top-6 space-y-4">
            {appMode === 'learn' && <PlaybackControls />}
            <MoveHistory />
          </div>
        </aside>
      </div>
    </main>
  );
}

function MainContent() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileContent /> : <DesktopContent />;
}

const Index = () => {
  return (
    <CubeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <MainContent />
      </div>
    </CubeProvider>
  );
};

export default Index;
