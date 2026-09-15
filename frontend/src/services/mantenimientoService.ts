import api from './api';
import type { Mantenimiento, CrearMantenimiento, ActualizarMantenimiento } from '../types';

export const mantenimientoService = {
  getAll: async (): Promise<Mantenimiento[]> => {
    const response = await api.get<Mantenimiento[]>('/mantenimientos/');
    return response.data;
  },

  getById: async (id: number): Promise<Mantenimiento> => {
    const response = await api.get<Mantenimiento>(`/mantenimientos/${id}`);
    return response.data;
  },

  create: async (datos: CrearMantenimiento): Promise<Mantenimiento> => {
    const response = await api.post<Mantenimiento>('/mantenimientos', datos);
    return response.data;
  },

  update: async (id: number, datos: ActualizarMantenimiento): Promise<Mantenimiento> => {
    const response = await api.put<Mantenimiento>(`/mantenimientos/${id}`, datos);
    return response.data;
  },

  patch: async (id: number, datos: ActualizarMantenimiento): Promise<Mantenimiento> => {
    const response = await api.patch<Mantenimiento>(`/mantenimientos/${id}`, datos);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/mantenimientos/${id}`);
  },
};
