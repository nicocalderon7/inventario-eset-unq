import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import unqLogo from '../../assets/favicon-96x96.png';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src={unqLogo}
                alt="Universidad Nacional de Quilmes"
                className="h-8 w-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Inventario ESET-UNQ
                </h1>
                <p className="text-xs text-gray-500">
                  {isAdmin ? 'Panel de Administración' : 'Portal de Docentes'}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.nombre}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600"
            >
              Dashboard
            </button>
            
            {isAdmin ? (
              // Menú para Administradores
              <>
                <button
                  onClick={() => navigate('/equipos')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600"
                >
                  Equipos
                </button>
                <button
                  onClick={() => navigate('/prestamos')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600"
                >
                  Préstamos
                </button>
                <button
                  onClick={() => navigate('/usuarios')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600"
                >
                  Usuarios
                </button>
              </>
            ) : (
              // Menú para Docentes
              <>
                <button
                  onClick={() => navigate('/solicitar-prestamo')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600"
                >
                  Solicitar Préstamo
                </button>
                <button
                  onClick={() => navigate('/mis-solicitudes')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors border-b-2 border-transparent hover:border-primary-600"
                >
                  Mis Solicitudes
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};