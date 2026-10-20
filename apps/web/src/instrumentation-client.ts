import posthog from 'posthog-js';
import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-05-24',
    rageclick: false,
    capture_pageleave: false,
    capture_exceptions: false
  });
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [
    Sentry.replayIntegration(),
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: ['moddedwiki'],
      behaviour: 'drop-error-if-exclusively-contains-third-party-frames'
    })
  ],

  denyUrls: [/^chrome-extension:\/\//i, /^moz-extension:\/\//i, /^safari-(web-)?extension:\/\//i],
  ignoreErrors: [/\bGM[._]\w+/],

  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  debug: false
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
