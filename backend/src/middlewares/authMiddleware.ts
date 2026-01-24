import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback');
    (req as any).user = decoded; // Guardamos los datos del usuario en la petición
    next(); // OK
  } catch (error) {
    res.status(400).json({ message: 'Token no válido.' });
  }
};