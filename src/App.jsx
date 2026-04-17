import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Agenda from './pages/Agenda';
import Agendar from './pages/Agendar';
import Clientes from './pages/Clientes';
import Profissionais from './pages/Profissionais';
import PainelMedico from './pages/PainelMedico';
import SalaAtendimento from './pages/SalaAtendimento';
import DashboardPaciente from './pages/DashboardPaciente';
import DashboardProfissional from './pages/DashboardProfissional';
import DashboardStaff from './pages/DashboardStaff';
import GestaoGlobal from './pages/GestaoGlobal';
import Loading from './components/Loading';
import './styles/App.css';

// Rota protegida otimizada
function ProtectedRoute({ children, perfisPermitidos }) {
  const { usuario, authenticated, loading } = useAuth();

  if (loading) return <Loading text="Validando acesso..." />;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (perfisPermitidos && !perfisPermitidos.includes(usuario?.perfil)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  const { authenticated, usuario, loading } = useAuth();
  
  if (loading) return <Loading text="Carregando Clínica Vita..." />;

  return (
    <div className={`app-container ${authenticated ? 'layout-sidebar' : 'layout-vertical'}`}>
      {authenticated ? <Sidebar /> : <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={!authenticated ? <Home /> : <Navigate to={
            (() => {
              if (usuario?.perfil === 'cliente') return '/dashboard';
              if (usuario?.perfil === 'recepcionista') return '/dashboard-staff';
              return '/dashboard-profissional';
            })()
          } replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/profissionais" element={<Profissionais />} />

          <Route path="/agenda" element={
            <ProtectedRoute>
              <Agenda />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute perfisPermitidos={['cliente', 'admin']}>
              <DashboardPaciente />
            </ProtectedRoute>
          } />

          <Route path="/agendar" element={
            <ProtectedRoute perfisPermitidos={['cliente', 'admin']}>
              <Agendar />
            </ProtectedRoute>
          } />

          <Route path="/atendimento" element={
            <ProtectedRoute perfisPermitidos={['profissional', 'admin']}>
              <PainelMedico />
            </ProtectedRoute>
          } />

          <Route path="/dashboard-profissional" element={
            <ProtectedRoute perfisPermitidos={['profissional', 'admin']}>
              <DashboardProfissional />
            </ProtectedRoute>
          } />
          
          <Route path="/atendimento/:id" element={
            <ProtectedRoute perfisPermitidos={['profissional', 'admin']}>
              <SalaAtendimento />
            </ProtectedRoute>
          } />

          <Route path="/clientes" element={
            <ProtectedRoute perfisPermitidos={['admin', 'profissional', 'recepcionista']}>
              <Clientes />
            </ProtectedRoute>
          } />

          <Route path="/dashboard-staff" element={
            <ProtectedRoute perfisPermitidos={['recepcionista', 'admin']}>
              <DashboardStaff />
            </ProtectedRoute>
          } />

          <Route path="/gestao-global" element={
            <ProtectedRoute perfisPermitidos={['recepcionista', 'admin']}>
              <GestaoGlobal />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}
