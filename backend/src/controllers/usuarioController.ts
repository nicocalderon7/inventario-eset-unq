import { Request, Response } from 'express';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, password, rol, email, area } = req.body;

    // Encriptamos la contraseña (10 es el nivel de seguridad)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      password: hashedPassword, // Guardamos la versión segura
      rol,
      email,
      area
    });

    res.status(201).json({ message: "Usuario creado", id: nuevoUsuario.id });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear usuario', error });
  }
};

export const getUsuarios = async (req: Request, res: Response) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password'] } // NUNCA devolvemos la contraseña
      });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error', error });
    }
  };