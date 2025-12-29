import { useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const { isFullscreen, isCssFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen(containerRef);
  const isMobile = useIsMobile();
  const showFullscreenButton = isFullscreenSupported();

  const portalFullscreen = isFullscreen && isCssFullscreen;
  const canPortal = typeof document !== 'undefined';

  const content = (
    <>
      {/* Fullscreen header */}
      {isFullscreen && (
        <header className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <SolvedIndicator />
          <Button
            variant="outline"
            size="icon"
            onClick={exitFullscreen}
            className="bg-background/80 backdrop-blur-sm"
            aria-label="Fechar tela cheia"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>
      )}

      {/* Cube viewer container */}
      <div
        className={
          `relative w-full ${isFullscreen ? 'h-full flex items-center justify-center p-4 sm:p-8' : ''}`
        }
      >
        <div
          className={
            isFullscreen
              ? 'w-full h-full aspect-square max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-8rem)]'
              : 'w-full'
          }
        >
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
          aria-label="Tela cheia"
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
          aria-label="Sair da tela cheia"
        >
          <Minimize className="h-5 w-5" />
        </Button>
      )}
    </>
  );

  // CSS fullscreen (iOS): render via portal to avoid iOS fixed-position/stacking-context quirks.
  if (portalFullscreen && canPortal) {
    return (
      <>
        {/* Keep an on-page anchor so the ref always exists for the hook */}
        <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden" />

        {createPortal(
          <div
            className={
              `fixed inset-0 z-50 bg-background w-[100vw] h-[100dvh] ` +
              `pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ` +
              `pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] ` +
              `flex flex-col items-center justify-center overscroll-none`
            }
          >
            {content}
          </div>,
          document.body
        )}
      </>
    );
  }

  // Native fullscreen (desktop/Android): keep the element itself as the fullscreen target.
  return (
    <div
      ref={containerRef}
      className={
        `relative w-full rounded-xl overflow-hidden ` +
        (isFullscreen
          ? 'fixed inset-0 z-50 bg-background w-[100vw] h-[100dvh] flex flex-col items-center justify-center rounded-none overscroll-none'
          : '')
      }
    >
      {content}
    </div>
  );
}

