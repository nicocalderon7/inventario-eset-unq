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

export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se envía password, hashearla
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    await usuario.update(req.body);
    
    // No devolver la contraseña
    const { password, ...usuarioSinPassword } = usuario.toJSON();
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar usuario' });
  }
};