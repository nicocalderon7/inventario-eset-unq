import { Request, Response } from 'express';
import Prestamo from '../models/Prestamo.js';
import Usuario from '../models/Usuario.js';
import Equipo from '../models/Equipo.js';

export const crearSolicitud = async (req: Request, res: Response) => {
  try {
    // Al crear, el estado por defecto es 'pendiente'
    const nuevaSolicitud = await Prestamo.create(req.body);
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(400).json({ message: 'Error al solicitar préstamo', error });
  }
};

export const getPrestamos = async (req: Request, res: Response) => {
  try {
    const lista = await Prestamo.findAll({
      include: [
        { model: Usuario, as: 'solicitante', attributes: ['nombre', 'apellido', 'email'] },
        { model: Equipo, attributes: ['nombre', 'nro_patrimonio'] },
        { model: Usuario, as: 'responsable', attributes: ['nombre', 'apellido'] }
      ]
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener préstamos', error });
  }
};

export const actualizarPrestamo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const prestamo = await Prestamo.findByPk(Number(id));

    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    // Actualiza el registro con los datos enviados en el Body (estado, fechas, etc.)
    await prestamo.update(req.body);

    res.json({
      message: 'Préstamo actualizado con éxito',
      prestamo
    });
  } catch (error: any) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ message: 'Error al actualizar el préstamo', error: error.message });
  }
};