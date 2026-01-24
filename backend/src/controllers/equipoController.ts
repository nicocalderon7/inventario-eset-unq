import { Request, Response } from 'express';
import Equipo from '../models/Equipo.js';
import Categoria from '../models/Categoria.js';

export const getEquipos = async (req: Request, res: Response) => {
  try {
    // Esto trae los equipos Y los datos de la categoría asociada
    const equipos = await Equipo.findAll({
      include: [{ model: Categoria }]
    });
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener equipos', error });
  }
};

export const createEquipo = async (req: Request, res: Response) => {
  try {
    const nuevoEquipo = await Equipo.create(req.body);
    res.status(201).json(nuevoEquipo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear equipo', error });
  }
};