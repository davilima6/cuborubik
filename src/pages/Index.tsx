// Rubik's Cube Academy - Main Page
import { CubeProvider, useCube } from '@/contexts/CubeContext';
import { Header } from '@/components/layout/Header';
import { CubeViewer } from '@/components/cube/CubeViewer';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { MoveDisplay } from '@/components/controls/MoveDisplay';
import { MoveHistory } from '@/components/controls/MoveHistory';
import { SolvedIndicator } from '@/components/controls/SolvedIndicator';
import { ModeSelector } from '@/components/controls/ModeSelector';
import { AlgorithmList } from '@/components/algorithms/AlgorithmList';
import { AlgorithmInfo } from '@/components/algorithms/AlgorithmInfo';
import { TutorialMode } from '@/components/tutorial/TutorialMode';
import { PracticeMode } from '@/components/practice/PracticeMode';

function MainContent() {
  const { appMode } = useCube();

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <aside className="lg:col-span-3 order-3 lg:order-1">
          <div className="lg:sticky lg:top-6 h-auto lg:h-[calc(100vh-120px)] p-4 rounded-xl bg-card/50 border border-border">
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
          <CubeViewer />
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
