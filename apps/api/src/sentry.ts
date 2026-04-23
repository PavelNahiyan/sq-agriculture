import * as Sentry from '@sentry/node';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    environment: process.env.NODE_ENV || 'development',
    
    tracesSampleRate: 1.0,
    
    beforeSend(event) {
      if (process.env.NODE_ENV === 'production') {
        return event;
      }
      return null;
    },
    
    ignoreErrors: [
      'Network Error',
      'Failed to fetch',
      /timeout/i,
    ],
  });
}

export { Sentry };