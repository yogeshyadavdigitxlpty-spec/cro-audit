import { useEffect } from 'react';

/**
 * When this app is embedded in an <iframe> (e.g. on a WordPress page),
 * the parent page has no way to know how tall the content actually is.
 * This reports the document height to the parent via postMessage so the
 * parent page's iframe element can be resized to match — no more guessing
 * a fixed height or dealing with double scrollbars.
 *
 * Pairs with the resize listener snippet given to the WordPress embed.
 * No-ops entirely when the app is not running inside an iframe.
 */
export function useIframeAutoResize() {
  useEffect(() => {
    if (window.parent === window) return; // not embedded, nothing to do

    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'audit-app:resize', height }, '*');
    };

    sendHeight();

    // Re-report whenever the page's content changes size (results loading
    // in, error messages appearing, device toggle changing layout, etc).
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);

    window.addEventListener('load', sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', sendHeight);
    };
  }, []);
}
