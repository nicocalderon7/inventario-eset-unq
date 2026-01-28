import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Buscamos al usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    // 2. Si el usuario no existe, rechazamos
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Comparamos la contraseña usando el hash real de la DB
    
    /* Opcional: Logs para depuración
    console.log('EMAIL:', email);
    console.log('PASSWORD RECIBIDO:', JSON.stringify(password));
    console.log('HASH DB:', usuario.password);
    */
    const esValida = await bcrypt.compare(password, usuario.password);

    console.log('COMPARE RESULT:', esValida);

    if (!esValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 4. Generamos el token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secret_fallback',
      { expiresIn: '8h' }
    );

    // 5. Respondemos con éxito
    res.json({ 
      message: 'Login exitoso', 
      token, 
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error: any) {
    console.error('ERROR EN LOGIN:', error);
    res.status(500).json({ 
      message: 'Error en el proceso de login', 
      error: error.message 
    });
  }
};