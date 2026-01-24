import { Request, Response } from 'express';
import Prestamo from '../models/Prestamo.js';
import Usuario from '../models/Usuario.js';
import Equipo from '../models/Equipo.js';

export const crearSolicitud = async (req: Request, res: Response) => {
  const { id_equipo } = req.body;
  try {
    const equipo: any = await Equipo.findByPk(id_equipo);
    if (!equipo) return res.status(404).json({ message: 'Equipo no encontrado' });

    const estadoActual = equipo.get('estado_operativo');
    if (estadoActual !== 'funcional') {
      return res.status(400).json({ 
        message: `El equipo no está disponible. Estado actual: ${estadoActual}` 
      });
    }

    const nuevaSolicitud = await Prestamo.create(req.body);
    await equipo.update({ estado_operativo: 'prestado' });

    res.status(201).json({ message: 'Préstamo creado y equipo marcado como prestado', nuevaSolicitud });
  } catch (error: any) {
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

    // Convertimos a minúsculas para evitar errores de tipeo (devuelto vs Devuelto)
    const estadoNormalizado = estado ? estado.toLowerCase() : '';

    // Si el estado es 'devuelto', buscamos el equipo y lo liberamos
    if (estadoNormalizado === 'devuelto' || req.body.fecha_devolucion) {
      // Usamos el id_equipo que ya tiene el registro del préstamo
      const idEquipo = prestamo.get('id_equipo');
      const equipo: any = await Equipo.findByPk(idEquipo);
      
      if (equipo) {
        await equipo.update({ estado_operativo: 'funcional' });
        console.log(`>>> Sistema: Equipo ${idEquipo} liberado con éxito.`);
      } else {
        console.log(`>>> Sistema: No se encontró el equipo con ID ${idEquipo}`);
      }
    }

    await prestamo.update(req.body);

    res.json({
      message: 'Préstamo actualizado y estado de equipo sincronizado',
      prestamo
    });
  } catch (error: any) {
    console.error('Error al actualizar préstamo:', error);
    res.status(500).json({ message: 'Error al actualizar el préstamo', error: error.message });
  }
};