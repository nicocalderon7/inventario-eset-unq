import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas (email)' });
    }

    // 2. Comparar la contraseña enviada con el hash guardado
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: 'Credenciales inválidas (password)' });
    }

    // 3. Generar el Token JWT
    // Usamos la variable de entorno que configuraste en Railway
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secret_fallback', //
      { expiresIn: '8h' } // El token dura una jornada laboral
    );

    // 4. Responder con el token y datos básicos del usuario
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el proceso de login' });
  }
};