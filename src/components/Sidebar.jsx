import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import { 
  Home, 
  Calendar, 
  Stethoscope, 
  Users, 
  LayoutDashboard, 
  Globe, 
  List, 
  UserSquare2, 
  LogOut,
  Activity,
  Moon,
  Sun
} from 'lucide-react';
import logoImg from '../assets/image/logo.jpg';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { usuario, logoutContext } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    logoutContext();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (!usuario) return null;

  return (
    <aside className="sidebar-premium">
      <div className="sidebar-header-premium">
        <Link to="/" className="sidebar-logo-premium">
          <img src={logoImg} alt="Clínica Vita" className="logo-main" />
          <span className="logo-text">Clínica Vita</span>
        </Link>
      </div>

      <div className="sidebar-nav-container">
        <ul className="sidebar-nav">
          <li className="nav-label">MENU PRINCIPAL</li>
          
          {/* LINKS DO CLIENTE */}
          {usuario?.perfil === 'cliente' && (
            <>
              <li>
                <Link to="/dashboard" className={`nav-link-premium ${isActive('/dashboard')}`}>
                  <Home size={18} /> <span>Início</span>
                </Link>
              </li>
              <li>
                <Link to="/agenda" className={`nav-link-premium ${isActive('/agenda')}`}>
                  <List size={18} /> <span>Minhas Consultas</span>
                </Link>
              </li>
              <li>
                <Link to="/agendar" className={`nav-link-premium ${isActive('/agendar')}`}>
                  <Calendar size={18} /> <span>Agendar</span>
                </Link>
              </li>
              <li>
                <Link to="/profissionais" className={`nav-link-premium ${isActive('/profissionais')}`}>
                  <Users size={18} /> <span>Corpo Clínico</span>
                </Link>
              </li>
            </>
          )}

          {/* LINKS DO PROFISSIONAL (MÉDICO) */}
          {usuario?.perfil === 'profissional' && (
            <>
              <li>
                <Link to="/dashboard-profissional" className={`nav-link-premium ${isActive('/dashboard-profissional')}`}>
                  <Home size={18} /> <span>Início</span>
                </Link>
              </li>
              <li>
                <Link to="/atendimento" className={`nav-link-premium ${isActive('/atendimento') || location.pathname.startsWith('/atendimento') ? 'active' : ''}`}>
                  <Activity size={18} /> <span>Atendimento</span>
                </Link>
              </li>
              <li>
                <Link to="/agenda" className={`nav-link-premium ${isActive('/agenda')}`}>
                  <Calendar size={18} /> <span>Agenda Semanal</span>
                </Link>
              </li>
            </>
          )}

          {/* LINKS DO ADMINISTRADOR E RECEPCIONISTA */}
          {(usuario?.perfil === 'admin' || usuario?.perfil === 'recepcionista') && (
            <>
              <li>
                <Link to="/dashboard-staff" className={`nav-link-premium ${isActive('/dashboard-staff')}`}>
                  <LayoutDashboard size={18} /> <span>Hub Operacional</span>
                </Link>
              </li>
              <li>
                <Link to="/gestao-global" className={`nav-link-premium ${isActive('/gestao-global')}`}>
                  <Globe size={18} /> <span>Agenda Global</span>
                </Link>
              </li>
              <li>
                <Link to="/clientes" className={`nav-link-premium ${isActive('/clientes')}`}>
                  <UserSquare2 size={18} /> <span>Pacientes</span>
                </Link>
              </li>
              <li>
                <Link to="/profissionais" className={`nav-link-premium ${isActive('/profissionais')}`}>
                  <Users size={18} /> <span>Profissionais</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="sidebar-footer-premium">
        <button className="btn-theme-toggle" onClick={toggleDarkMode} title="Alternar tema">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>
        
        <div className="user-profile-premium">
          <div className="user-avatar-premium">{getInitials(usuario.nome)}</div>
          <div className="user-details-premium">
            <span className="user-name-text">{usuario.nome}</span>
            <span className="user-perfil-tag">{usuario.perfil}</span>
          </div>
        </div>
        <button className="btn-logout-premium" onClick={handleLogout}>
          <LogOut size={16} /> <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}
