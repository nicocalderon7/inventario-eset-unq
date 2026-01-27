import api from './api';
import type { Equipo } from '../types';

export const equipoService = {
  getAll: async (): Promise<Equipo[]> => {
    const response = await api.get('/equipos');
    return response.data;
  },

  getById: async (id: number): Promise<Equipo> => {
    const response = await api.get(`/equipos/${id}`);
    return response.data;
  },

  create: async (equipo: Partial<Equipo>): Promise<Equipo> => {
    const response = await api.post('/equipos', equipo);
    return response.data;
  },

  update: async (id: number, equipo: Partial<Equipo>): Promise<Equipo> => {
    const response = await api.put(`/equipos/${id}`, equipo);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/equipos/${id}`);
  },
};