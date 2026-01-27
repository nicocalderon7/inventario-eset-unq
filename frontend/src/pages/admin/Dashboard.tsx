import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { equipoService } from '../../services/equipoService';
import { prestamoService } from '../../services/prestamoService';
import type { Equipo, Prestamo } from '../../types';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp 
} from 'lucide-react';

export const Dashboard = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [equiposData, prestamosData] = await Promise.all([
        equipoService.getAll(),
        prestamoService.getAll(),
      ]);
      setEquipos(equiposData);
      setPrestamos(prestamosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas
  const equiposDisponibles = equipos.filter(e => e.estado === 'disponible').length;
  const equiposPrestados = equipos.filter(e => e.estado === 'prestado').length;
  const equiposMantenimiento = equipos.filter(e => e.estado === 'mantenimiento').length;
  const prestamosPendientes = prestamos.filter(p => p.estado === 'pendiente').length;
  const prestamosActivos = prestamos.filter(p => p.estado === 'entregado').length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen del estado del inventario
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Equipos */}
          <div className="card border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Equipos
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {equipos.length}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Package className="h-8 w-8 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Disponibles */}
          <div className="card border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Disponibles
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {equiposDisponibles}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Prestados */}
          <div className="card border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Prestados
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {equiposPrestados}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pendientes */}
          <div className="card border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Solicitudes Pendientes
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {prestamosPendientes}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {equiposMantenimiento > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">
                  Equipos en Mantenimiento
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Hay {equiposMantenimiento} equipo(s) en mantenimiento actualmente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tablas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Solicitudes Pendientes */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Solicitudes Pendientes
            </h2>
            {prestamosPendientes === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay solicitudes pendientes
              </p>
            ) : (
              <div className="space-y-3">
                {prestamos
                  .filter(p => p.estado === 'pendiente')
                  .slice(0, 5)
                  .map(prestamo => (
                    <div 
                      key={prestamo.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {prestamo.usuario?.nombre || 'Usuario desconocido'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {prestamo.equipo?.nombre || `Equipo ID: ${prestamo.id_equipo}`}
                          </p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Pendiente
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Préstamos Activos */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Préstamos Activos
            </h2>
            {prestamosActivos === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay préstamos activos
              </p>
            ) : (
              <div className="space-y-3">
                {prestamos
                  .filter(p => p.estado === 'entregado')
                  .slice(0, 5)
                  .map(prestamo => (
                    <div 
                      key={prestamo.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {prestamo.usuario?.nombre || 'Usuario desconocido'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {prestamo.equipo?.nombre || `Equipo ID: ${prestamo.id_equipo}`}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          En uso
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};