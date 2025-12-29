import { useState, useCallback, useEffect, useMemo } from 'react';

// Check if native fullscreen API is supported (safe for SSR)
function checkFullscreenApiSupport(): boolean {
  if (typeof document === 'undefined') return false;
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
  const [isCssFullscreen, setIsCssFullscreen] = useState(false);

  const supportsNativeFullscreen = useMemo(() => checkFullscreenApiSupport(), []);

  const enterFullscreen = useCallback(async () => {
    const element = elementRef.current;

    // If for any reason we don't have the element (race during layout/HMR),
    // still allow CSS "fullscreen" as a safe fallback (important on iOS).
    if (!element) {
      setIsCssFullscreen(true);
      setIsFullscreen(true);
      return;
    }

    const requestNativeFullscreen = async (): Promise<boolean> => {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        return true;
      }
      if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
        return true;
      }
      if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
        return true;
      }
      return false;
    };

    if (supportsNativeFullscreen) {
      try {
        const didRequest = await requestNativeFullscreen();
        if (!didRequest) {
          // Some browsers expose "enabled" flags but don't implement element request methods (notably iOS Safari).
          setIsCssFullscreen(true);
          setIsFullscreen(true);
        }
        // If native request succeeded, the change event will update state.
      } catch (err) {
        console.error('Failed to enter fullscreen:', err);
        // Fallback to CSS fullscreen
        setIsCssFullscreen(true);
        setIsFullscreen(true);
      }
    } else {
      // CSS-only fullscreen for unsupported browsers (iOS Safari)
      setIsCssFullscreen(true);
      setIsFullscreen(true);
    }
  }, [elementRef, supportsNativeFullscreen]);

  const exitFullscreen = useCallback(async () => {
    // If using CSS fullscreen, just toggle state
    if (isCssFullscreen) {
      setIsCssFullscreen(false);
      setIsFullscreen(false);
      return;
    }

    // Otherwise try native exit
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
  }, [supportsNativeFullscreen, isCssFullscreen]);

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
      // Only update if not using CSS fullscreen mode
      if (!isCssFullscreen) {
        setIsFullscreen(isNativeFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [isCssFullscreen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Lock scrolling only for CSS fullscreen mode (iOS / unsupported browsers).
    if (!isCssFullscreen) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyWidth = body.style.width;

    const scrollY = window.scrollY;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.left = prevBodyLeft;
      body.style.right = prevBodyRight;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isCssFullscreen]);

  return { isFullscreen, isCssFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };

}
