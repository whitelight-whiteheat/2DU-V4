/**
 * Error reporting system for the 2DU Task Management application
 * This provides a centralized way to report errors to Sentry and track them in analytics
 */

import { captureError, captureMessage } from './sentry';
import { analytics } from './analytics';
import { logError } from './errorLogging';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error context interface
export interface ErrorContext {
  componentName?: string;
  actionName?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

// Error report interface
export interface ErrorReport {
  id: string;
  error: Error;
  message: string;
  severity: ErrorSeverity;
  context: ErrorContext;
  timestamp: string;
  userAgent: string;
  url: string;
  stackTrace?: string;
}

// Error reporting class
class ErrorReporter {
  private reports: ErrorReport[] = [];
  private isEnabled: boolean = false;

  constructor() {
    // Enable in production by default
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Enable or disable error reporting
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Report an error
   */
  reportError(
    error: Error,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: ErrorContext = {}
  ): string {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;
    const url = window.location.href;

    const report: ErrorReport = {
      id,
      error,
      message,
      severity,
      context,
      timestamp,
      userAgent,
      url,
      stackTrace: error.stack,
    };

    this.reports.push(report);
    this.saveReports();

    // Log the error
    logError(error, message, {
      componentName: context.componentName || 'unknown',
      actionName: context.actionName || 'unknown',
      userId: context.userId,
      additionalData: {
        ...context.additionalData,
        severity,
        reportId: id,
      },
    });

    // Track in analytics
    analytics.trackError(error.name, error.message, {
      severity,
      reportId: id,
      ...context,
    });

    // Send to Sentry in production
    if (this.isEnabled) {
      captureError(error, {
        severity,
        reportId: id,
        ...context,
      });
    } else {
      console.error('Error reported:', report);
    }

    return id;
  }

  /**
   * Report a critical error
   */
  reportCriticalError(
    error: Error,
    message: string,
    context: ErrorContext = {}
  ): string {
    return this.reportError(error, message, ErrorSeverity.CRITICAL, context);
  }

  /**
   * Report a high severity error
   */
  reportHighSeverityError(
    error: Error,
    message: string,
    context: ErrorContext = {}
  ): string {
    return this.reportError(error, message, ErrorSeverity.HIGH, context);
  }

  /**
   * Report a medium severity error
   */
  reportMediumSeverityError(
    error: Error,
    message: string,
    context: ErrorContext = {}
  ): string {
    return this.reportError(error, message, ErrorSeverity.MEDIUM, context);
  }

  /**
   * Report a low severity error
   */
  reportLowSeverityError(
    error: Error,
    message: string,
    context: ErrorContext = {}
  ): string {
    return this.reportError(error, message, ErrorSeverity.LOW, context);
  }

  /**
   * Report a warning
   */
  reportWarning(message: string, context: ErrorContext = {}): string {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toISOString();

    // Track in analytics
    analytics.trackEvent(analytics.AnalyticsEventType.FEATURE_USED, {
      featureName: 'warning',
      message,
      reportId: id,
      ...context,
    });

    // Send to Sentry in production
    if (this.isEnabled) {
      captureMessage(message, 'warning', {
        reportId: id,
        ...context,
      });
    } else {
      console.warn('Warning reported:', message, context);
    }

    return id;
  }

  /**
   * Get all error reports
   */
  getReports(): ErrorReport[] {
    return this.reports;
  }

  /**
   * Get error report by ID
   */
  getReportById(id: string): ErrorReport | undefined {
    return this.reports.find((report) => report.id === id);
  }

  /**
   * Clear all error reports
   */
  clearReports(): void {
    this.reports = [];
    this.saveReports();
  }

  /**
   * Save reports to localStorage
   */
  private saveReports(): void {
    try {
      localStorage.setItem('errorReports', JSON.stringify(this.reports));
    } catch (e) {
      console.error('Failed to save error reports:', e);
    }
  }

  /**
   * Load reports from localStorage
   */
  private loadReports(): void {
    try {
      const savedReports = localStorage.getItem('errorReports');
      if (savedReports) {
        this.reports = JSON.parse(savedReports);
      }
    } catch (e) {
      console.error('Failed to load error reports:', e);
    }
  }
}

// Export a singleton instance
export const errorReporter = new ErrorReporter();

// Global error handler
export const setupGlobalErrorHandler = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    errorReporter.reportHighSeverityError(
      error,
      'Unhandled Promise Rejection',
      {
        componentName: 'global',
        actionName: 'unhandledRejection',
      }
    );
  });

  // Handle uncaught exceptions
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(event.message);
    errorReporter.reportCriticalError(
      error,
      'Uncaught Exception',
      {
        componentName: 'global',
        actionName: 'uncaughtException',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      }
    );
  });
}; 