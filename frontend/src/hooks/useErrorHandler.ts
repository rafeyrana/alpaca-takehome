import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  visible: boolean;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState>({
    message: '',
    visible: false,
  });

  const showError = useCallback((message: string) => {
    setError({
      message,
      visible: true,
    });
  }, []);

  const clearError = useCallback(() => {
    setError({
      message: '',
      visible: false,
    });
  }, []);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      showError(error.message);
    } else if (typeof error === 'string') {
      showError(error);
    } else {
      showError('An unexpected error occurred');
    }
  }, [showError]);

  return {
    error,
    showError,
    clearError,
    handleError,
  };
};
