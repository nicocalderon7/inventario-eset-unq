import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { equipoService } from '../../services/equipoService';
import type { Equipo } from '../../types';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Package,
  CheckCircle,
  Clock,
  Wrench
} from 'lucide-react';

export const Equipos = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEquipos();
  }, []);

  useEffect(() => {
    filterEquipos();
  }, [searchTerm, equipos]);

  const loadEquipos = async () => {
    try {
      const data = await equipoService.getAll();
      setEquipos(data);
      setFilteredEquipos(data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipos = () => {
    if (!searchTerm.trim()) {
      setFilteredEquipos(equipos);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = equipos.filter(
      (equipo) =>
        equipo.nombre.toLowerCase().includes(term) ||
        equipo.categoria?.toLowerCase().includes(term) ||
        equipo.numero_serie?.toLowerCase().includes(term)
    );
    setFilteredEquipos(filtered);
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      disponible: 'bg-green-100 text-green-800',
      prestado: 'bg-blue-100 text-blue-800',
      mantenimiento: 'bg-orange-100 text-orange-800',
    };
    return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <CheckCircle className="h-4 w-4" />;
      case 'prestado':
        return <Clock className="h-4 w-4" />;
      case 'mantenimiento':
        return <Wrench className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando equipos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Equipos</h1>
            <p className="text-gray-600">Administra el inventario de equipos</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Agregar Equipo</span>
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o número de serie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{equipos.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Disponibles</p>
            <p className="text-2xl font-bold text-green-600">
              {equipos.filter((e) => e.estado === 'disponible').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Prestados</p>
            <p className="text-2xl font-bold text-blue-600">
              {equipos.filter((e) => e.estado === 'prestado').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Mantenimiento</p>
            <p className="text-2xl font-bold text-orange-600">
              {equipos.filter((e) => e.estado === 'mantenimiento').length}
            </p>
          </div>
        </div>

        {/* Tabla de equipos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Serie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm
                        ? 'No se encontraron equipos con ese criterio'
                        : 'No hay equipos registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredEquipos.map((equipo) => (
                    <tr key={equipo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {equipo.nombre}
                            </div>
                            {equipo.observaciones && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {equipo.observaciones}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{equipo.categoria || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 font-mono">
                          {equipo.numero_serie || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(
                            equipo.estado
                          )}`}
                        >
                          {getEstadoIcon(equipo.estado)}
                          <span className="capitalize">{equipo.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
    </Layout>
  );
};