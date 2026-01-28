import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { prestamoService } from '../../services/prestamoService';
import type { Prestamo } from '../../types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  User,
  Calendar,
  Filter
} from 'lucide-react';

export const Prestamos = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  useEffect(() => {
    loadPrestamos();
  }, []);

  useEffect(() => {
    filterByEstado();
  }, [filterEstado, prestamos]);

  const loadPrestamos = async () => {
    try {
      const data = await prestamoService.getAll();
      setPrestamos(data);
      setFilteredPrestamos(data);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByEstado = () => {
    if (filterEstado === 'todos') {
      setFilteredPrestamos(prestamos);
    } else {
      setFilteredPrestamos(prestamos.filter(p => p.estado === filterEstado));
    }
  };

  const handleAprobar = async (id: number) => {
    try {
      await prestamoService.aprobar(id);
      await loadPrestamos();
    } catch (error) {
      console.error('Error al aprobar préstamo:', error);
      alert('Error al aprobar el préstamo');
    }
  };

  const handleRechazar = async (id: number) => {
    const motivo = prompt('Motivo del rechazo (opcional):');
    try {
      await prestamoService.rechazar(id, motivo || undefined);
      await loadPrestamos();
    } catch (error) {
      console.error('Error al rechazar préstamo:', error);
      alert('Error al rechazar el préstamo');
    }
  };

  const handleEntregar = async (id: number) => {
    if (!confirm('¿Confirmar entrega del equipo al usuario?')) return;
    
    try {
      await prestamoService.update(id, { estado: 'entregado' });
      await loadPrestamos();
    } catch (error) {
      console.error('Error al registrar entrega:', error);
      alert('Error al registrar la entrega');
    }
  };

  const handleDevolver = async (id: number) => {
    if (!confirm('¿Confirmar devolución del equipo?')) return;
    
    try {
      await prestamoService.update(id, { estado: 'devuelto' });
      await loadPrestamos();
    } catch (error) {
      console.error('Error al registrar devolución:', error);
      alert('Error al registrar la devolución');
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      aprobado: 'bg-green-100 text-green-800',
      rechazado: 'bg-red-100 text-red-800',
      entregado: 'bg-blue-100 text-blue-800',
      devuelto: 'bg-gray-100 text-gray-800',
    };
    return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="h-4 w-4" />;
      case 'aprobado':
        return <CheckCircle className="h-4 w-4" />;
      case 'rechazado':
        return <XCircle className="h-4 w-4" />;
      case 'entregado':
        return <Package className="h-4 w-4" />;
      case 'devuelto':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando préstamos...</div>
        </div>
      </Layout>
    );
  }

  const stats = {
    pendientes: prestamos.filter(p => p.estado === 'pendiente').length,
    aprobados: prestamos.filter(p => p.estado === 'aprobado').length,
    entregados: prestamos.filter(p => p.estado === 'entregado').length,
    devueltos: prestamos.filter(p => p.estado === 'devuelto').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Préstamos</h1>
          <p className="text-gray-600">Administra solicitudes y préstamos activos</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Aprobados</p>
            <p className="text-2xl font-bold text-green-600">{stats.aprobados}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">En Uso</p>
            <p className="text-2xl font-bold text-blue-600">{stats.entregados}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Devueltos</p>
            <p className="text-2xl font-bold text-gray-600">{stats.devueltos}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="input flex-1"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobado">Aprobados</option>
              <option value="entregado">En Uso</option>
              <option value="devuelto">Devueltos</option>
              <option value="rechazado">Rechazados</option>
            </select>
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
                    Equipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrestamos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No hay préstamos con este filtro
                    </td>
                  </tr>
                ) : (
                  filteredPrestamos.map((prestamo) => (
                    <tr key={prestamo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {prestamo.usuario?.nombre || 'Usuario desconocido'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {prestamo.usuario?.email || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {prestamo.equipo?.nombre || `Equipo ID: ${prestamo.id_equipo}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(prestamo.fecha_prestamo)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(
                            prestamo.estado
                          )}`}
                        >
                          {getEstadoIcon(prestamo.estado)}
                          <span className="capitalize">{prestamo.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          {prestamo.estado === 'pendiente' && (
                            <>
                              <button
                                onClick={() => handleAprobar(prestamo.id)}
                                className="text-green-600 hover:text-green-900 font-medium"
                              >
                                Aprobar
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleRechazar(prestamo.id)}
                                className="text-red-600 hover:text-red-900 font-medium"
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                          {prestamo.estado === 'aprobado' && (
                            <button
                              onClick={() => handleEntregar(prestamo.id)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Registrar Entrega
                            </button>
                          )}
                          {prestamo.estado === 'entregado' && (
                            <button
                              onClick={() => handleDevolver(prestamo.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Registrar Devolución
                            </button>
                          )}
                          {(prestamo.estado === 'devuelto' || prestamo.estado === 'rechazado') && (
                            <span className="text-gray-400">Sin acciones</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Observaciones */}
        {filteredPrestamos.some(p => p.observaciones) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Observaciones recientes:</h3>
            <div className="space-y-2">
              {filteredPrestamos
                .filter(p => p.observaciones)
                .slice(0, 3)
                .map(p => (
                  <div key={p.id} className="text-sm text-blue-800">
                    <span className="font-medium">{p.usuario?.nombre}:</span> {p.observaciones}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};