import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import './App.css';

// Rota protegida
function ProtectedRoute({ children, perfisPermitidos }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (perfisPermitidos && !perfisPermitidos.includes(usuario.perfil)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className={`app-container ${isLoggedIn ? 'layout-sidebar' : 'layout-vertical'}`}>
      {isLoggedIn ? <Sidebar /> : <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to={
            JSON.parse(localStorage.getItem('usuario') || '{}').perfil === 'cliente' ? '/agenda' : '/atendimento'
          } replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profissionais" element={<Profissionais />} />

          <Route path="/agenda" element={
            <ProtectedRoute>
              <Agenda />
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
          <Route path="/atendimento/:id" element={
            <ProtectedRoute perfisPermitidos={['profissional', 'admin']}>
              <SalaAtendimento />
            </ProtectedRoute>
          } />

          <Route path="/clientes" element={
            <ProtectedRoute perfisPermitidos={['admin', 'profissional']}>
              <Clientes />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
