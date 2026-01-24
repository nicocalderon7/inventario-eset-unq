import { Request, Response } from 'express';
import Prestamo from '../models/Prestamo.js';
import Usuario from '../models/Usuario.js';
import Equipo from '../models/Equipo.js';

export const crearSolicitud = async (req: Request, res: Response) => {
  const { id_equipo } = req.body;

  try {
    // 1. Buscamos el equipo y casteamos a 'any' o al tipo Equipo para acceder a estado_operativo
    const equipo: any = await Equipo.findByPk(id_equipo);
    
    if (!equipo) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }

    // 2. Validamos disponibilidad usando el nombre de columna correcto: estado_operativo
    if (equipo.estado_operativo !== 'funcional') {
      return res.status(400).json({ 
        message: `El equipo no está disponible para préstamo. Estado actual: ${equipo.estado_operativo}` 
      });
    }

    // 3. Creamos el préstamo
    const nuevaSolicitud = await Prestamo.create(req.body);

    // 4. ACTUALIZACIÓN AUTOMÁTICA: Pasamos el equipo a 'prestado'
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
  const { estado } = req.body; // Suponiendo que mandás el estado del préstamo

  try {
    const prestamo: any = await Prestamo.findByPk(Number(id));

    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    // Lógica extra: Si el préstamo se marca como 'devuelto', liberamos el equipo
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