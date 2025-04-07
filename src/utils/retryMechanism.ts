/**
 * Retry mechanism utility for the 2DU Task Management application
 * This provides a way to retry failed operations with exponential backoff
 */

import { logError } from './errorLogging';

// Retry options interface
export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: Error) => boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

// Default retry options
const defaultOptions: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryCondition: () => true, // Retry on all errors by default
  onRetry: () => {} // No-op by default
};

/**
 * Retry a function with exponential backoff
 * @param fn The function to retry
 * @param options Retry options
 * @returns The result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let attempt = 0;
  let delay = opts.initialDelay!;

  while (true) {
    try {
      attempt++;
      return await fn();
    } catch (error) {
      const err = error as Error;
      
      // Check if we should retry this error
      if (!opts.retryCondition!(err)) {
        throw err;
      }
      
      // Check if we've reached the maximum number of attempts
      if (attempt >= opts.maxAttempts!) {
        logError(err, 'Retry mechanism failed after maximum attempts', {
          actionName: 'retry_mechanism',
          additionalData: {
            maxAttempts: opts.maxAttempts,
            finalAttempt: attempt
          }
        });
        throw err;
      }
      
      // Call the onRetry callback
      opts.onRetry!(attempt, err);
      
      // Log the retry
      console.warn(
        `Retry attempt ${attempt}/${opts.maxAttempts} after error: ${err.message}`
      );
      
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increase the delay for the next attempt (exponential backoff)
      delay = Math.min(delay * opts.backoffFactor!, opts.maxDelay!);
    }
  }
}

/**
 * Create a retryable function that can be called multiple times
 * @param fn The function to make retryable
 * @param options Retry options
 * @returns A function that can be called with the same arguments as the original function
 */
export function createRetryable<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return retry(() => fn(...args), options);
  }) as T;
}

/**
 * Retry a Firebase operation with specific Firebase error handling
 * @param operation The Firebase operation to retry
 * @param operationName The name of the operation for logging
 * @param options Retry options
 * @returns The result of the operation
 */
export async function retryFirebaseOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: RetryOptions = {}
): Promise<T> {
  // Custom retry condition for Firebase errors
  const firebaseRetryCondition = (error: Error): boolean => {
    // Retry on network errors or Firebase-specific errors that might be temporary
    const firebaseError = error as any;
    const errorCode = firebaseError.code || '';
    
    // List of Firebase error codes that might be temporary
    const temporaryErrorCodes = [
      'network-error',
      'unavailable',
      'deadline-exceeded',
      'resource-exhausted',
      'aborted',
      'cancelled'
    ];
    
    return temporaryErrorCodes.some(code => errorCode.includes(code));
  };
  
  return retry(operation, {
    ...options,
    retryCondition: firebaseRetryCondition,
    onRetry: (attempt, error) => {
      console.warn(
        `Retrying Firebase operation "${operationName}" (attempt ${attempt}): ${error.message}`
      );
      options.onRetry?.(attempt, error);
    }
  });
} 