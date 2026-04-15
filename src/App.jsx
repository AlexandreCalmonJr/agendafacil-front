import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Agenda from './pages/Agenda';
import Agendar from './pages/Agendar';
import Clientes from './pages/Clientes';
import Profissionais from './pages/Profissionais';
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

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
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

            <Route path="/clientes" element={
              <ProtectedRoute perfisPermitidos={['admin', 'profissional']}>
                <Clientes />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
