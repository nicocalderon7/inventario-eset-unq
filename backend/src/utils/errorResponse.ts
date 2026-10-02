import { Response } from 'express';

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
    message: 'Error del servidor',
    error: 'Error del servidor',
  });
};
