import { useCallback, useEffect, useState } from 'react';

/**
 * Cross-browser fullscreen support. Returns whether the page (or a specific
 * element) is currently fullscreen and a toggle function.
 */
export function useFullscreen(target?: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    onChange();
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enter = useCallback(async () => {
    const el = target?.current ?? document.documentElement;
    try {
      await el.requestFullscreen();
    } catch {
      /* Safari/TV browsers may reject; the app still works windowed. */
    }
  }, [target]);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) void exit();
    else void enter();
  }, [enter, exit]);

  return { isFullscreen, enter, exit, toggle };
}
