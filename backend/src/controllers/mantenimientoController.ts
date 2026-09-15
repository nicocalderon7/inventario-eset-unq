import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import Equipo from '../models/Equipo.js';
import Mantenimiento from '../models/Mantenimiento.js';
import { sendError } from '../utils/errorResponse.js';

export const crearMantenimiento = async (req: Request, res: Response) => {
  try {
    const { id_equipo, fecha_inicio, descripcion_falla, responsable, repuestos, observaciones, estado = 'pendiente', fecha_fin } = req.body;

    const datos = {
      id_equipo, fecha_inicio, descripcion_falla, responsable, repuestos, observaciones, estado,
      fecha_fin: estado === 'completado' ? fecha_fin || new Date() : null,
    };
    const mantenimiento = await sequelize.transaction(async transaction => {
      const equipo = await Equipo.findByPk(datos.id_equipo, { transaction, lock: transaction.LOCK.UPDATE });
      if (!equipo) throw new Error('Equipo no encontrado');
      if (['Mantenimiento'].includes(equipo.estado_operativo)) {
        throw new Error('El equipo está en mantenimiento');
      }
      const registro = await Mantenimiento.create(datos, { transaction });
      const cantidad = await Mantenimiento.count({
        where: { id_equipo: equipo.id, estado: { [Op.in]: ['pendiente', 'en_progreso'] } }, transaction,
      });
      if (cantidad > 0) {
        if (['Solicitado', 'Prestado'].includes(equipo.estado_operativo)) {
          throw new Error('El equipo está solicitado o prestado');
        }
        await equipo.update({ estado_operativo: 'Mantenimiento' }, { transaction });
      } else if (equipo.estado_operativo === 'Mantenimiento') {
        await equipo.update({ estado_operativo: 'Disponible' }, { transaction });
      }
      return registro;
    });
    res.status(201).json(mantenimiento);
  } catch (error) {
    return sendError(res, 400, 'Error al crear mantenimiento', error);
  }
};

export const getMantenimientos = async (_req: Request, res: Response) => {
  try {
    res.json(await Mantenimiento.findAll({ include: [{ model: Equipo }], order: [['fecha_inicio', 'DESC'], ['id', 'DESC']] }));
  } catch (error) {
    return sendError(res, 500, 'Error al obtener mantenimientos', error);
  }
};

export const getMantenimiento = async (req: Request, res: Response) => {
  try {
    const registro = await Mantenimiento.findByPk(Number(req.params.id), { include: [{ model: Equipo }] });
    if (!registro) throw new Error('Mantenimiento no encontrado');
    res.json(registro);
  } catch (error) {
    return sendError(res, 500, 'Error al obtener mantenimiento', error);
  }
};

export const actualizarMantenimiento = async (req: Request, res: Response) => {
  try {
    const mantenimiento = await sequelize.transaction(async transaction => {
      const referencia = await Mantenimiento.findByPk(Number(req.params.id), { transaction });
      if (!referencia) throw new Error('Mantenimiento no encontrado');
      const equipo = await Equipo.findByPk(referencia.get('id_equipo') as number, {
        transaction, lock: transaction.LOCK.UPDATE,
    });
    if (!equipo) throw new Error('Equipo no encontrado');
    const registro = await Mantenimiento.findByPk(Number(req.params.id), { transaction, lock: transaction.LOCK.UPDATE });
    if (!registro) throw new Error('Mantenimiento no encontrado');
    const datos = { ...registro.get({ plain: true }), ...req.body };
    await registro.update({
      fecha_inicio: datos.fecha_inicio,
      descripcion_falla: datos.descripcion_falla,
      responsable: datos.responsable,
      repuestos: datos.repuestos,
      observaciones: datos.observaciones,
      estado: datos.estado,
      fecha_fin: datos.estado === 'completado' ? datos.fecha_fin || new Date() : null,
    }, { transaction });
    const cantidad = await Mantenimiento.count({
      where: { id_equipo: equipo.id, estado: { [Op.in]: ['pendiente', 'en_progreso'] } }, transaction,
    });
    if (cantidad > 0) {
      if (['Solicitado', 'Prestado'].includes(equipo.estado_operativo)) {
        throw new Error('El equipo está solicitado o prestado');
      }
      await equipo.update({ estado_operativo: 'Mantenimiento' }, { transaction });
    } else if (equipo.estado_operativo === 'Mantenimiento') {
      await equipo.update({ estado_operativo: 'Disponible' }, { transaction });
    }
    return registro;
    });
    res.json(mantenimiento);

  } catch (error) {
    return sendError(res, 400, 'Error al actualizar mantenimiento', error);
  }
};

export const eliminarMantenimiento = async (req: Request, res: Response) => {
  try {
    await sequelize.transaction(async transaction => {
      const referencia = await Mantenimiento.findByPk(Number(req.params.id), { transaction });
      if (!referencia) throw new Error('Mantenimiento no encontrado');
      const equipo = await Equipo.findByPk(referencia.get('id_equipo') as number, {
        transaction, lock: transaction.LOCK.UPDATE,
    });
    if (!equipo) throw new Error('Equipo no encontrado');
    const registro = await Mantenimiento.findByPk(Number(req.params.id), { transaction, lock: transaction.LOCK.UPDATE });
    if (!registro) throw new Error('Mantenimiento no encontrado');
    await registro.destroy({ transaction });
    const cantidad = await Mantenimiento.count({
      where: { id_equipo: equipo.id, estado: { [Op.in]: ['pendiente', 'en_progreso'] } }, transaction,
    });
    if (cantidad > 0) {
      if (['Solicitado', 'Prestado'].includes(equipo.estado_operativo)) {
        throw new Error('El equipo está solicitado o prestado');
      }
      await equipo.update({ estado_operativo: 'Mantenimiento' }, { transaction });
    } else if (equipo.estado_operativo === 'Mantenimiento') {
      await equipo.update({ estado_operativo: 'Disponible' }, { transaction });
    }

    });
    res.json({ message: 'Mantenimiento eliminado exitosamente' });
  } catch (error) {
    return sendError(res, 500, 'Error al eliminar mantenimiento', error);
  }
};
