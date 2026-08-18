import { useState, FormEvent, useEffect } from 'react';
import { categoriaService } from '../../services/categoriaService';
import type { Categoria, Equipo } from '../../types';

type EquipoFormData = {
  nombre: string;
  id_categoria: string;
  estado_operativo: Equipo['estado_operativo'];
  nro_serie: string;
  observaciones: string;
};

interface EquipoFormProps {
  equipo?: Equipo | null;
  onSubmit: (data: Partial<Equipo>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const EquipoForm = ({ equipo, onSubmit, onCancel, loading }: EquipoFormProps) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [categoriasError, setCategoriasError] = useState('');
  const [formData, setFormData] = useState<EquipoFormData>({
    nombre: '',
    id_categoria: '',
    estado_operativo: 'Disponible',
    nro_serie: '',
    observaciones: '',
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre: equipo.nombre || '',
        id_categoria: equipo.id_categoria?.toString() || '',
        estado_operativo: equipo.estado_operativo || 'Disponible',
        nro_serie: equipo.nro_serie || '',
        observaciones: equipo.observaciones || '',
      });
    }
  }, [equipo]);

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategoriasError('Error al cargar las categorías');
    } finally {
      setCategoriasLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id_categoria: formData.id_categoria ? Number(formData.id_categoria) : undefined,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Equipo *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input"
          placeholder="Ej: Laptop Dell Latitude 5420"
          required
        />
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría *
        </label>
        <select
          id="id_categoria"
          name="id_categoria"
          value={formData.id_categoria}
          onChange={handleChange}
          className="input"
          required
          disabled={categoriasLoading}
        >
          <option value="">
            {categoriasLoading ? 'Cargando categorías...' : 'Seleccionar categoría'}
          </option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        {categoriasError && (
          <p className="mt-1 text-sm text-red-600">{categoriasError}</p>
        )}
      </div>

      {/* Número de Serie */}
      <div>
        <label htmlFor="nro_serie" className="block text-sm font-medium text-gray-700 mb-1">
          Número de Serie
        </label>
        <input
          type="text"
          id="nro_serie"
          name="nro_serie"
          value={formData.nro_serie}
          onChange={handleChange}
          className="input"
          placeholder="Ej: SN123456789"
        />
      </div>

      {/* Estado */}
      <div>
        <label htmlFor="estado_operativo" className="block text-sm font-medium text-gray-700 mb-1">
          Estado *
        </label>
        <select
          id="estado_operativo"
          name="estado_operativo"
          value={formData.estado_operativo}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="Disponible">Disponible</option>
          <option value="Solicitado">Solicitado</option>
          <option value="Prestado">Prestado</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
      </div>

      {/* Observaciones */}
      <div>
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="input"
          rows={3}
          placeholder="Notas adicionales sobre el equipo..."
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Guardando...' : equipo ? 'Actualizar' : 'Crear Equipo'}
        </button>
      </div>
    </form>
  );
};
