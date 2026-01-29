import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { prestamoService } from '../../services/prestamoService';
import { useAuth } from '../../context/AuthContext';
import type { Prestamo } from '../../types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';

export const MisSolicitudes = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadMisPrestamos();
  }, []);

  const loadMisPrestamos = async () => {
    try {
      const data = await prestamoService.getAll();
      // Filtrar solo los préstamos del usuario actual
      const misPrestamos = data.filter(p => p.id_usuario === user?.id);
      setPrestamos(misPrestamos);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      aprobado: 'bg-green-100 text-green-800 border-green-200',
      rechazado: 'bg-red-100 text-red-800 border-red-200',
      entregado: 'bg-blue-100 text-blue-800 border-blue-200',
      devuelto: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="h-5 w-5" />;
      case 'aprobado':
        return <CheckCircle className="h-5 w-5" />;
      case 'rechazado':
        return <XCircle className="h-5 w-5" />;
      case 'entregado':
        return <Package className="h-5 w-5" />;
      case 'devuelto':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getEstadoTexto = (estado: string) => {
    const textos = {
      pendiente: 'Esperando aprobación',
      aprobado: 'Aprobado - Listo para retirar',
      rechazado: 'Solicitud rechazada',
      entregado: 'En tu poder',
      devuelto: 'Devuelto',
    };
    return textos[estado as keyof typeof textos] || estado;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando solicitudes...</div>
        </div>
      </Layout>
    );
  }

  const stats = {
    pendientes: prestamos.filter(p => p.estado === 'pendiente').length,
    aprobados: prestamos.filter(p => p.estado === 'aprobado').length,
    activos: prestamos.filter(p => p.estado === 'entregado').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>
          <p className="text-gray-600">Estado de tus préstamos de equipos</p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Aprobados</p>
            <p className="text-2xl font-bold text-green-600">{stats.aprobados}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">En mi poder</p>
            <p className="text-2xl font-bold text-blue-600">{stats.activos}</p>
          </div>
        </div>

        {/* Lista de préstamos */}
        {prestamos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes solicitudes
            </h3>
            <p className="text-gray-600">
              Aún no has solicitado ningún equipo
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prestamos.map((prestamo) => (
              <div key={prestamo.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Package className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prestamo.equipo?.nombre || `Equipo ID: ${prestamo.id_equipo}`}
                        </h3>
                        {prestamo.equipo?.categoria && (
                          <p className="text-sm text-gray-600">{prestamo.equipo.categoria}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className={`border rounded-full px-4 py-2 flex items-center space-x-2 ${getEstadoBadge(prestamo.estado)}`}>
                      {getEstadoIcon(prestamo.estado)}
                      <span className="font-medium text-sm">{getEstadoTexto(prestamo.estado)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Solicitado: {formatDate(prestamo.fecha_prestamo)}</span>
                    </div>
                    {prestamo.fecha_devolucion && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Devuelto: {formatDate(prestamo.fecha_devolucion)}</span>
                      </div>
                    )}
                  </div>

                  {prestamo.observaciones && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Observaciones:</p>
                          <p className="text-sm text-gray-600 mt-1">{prestamo.observaciones}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instrucciones según estado */}
                  {prestamo.estado === 'pendiente' && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        ⏳ Tu solicitud está siendo revisada por el administrador
                      </p>
                    </div>
                  )}
                  {prestamo.estado === 'aprobado' && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        ✓ Solicitud aprobada. Puedes retirar el equipo en el laboratorio
                      </p>
                    </div>
                  )}
                  {prestamo.estado === 'entregado' && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        📦 El equipo está en tu poder. Recuerda devolverlo cuando termines
                      </p>
                    </div>
                  )}
                  {prestamo.estado === 'rechazado' && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        ✗ Tu solicitud fue rechazada. Contacta al administrador para más información
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};