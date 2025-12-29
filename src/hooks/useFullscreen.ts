import { useState, useCallback, useEffect } from 'react';

// Check if native fullscreen API is supported
export function isFullscreenApiSupported(): boolean {
  return !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).msFullscreenEnabled
  );
}

// We always show the fullscreen button (use CSS fallback on unsupported browsers)
export function isFullscreenSupported(): boolean {
  return true;
}

export function useFullscreen(elementRef: React.RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supportsNativeFullscreen = isFullscreenApiSupported();

  const enterFullscreen = useCallback(async () => {
    const element = elementRef.current;
    if (!element) return;

    if (supportsNativeFullscreen) {
      try {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } catch (err) {
        console.error('Failed to enter fullscreen:', err);
        // Fallback to CSS fullscreen
        setIsFullscreen(true);
      }
    } else {
      // CSS-only fullscreen for unsupported browsers (iOS Safari)
      setIsFullscreen(true);
    }
  }, [elementRef, supportsNativeFullscreen]);

  const exitFullscreen = useCallback(async () => {
    if (supportsNativeFullscreen && document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } catch (err) {
        console.error('Failed to exit fullscreen:', err);
        setIsFullscreen(false);
      }
    } else {
      setIsFullscreen(false);
    }
  }, [supportsNativeFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );
      setIsFullscreen(isNativeFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
}
