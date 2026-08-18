import api from './api';
import type { Prestamo } from '../types';

export const prestamoService = {
  getAll: async (): Promise<Prestamo[]> => {
    const response = await api.get('/prestamos');
    return response.data;
  },

  getById: async (id: number): Promise<Prestamo> => {
    const response = await api.get(`/prestamos/${id}`);
    return response.data;
  },

  create: async (prestamo: Partial<Prestamo>): Promise<Prestamo> => {
    const response = await api.post('/prestamos', prestamo);
    return response.data;
  },

  update: async (id: number, data: Partial<Prestamo>): Promise<Prestamo> => {
    const response = await api.put(`/prestamos/${id}`, data);
    return response.data;
  },

  registrarEntrega: async (id: number): Promise<Prestamo> => {
    const response = await api.put(`/prestamos/${id}`, { estado: 'entregado', 
    fecha_entrega: new Date().toISOString()
    });
    return response.data;
  },

  registrarDevolucion: async (id: number): Promise<Prestamo> => {
    const response = await api.put(`/prestamos/${id}`, { estado: 'devuelto', 
    fecha_devolucion: new Date().toISOString()
    });
    return response.data;
  },

  aprobar: async (id: number, idResponsableEntrega: number): Promise<Prestamo> => {
    const response = await api.put(`/prestamos/${id}`, {
      estado: 'aprobado',
      id_responsable_entrega: idResponsableEntrega,
    });
    return response.data;
  },

  rechazar: async (id: number, motivoRechazo?: string): Promise<Prestamo> => {
    const response = await api.put(`/prestamos/${id}`, { 
      estado: 'rechazado',
      motivo_rechazo: motivoRechazo,
    });
    return response.data;
  },
};
