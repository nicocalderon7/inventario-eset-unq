import { Request, Response } from 'express';
import sequelize from '../config/database.js';
import Equipo from '../models/Equipo.js';
import Categoria from '../models/Categoria.js';
import Prestamo from '../models/Prestamo.js';
import Mantenimiento from '../models/Mantenimiento.js';
import { sendError } from '../utils/errorResponse.js';

export const getEquipos = async (req: Request, res: Response) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        {
          model: Categoria,
        },
      ],
    });

    const rows = equipos.map((equipo) =>
      equipo.get({ plain: true })
    );

    res.json(rows);
  } catch (error) {
    return sendError(res, 500, 'Error al obtener equipos', error);
  }
};

export const createEquipo = async (req: Request, res: Response) => {
  try {
    const nuevoEquipo = await Equipo.create(req.body);
    res.status(201).json(nuevoEquipo);
  } catch (error) {
    return sendError(res, 400, 'Error al crear equipo', error);
  }
};

export const updateEquipo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);  // ← Conversión a número
    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    await equipo.update(req.body);
    res.json(equipo);
  } catch (error) {
    return sendError(res, 400, 'Error al actualizar equipo', error);
  }
};

export const deleteEquipo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);  // ← Conversión a número
    const eliminado = await sequelize.transaction(async (transaction) => {
      const equipo = await Equipo.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!equipo) return false;

      await Prestamo.destroy({ where: { id_equipo: id }, transaction });
      await Mantenimiento.destroy({ where: { id_equipo: id }, transaction });
      await equipo.destroy({ transaction });
      return true;
    });

    if (!eliminado) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    return sendError(res, 500, 'Error al eliminar equipo', error);
  }
};
