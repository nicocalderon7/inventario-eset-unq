import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Layout } from './components/layout/Layout';

// Placeholder temporal para Dashboard
const Dashboard = () => {
  return (
    <Layout>
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>¡Bienvenido al sistema de inventario!</p>
      </div>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;