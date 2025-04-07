/**
 * Error logging utility for the 2DU Task Management application
 * This provides a centralized way to log errors and send them to monitoring services
 */

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error context interface
export interface ErrorContext {
  componentName?: string;
  actionName?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

interface ErrorLogData {
  componentName: string;
  actionName: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

/**
 * Logs an error with contextual information
 * @param error The error object
 * @param message A descriptive message about the error
 * @param data Additional context about the error
 */
export const logError = (error: Error, message: string, data: ErrorLogData) => {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context: {
      message,
      ...data,
    },
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Log:', errorLog);
  }

  // In production, you would send this to your error tracking service
  // Example: Sentry.captureException(error, { extra: errorLog });
  
  // For now, we'll store in localStorage for persistence
  try {
    const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    const updatedLogs = [...existingLogs, errorLog].slice(-100); // Keep last 100 errors
    localStorage.setItem('errorLogs', JSON.stringify(updatedLogs));
  } catch (e) {
    console.error('Failed to store error log:', e);
  }
};

/**
 * Retrieves stored error logs
 * @returns Array of error logs
 */
export const getErrorLogs = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  } catch (e) {
    console.error('Failed to retrieve error logs:', e);
    return [];
  }
};

/**
 * Clears all stored error logs
 */
export const clearErrorLogs = () => {
  try {
    localStorage.removeItem('errorLogs');
  } catch (e) {
    console.error('Failed to clear error logs:', e);
  }
};

// Firebase-specific error logging
export const logFirebaseError = (
  error: Error,
  operation: string,
  context?: ErrorContext
): void => {
  logError(
    error,
    ErrorSeverity.HIGH,
    {
      ...context,
      actionName: `firebase_${operation}`,
      additionalData: {
        ...context?.additionalData,
        firebaseErrorCode: (error as any).code,
        firebaseErrorMessage: (error as any).message
      }
    }
  );
};

// API error logging
export const logApiError = (
  error: Error,
  endpoint: string,
  method: string,
  context?: ErrorContext
): void => {
  logError(
    error,
    ErrorSeverity.MEDIUM,
    {
      ...context,
      actionName: `api_${method.toLowerCase()}_${endpoint.replace(/\//g, '_')}`,
      additionalData: {
        ...context?.additionalData,
        endpoint,
        method
      }
    }
  );
};

// Authentication error logging
export const logAuthError = (
  error: Error,
  action: string,
  context?: ErrorContext
): void => {
  logError(
    error,
    ErrorSeverity.HIGH,
    {
      ...context,
      actionName: `auth_${action}`,
      additionalData: {
        ...context?.additionalData,
        authAction: action
      }
    }
  );
};

// Task operation error logging
export const logTaskError = (
  error: Error,
  operation: string,
  taskId?: string,
  context?: ErrorContext
): void => {
  logError(
    error,
    ErrorSeverity.MEDIUM,
    {
      ...context,
      actionName: `task_${operation}`,
      additionalData: {
        ...context?.additionalData,
        taskId,
        operation
      }
    }
  );
}; 