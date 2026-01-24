import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Se requiere un token.' });
  }

  try {
    const secreto = process.env.JWT_SECRET || 'secret_fallback';
    const decoded = jwt.verify(token, secreto);
    (req as any).user = decoded; // Guardamos los datos del usuario en la petición
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};