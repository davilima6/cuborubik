import { CubeProvider } from '@/contexts/CubeContext';
import { Header } from '@/components/layout/Header';
import { CubeViewer } from '@/components/cube/CubeViewer';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { MoveDisplay } from '@/components/controls/MoveDisplay';
import { MoveHistory } from '@/components/controls/MoveHistory';
import { SolvedIndicator } from '@/components/controls/SolvedIndicator';
import { AlgorithmList } from '@/components/algorithms/AlgorithmList';
import { AlgorithmInfo } from '@/components/algorithms/AlgorithmInfo';

const Index = () => {
  return (
    <CubeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Algorithm List */}
            <aside className="lg:col-span-3 order-3 lg:order-1">
              <div className="lg:sticky lg:top-6 h-auto lg:h-[calc(100vh-120px)] p-4 rounded-xl bg-card/50 border border-border">
                <AlgorithmList />
              </div>
            </aside>

            {/* Center Panel - Cube Viewer */}
            <section className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <div className="flex justify-center">
                <SolvedIndicator />
              </div>
              <CubeViewer />
              <MoveDisplay />
              <AlgorithmInfo />
            </section>

            {/* Right Panel - Controls */}
            <aside className="lg:col-span-3 order-2 lg:order-3">
              <div className="lg:sticky lg:top-6 space-y-4">
                <PlaybackControls />
                <MoveHistory />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </CubeProvider>
  );
};

export default Index;
