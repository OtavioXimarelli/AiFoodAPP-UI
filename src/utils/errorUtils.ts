/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unexpected error occurred';
}

/**
 * Create a standardized error handler for async operations
 */
export function createErrorHandler(
  setError: (error: string | null) => void,
  defaultMessage = 'Operation failed'
) {
  return (error: unknown) => {
    console.error(defaultMessage, error);
    setError(getErrorMessage(error) || defaultMessage);
  };
}
