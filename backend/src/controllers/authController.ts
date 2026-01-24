import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    // Debug en consola de Railway (no se ve en Postman por seguridad)
    if (!usuario) {
      console.log(`Intentado login fallido: ${email} no existe.`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 2. Comparar contraseñas
    // Gracias al 'declare' en el modelo, usuario.password ahora tiene el hash real
    const esValida = await bcrypt.compare(password, usuario.password);
    
    if (!esValida) {
      console.log(`Password incorrecta para: ${email}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Generar el Token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("CRÍTICO: No se encontró la variable JWT_SECRET en Railway");
      // No frenamos el login si hay un fallback, pero avisamos en logs
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      secret || 'secret_fallback',
      { expiresIn: '8h' }
    );

    // 4. Éxito
    console.log(`Login exitoso: ${usuario.email} (Rol: ${usuario.rol})`);
    
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
      }
    });

  } catch (error: any) {
    // Capturamos el error exacto para verlo en Railway Logs
    console.error('ERROR EN LOGIN:', error.message);
    res.status(500).json({ 
      message: 'Error en el proceso de login',
      error: error.message 
    });
  }
};