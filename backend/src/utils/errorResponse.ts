import { Response } from 'express';

type ErrorLike = {
  message?: unknown;
  errors?: Array<{ message?: unknown }>;
  parent?: { detail?: unknown; message?: unknown };
  original?: { detail?: unknown; message?: unknown };
};

export const getErrorMessage = (error: unknown, fallback = 'Error interno') => {
  if (!error || typeof error !== 'object') return fallback;

  const err = error as ErrorLike;
  const validationMessage = err.errors
    ?.map((item) => item.message)
    .find((message): message is string => typeof message === 'string' && message.length > 0);

  if (validationMessage) return validationMessage;
  if (typeof err.parent?.detail === 'string') return err.parent.detail;
  if (typeof err.original?.detail === 'string') return err.original.detail;
  if (typeof err.parent?.message === 'string') return err.parent.message;
  if (typeof err.original?.message === 'string') return err.original.message;
  if (typeof err.message === 'string') return err.message;

  return fallback;
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  error?: unknown
) => {
  if (error) {
    console.error(message, error);
  }

  return res.status(status).json({
    message,
    error: getErrorMessage(error, message),
  });
};
