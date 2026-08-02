import api from './api';
import type { Categoria } from '../types';

export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias');
    return response.data;
  },
};
