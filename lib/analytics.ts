"use client";

import { sendGAEvent } from '@next/third-parties/google';

export function trackEvent(
  eventName: string,
  eventCategory?: string,
  eventValue?: string
) {
  if (typeof window !== 'undefined') {
    sendGAEvent('event', eventName, {
      category: eventCategory,
      value: eventValue,
    });
  }
}
