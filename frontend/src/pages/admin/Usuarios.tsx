import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';
import { UsuarioForm } from '../../components/admin/UsuarioForm';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../types';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  User,
  Shield,
  Mail
} from 'lucide-react';

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    filterUsuarios();
  }, [searchTerm, usuarios]);

  const loadUsuarios = async () => {
    try {
      const data = await usuarioService.getAll();
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showToast('Error al cargar los usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsuarios = () => {
    if (!searchTerm.trim()) {
      setFilteredUsuarios(usuarios);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(term) ||
        usuario.email.toLowerCase().includes(term)
    );
    setFilteredUsuarios(filtered);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ show: true, message, type });
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

    try {
      await usuarioService.delete(id);
      await loadUsuarios();
      showToast('Usuario eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showToast('Error al eliminar el usuario', 'error');
    }
  };

  const handleSubmit = async (data: Partial<Usuario> & { password?: string }) => {
    setFormLoading(true);

    try {
      if (selectedUsuario) {
        await usuarioService.update(selectedUsuario.id, data);
        showToast('Usuario actualizado exitosamente', 'success');
      } else {
        await usuarioService.create(data);
        showToast('Usuario creado exitosamente', 'success');
      }
      
      await loadUsuarios();
      setIsModalOpen(false);
      setSelectedUsuario(null);
    } catch (error: any) {
      console.error('Error al guardar usuario:', error);
      showToast(error.response?.data?.error || 'Error al guardar el usuario', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando usuarios...</div>
        </div>
      </Layout>
    );
  }

  const admins = usuarios.filter(u => u.rol === 'admin').length;
  const docentes = usuarios.filter(u => u.rol === 'usuario').length;

  return (
    <Layout>
      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
          <button 
            onClick={handleCreate}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Usuario</span>
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Administradores</p>
            <p className="text-2xl font-bold text-primary-600">{admins}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Docentes</p>
            <p className="text-2xl font-bold text-blue-600">{docentes}</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm
                        ? 'No se encontraron usuarios'
                        : 'No hay usuarios registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-2" />
                          {usuario.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            usuario.rol === 'admin'
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {usuario.rol === 'admin' && <Shield className="h-3 w-3" />}
                          <span className="capitalize">
                            {usuario.rol === 'admin' ? 'Administrador' : 'Docente'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(usuario)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(usuario.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUsuario(null);
        }}
        title={selectedUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      >
        <UsuarioForm
          usuario={selectedUsuario}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedUsuario(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </Layout>
  );
};