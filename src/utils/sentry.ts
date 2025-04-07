/**
 * Sentry integration for the 2DU Task Management application
 * This provides a centralized way to track errors using Sentry
 */

// Import Sentry SDK
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.VITE_APP_VERSION,
    });
  }
};

// Capture error with Sentry
export const captureError = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error captured by Sentry:', error, context);
  }
};

// Capture message with Sentry
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  } else {
    console.log(`Message captured by Sentry (${level}):`, message, context);
  }
};

// Set user context for Sentry
export const setUserContext = (userId: string, email?: string, username?: string) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser({
      id: userId,
      email,
      username,
    });
  }
};

// Clear user context for Sentry
export const clearUserContext = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser(null);
  }
};

// Add breadcrumb to Sentry
export const addBreadcrumb = (
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
    });
  } else {
    console.log(`Breadcrumb added (${category}):`, message, data);
  }
};

// Start a transaction for performance monitoring
export const startTransaction = (name: string, op: string) => {
  if (process.env.NODE_ENV === 'production') {
    return Sentry.startTransaction({
      name,
      op,
    });
  }
  return null;
};

// Set transaction name
export const setTransactionName = (transaction: Sentry.Transaction | null, name: string) => {
  if (process.env.NODE_ENV === 'production' && transaction) {
    transaction.setName(name);
  }
};

// Finish a transaction
export const finishTransaction = (transaction: Sentry.Transaction | null) => {
  if (process.env.NODE_ENV === 'production' && transaction) {
    transaction.finish();
  }
}; 