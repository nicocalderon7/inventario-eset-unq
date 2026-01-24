import { Request, Response } from 'express';
import Prestamo from '../models/Prestamo.js';
import Usuario from '../models/Usuario.js';
import Equipo from '../models/Equipo.js';

export const crearSolicitud = async (req: Request, res: Response) => {
  const { id_equipo } = req.body;

  try {
    // Buscamos el equipo
    const equipo: any = await Equipo.findByPk(id_equipo);
    
    if (!equipo) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }

    // Usamos .get() para asegurar que leemos el valor real de la base de datos
    const estadoActual = equipo.get('estado_operativo');

    // Validamos disponibilidad
    if (estadoActual !== 'funcional') {
      return res.status(400).json({ 
        message: `El equipo no está disponible para préstamo. Estado actual: ${estadoActual}` 
      });
    }

    // Creamos el préstamo
    const nuevaSolicitud = await Prestamo.create(req.body);

    // Actualizamos el estado del equipo a 'prestado'
    await equipo.update({ estado_operativo: 'prestado' });

    res.status(201).json({
      message: 'Préstamo creado y equipo marcado como prestado',
      nuevaSolicitud
    });

  } catch (error: any) {
    console.error('Error en crearSolicitud:', error);
    res.status(400).json({ message: 'Error al solicitar préstamo', error: error.message });
  }
};

export const getPrestamos = async (req: Request, res: Response) => {
  try {
    const lista = await Prestamo.findAll({
      include: [
        { model: Usuario, as: 'solicitante', attributes: ['nombre', 'apellido', 'email'] },
        { model: Equipo, attributes: ['nombre', 'nro_patrimonio', 'estado_operativo'] },
        { model: Usuario, as: 'responsable', attributes: ['nombre', 'apellido'] }
      ]
    });
    res.json(lista);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener préstamos', error: error.message });
  }
};

export const actualizarPrestamo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body; 

  try {
    const prestamo: any = await Prestamo.findByPk(Number(id));

    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    // Si el préstamo se marca como 'devuelto' o se carga fecha de devolución, liberamos el equipo
    if (estado === 'devuelto' || req.body.fecha_devolucion) {
      const equipo: any = await Equipo.findByPk(prestamo.id_equipo);
      if (equipo) {
        await equipo.update({ estado_operativo: 'funcional' });
      }
    }

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