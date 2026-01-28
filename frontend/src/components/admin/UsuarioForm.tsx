import { useState, FormEvent, useEffect } from 'react';
import type { Usuario } from '../../types';

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onSubmit: (data: Partial<Usuario> & { password?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const UsuarioForm = ({ usuario, onSubmit, onCancel, loading }: UsuarioFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario' as 'admin' | 'usuario',
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '', // No mostramos la contraseña actual
        rol: usuario.rol || 'usuario',
      });
    }
  }, [usuario]);

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  
  // Si es edición y no se cambió la contraseña, no la enviamos
  if (usuario && !formData.password) {
    const { password, ...dataWithoutPassword } = formData;
    onSubmit(dataWithoutPassword);
  } else {
    onSubmit(formData);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input"
          placeholder="Ej: Juan Pérez"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input"
          placeholder="Ej: juan@unq.edu.ar"
          required
        />
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña {usuario ? '(dejar vacío para no cambiar)' : '*'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input"
          placeholder="••••••••"
          required={!usuario}
          minLength={6}
        />
        {!usuario && (
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        )}
      </div>

      {/* Rol */}
      <div>
        <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
          Rol *
        </label>
        <select
          id="rol"
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="usuario">Docente</option>
          <option value="admin">Administrador</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.rol === 'admin' 
            ? 'Tendrá acceso completo al sistema' 
            : 'Solo podrá solicitar préstamos'}
        </p>
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
          {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};