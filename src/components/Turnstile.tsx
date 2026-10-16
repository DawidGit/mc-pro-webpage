import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile widget — clean TypeScript, zero dependencies.
 * Loads the official script lazily and renders the widget into a div.
 * https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

// Official Cloudflare test site keys — always pass verification.
// https://developers.cloudflare.com/turnstile/testing/
export const TURNSTILE_TEST_SITE_KEY_ALWAYS_PASSES = '1x00000000000000000000AA';

interface TurnstileOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
}

interface TurnstileApi {
  render: (el: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onloadTurnstileCallback?: () => void;
  }
}

let scriptLoading: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoading = null;
      reject(new Error('Failed to load the Cloudflare Turnstile script.'));
    };
    document.head.appendChild(script);
  });

  return scriptLoading;
}

export interface TurnstileProps {
  siteKey: string;
  theme?: 'light' | 'dark' | 'auto';
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  /** Reset the widget (e.g. after a failed submission — tokens are single-use). */
  resetSignal?: number;
}

export function Turnstile({
  siteKey,
  theme = 'dark',
  onVerify,
  onExpire,
  onError,
  resetSignal = 0,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Keep the latest callbacks in refs so the widget is not re-rendered
  // (and the challenge re-triggered) on every parent re-render.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  }, [onVerify, onExpire, onError]);

  const renderWidget = useCallback(() => {
    const container = containerRef.current;
    if (!container || !window.turnstile || widgetIdRef.current !== null) return;

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: siteKey,
      theme,
      callback: (token: string) => onVerifyRef.current(token),
      'expired-callback': () => onExpireRef.current?.(),
      'error-callback': () => onErrorRef.current?.(),
    });
  }, [siteKey, theme]);

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (!cancelled) renderWidget();
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  // External reset (increment resetSignal to reset the challenge).
  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  if (loadError) {
    return (
      <p className="text-sm font-body text-white/60" role="alert">
        Spam protection failed to load. Please refresh the page or contact us directly at
        (312) 405-0066.
      </p>
    );
  }

  return <div ref={containerRef} className="min-h-[65px]" aria-label="Cloudflare Turnstile captcha" />;
}

export default Turnstile;
