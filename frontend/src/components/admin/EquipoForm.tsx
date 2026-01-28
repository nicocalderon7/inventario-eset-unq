import { useState, FormEvent, useEffect } from 'react';
import type { Equipo } from '../../types';

interface EquipoFormProps {
  equipo?: Equipo | null;
  onSubmit: (data: Partial<Equipo>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const EquipoForm = ({ equipo, onSubmit, onCancel, loading }: EquipoFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    estado: 'disponible' as 'disponible' | 'prestado' | 'mantenimiento',
    numero_serie: '',
    observaciones: '',
  });

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre: equipo.nombre || '',
        categoria: equipo.categoria || '',
        estado: equipo.estado || 'disponible',
        numero_serie: equipo.numero_serie || '',
        observaciones: equipo.observaciones || '',
      });
    }
  }, [equipo]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría *
        </label>
        <input
          type="text"
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className="input"
          placeholder="Ej: Laptops, Proyectores, etc."
          required
        />
      </div>

      {/* Número de Serie */}
      <div>
        <label htmlFor="numero_serie" className="block text-sm font-medium text-gray-700 mb-1">
          Número de Serie
        </label>
        <input
          type="text"
          id="numero_serie"
          name="numero_serie"
          value={formData.numero_serie}
          onChange={handleChange}
          className="input"
          placeholder="Ej: SN123456789"
        />
      </div>

      {/* Estado */}
      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
          Estado *
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="disponible">Disponible</option>
          <option value="prestado">Prestado</option>
          <option value="mantenimiento">Mantenimiento</option>
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