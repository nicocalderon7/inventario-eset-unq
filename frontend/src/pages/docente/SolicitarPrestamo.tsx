import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Toast } from '../../components/common/Toast';
import { equipoService } from '../../services/equipoService';
import { prestamoService } from '../../services/prestamoService';
import { useAuth } from '../../context/AuthContext';
import type { Equipo } from '../../types';
import { 
  Package, 
  Search,
  CheckCircle,
  Send
} from 'lucide-react';

export const SolicitarPrestamo = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();

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
    loadEquipos();
  }, []);

  useEffect(() => {
    filterEquipos();
  }, [searchTerm, equipos]);

  const loadEquipos = async () => {
    try {
      const data = await equipoService.getAll();
      // Solo mostrar equipos disponibles
      const disponibles = data.filter(e => e.estado === 'disponible');
      setEquipos(disponibles);
      setFilteredEquipos(disponibles);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      showToast('Error al cargar los equipos', 'error');
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
        equipo.categoria?.toLowerCase().includes(term)
    );
    setFilteredEquipos(filtered);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ show: true, message, type });
  };

  const handleSelectEquipo = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipo || !user) {
      showToast('Debe seleccionar un equipo', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      await prestamoService.create({
        id_equipo: selectedEquipo.id,
        id_usuario: user.id,
        observaciones: observaciones.trim() || undefined,
      });

      showToast('Solicitud enviada exitosamente', 'success');
      setSelectedEquipo(null);
      setObservaciones('');
      await loadEquipos(); // Recargar para actualizar disponibilidad
    } catch (error: any) {
      console.error('Error al crear solicitud:', error);
      showToast(error.response?.data?.error || 'Error al enviar la solicitud', 'error');
    } finally {
      setSubmitting(false);
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

  // Agrupar por categoría
  const categorias = [...new Set(filteredEquipos.map(e => e.categoria))].filter(Boolean);

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solicitar Préstamo</h1>
          <p className="text-gray-600">Selecciona un equipo disponible para solicitar</p>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Equipos disponibles */}
        {equipos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay equipos disponibles
            </h3>
            <p className="text-gray-600">
              Todos los equipos están prestados o en mantenimiento
            </p>
          </div>
        ) : filteredEquipos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No se encontraron equipos con ese criterio</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categorias.map(categoria => (
              <div key={categoria} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{categoria}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEquipos
                      .filter(e => e.categoria === categoria)
                      .map(equipo => (
                        <div
                          key={equipo.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedEquipo?.id === equipo.id
                              ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600'
                              : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                          }`}
                          onClick={() => handleSelectEquipo(equipo)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <Package className="h-8 w-8 text-gray-400" />
                            {selectedEquipo?.id === equipo.id && (
                              <CheckCircle className="h-6 w-6 text-primary-600" />
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{equipo.nombre}</h4>
                          {equipo.numero_serie && (
                            <p className="text-xs text-gray-500 font-mono mb-2">
                              S/N: {equipo.numero_serie}
                            </p>
                          )}
                          {equipo.observaciones && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {equipo.observaciones}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulario de solicitud */}
        {selectedEquipo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Completar Solicitud
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Equipo seleccionado */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Equipo seleccionado:</p>
                <p className="font-medium text-gray-900">{selectedEquipo.nombre}</p>
                {selectedEquipo.categoria && (
                  <p className="text-sm text-gray-600">{selectedEquipo.categoria}</p>
                )}
              </div>

              {/* Observaciones */}
              <div>
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo o detalles del préstamo (opcional)
                </label>
                <textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Ej: Necesito el equipo para dar clases de programación..."
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEquipo(null);
                    setObservaciones('');
                  }}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                  disabled={submitting}
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Enviando...' : 'Enviar Solicitud'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};