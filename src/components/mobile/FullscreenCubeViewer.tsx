import { useRef } from 'react';
import { useCube } from '@/contexts/CubeContext';
import { Cube2D } from '@/components/cube/Cube2D';
import { Cube3D } from '@/components/cube/Cube3D';
import { MobileTouchControls } from './MobileTouchControls';
import { useFullscreen, isFullscreenSupported } from '@/hooks/useFullscreen';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, X } from 'lucide-react';
import { SolvedIndicator } from '@/components/controls/SolvedIndicator';

export function FullscreenCubeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cubeState, renderMode, rotationAnimation } = useCube();
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen(containerRef);
  const isMobile = useIsMobile();
  const showFullscreenButton = isFullscreenSupported();

  return (
    <div 
      ref={containerRef}
      className={`
        relative w-full rounded-xl overflow-hidden
        ${isFullscreen 
          ? 'fixed inset-0 z-50 bg-background flex flex-col items-center justify-center rounded-none' 
          : ''
        }
      `}
      style={{ background: isFullscreen ? 'hsl(var(--background))' : undefined }}
    >
      {/* Fullscreen header */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <SolvedIndicator />
          <Button
            variant="outline"
            size="icon"
            onClick={exitFullscreen}
            className="bg-background/80 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Cube viewer container */}
      <div className={`relative ${isFullscreen ? 'w-full h-full flex items-center justify-center p-8' : ''}`}>
        <div className={isFullscreen ? 'w-full h-full max-w-[90vh] max-h-[90vw] aspect-square' : 'w-full'}>
          {renderMode === '2d' ? (
            <Cube2D cubeState={cubeState} isFullscreen={isFullscreen} />
          ) : (
            <Cube3D cubeState={cubeState} rotationAnimation={rotationAnimation} isFullscreen={isFullscreen} />
          )}
        </div>
        
        {/* Mobile touch controls overlay */}
        {isMobile && <MobileTouchControls />}
      </div>

      {/* Fullscreen toggle button (non-fullscreen mode) */}
      {showFullscreenButton && !isFullscreen && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm opacity-70 hover:opacity-100"
          aria-label="Toggle fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      )}

      {/* Minimize button in fullscreen */}
      {isFullscreen && showFullscreenButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 z-20 bg-background/80 backdrop-blur-sm"
          aria-label="Exit fullscreen"
        >
          <Minimize className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
