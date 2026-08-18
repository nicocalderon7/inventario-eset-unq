export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object') {
    const maybeError = error as {
      message?: unknown;
      response?: {
        data?: {
          error?: unknown;
          message?: unknown;
          detail?: unknown;
        };
      };
    };

    const data = maybeError.response?.data;

    if (typeof data?.error === 'string') return data.error;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.detail === 'string') return data.detail;
    if (typeof maybeError.message === 'string') return maybeError.message;
  }

  return fallback;
};
