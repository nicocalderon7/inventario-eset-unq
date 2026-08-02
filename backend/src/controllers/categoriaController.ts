import { Request, Response } from 'express';
import Categoria from '../models/Categoria.js';
import { sendError } from '../utils/errorResponse.js';

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    return sendError(res, 500, 'Error al obtener categorías', error);
  }
};

export const createCategoria = async (req: Request, res: Response) => {
  try {
    const nuevaCategoria = await Categoria.create(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    return sendError(res, 400, 'Error al crear categoría', error);
  }
};
