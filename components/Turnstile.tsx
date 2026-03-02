"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: Record<string, unknown>
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadTurnstileScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();

  return new Promise((resolve) => {
    loadCallbacks.push(resolve);
    if (scriptLoading) return;
    scriptLoading = true;

    window.onTurnstileLoad = () => {
      scriptLoaded = true;
      scriptLoading = false;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };

    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export default function Turnstile({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = "auto",
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current !== null) {
      window.turnstile.remove(widgetIdRef.current);
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      callback: onVerify,
      "expired-callback": onExpire,
      "error-callback": onError,
    });
  }, [siteKey, theme, onVerify, onExpire, onError]);

  useEffect(() => {
    loadTurnstileScript().then(renderWidget);
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  return <div ref={containerRef} className={className} />;
}

export function resetTurnstile(widgetContainerRef: HTMLDivElement | null) {
  if (!widgetContainerRef || !window.turnstile) return;
  const widgetId = widgetContainerRef.getAttribute("data-widget-id");
  if (widgetId) {
    window.turnstile.reset(widgetId);
  }
}
