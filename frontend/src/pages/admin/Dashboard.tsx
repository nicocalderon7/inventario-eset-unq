import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { equipoService } from '../../services/equipoService';
import { prestamoService } from '../../services/prestamoService';
import { useAuth } from '../../context/AuthContext';
import type { Equipo, Prestamo } from '../../types';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const Dashboard = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-lg text-gray-600">Cargando datos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general del inventario</p>
        </div>

        {/* Métricas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Equipos */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Equipos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{equipos.length}</p>
              </div>
              <Package className="h-10 w-10 text-gray-400" />
            </div>
          </div>

          {/* Disponibles */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Disponibles</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{equiposDisponibles}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          {/* Prestados */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Prestados</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{equiposPrestados}</p>
              </div>
              <Clock className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          {/* Pendientes */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Solicitudes Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{prestamosPendientes}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Alerta de mantenimiento */}
        {equiposMantenimiento > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
              <p className="text-orange-800">
                <span className="font-medium">{equiposMantenimiento}</span> equipo(s) en mantenimiento
              </p>
            </div>
          </div>
        )}

        {/* Acciones rápidas para Admin */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/equipos')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Gestionar Equipos</h3>
                  <p className="text-sm text-gray-600">Ver y administrar inventario</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => navigate('/prestamos')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Gestionar Préstamos</h3>
                  <p className="text-sm text-gray-600">Aprobar y revisar solicitudes</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => navigate('/usuarios')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Usuarios</h3>
                  <p className="text-sm text-gray-600">Administrar usuarios del sistema</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </button>
          </div>
        )}

        {/* Solicitudes pendientes (solo tabla si hay) */}
        {prestamosPendientes > 0 && isAdmin && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Solicitudes Pendientes ({prestamosPendientes})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {prestamos
                  .filter(p => p.estado === 'pendiente')
                  .slice(0, 5)
                  .map(prestamo => (
                    <div 
                      key={prestamo.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {prestamo.usuario?.nombre || 'Usuario desconocido'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prestamo.equipo?.nombre || `Equipo ID: ${prestamo.id_equipo}`}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        Pendiente
                      </span>
                    </div>
                  ))}
              </div>
              {prestamosPendientes > 5 && (
                <button 
                  onClick={() => navigate('/prestamos')}
                  className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver todas las solicitudes →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Vista para Docentes */}
        {!isAdmin && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mis Solicitudes</h2>
            <p className="text-gray-600 mb-4">
              Aquí podrás ver el estado de tus solicitudes de préstamo
            </p>
            <button 
              onClick={() => navigate('/mis-solicitudes')}
              className="btn-primary"
            >
              Ver mis solicitudes
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};