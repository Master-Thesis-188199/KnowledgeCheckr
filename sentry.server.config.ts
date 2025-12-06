// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import env from '@/src/lib/Shared/Env'

Sentry.init({
  dsn: 'https://22de8856b24f91e6396a738dcc7268c0@o4510244644847616.ingest.de.sentry.io/4510244646092880',
  enabled: env.NEXT_PUBLIC_MODE === 'production',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0,
  replaysOnErrorSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,
  ignoreErrors: ['NEXT_HTTP_ERROR_FALLBACK;401'],

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
})
