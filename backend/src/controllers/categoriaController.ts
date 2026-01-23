import { Request, Response } from 'express';
import Categoria from '../models/Categoria.js';

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};

export const createCategoria = async (req: Request, res: Response) => {
  try {
    const nuevaCategoria = await Categoria.create(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear categoría', error });
  }
};