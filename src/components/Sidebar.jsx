import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const usuarioStr = localStorage.getItem('usuario');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (!usuario) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <div className="logo-icon" style={{ background: 'var(--primary-600)' }}>⚕️</div>
          <span style={{ fontWeight: '700', letterSpacing: '-0.5px' }}>Clínica Vita</span>
        </Link>
      </div>

      <div className="sidebar-nav-container">
        <ul className="sidebar-nav">
          <li className="nav-label">MENU PRINCIPAL</li>
          
          {/* LINKS DO CLIENTE */}
          {usuario?.perfil === 'cliente' && (
            <>
              <li>
                <Link to="/agenda" className={`nav-link ${isActive('/agenda')}`}>
                  <span className="nav-icon">📋</span> Minhas Consultas
                </Link>
              </li>
              <li>
                <Link to="/agendar" className={`nav-link ${isActive('/agendar')}`}>
                  <span className="nav-icon">📅</span> Agendar
                </Link>
              </li>
              <li>
                <Link to="/profissionais" className={`nav-link ${isActive('/profissionais')}`}>
                  <span className="nav-icon">👥</span> Corpo Clínico
                </Link>
              </li>
            </>
          )}

          {/* LINKS DO PROFISSIONAL (MÉDICO) */}
          {usuario?.perfil === 'profissional' && (
            <>
              <li>
                <Link to="/atendimento" className={`nav-link ${isActive('/atendimento') || location.pathname.startsWith('/atendimento') ? 'active' : ''}`}>
                  <span className="nav-icon">💡</span> Painel de Atendimento
                </Link>
              </li>
              <li>
                <Link to="/agenda" className={`nav-link ${isActive('/agenda')}`}>
                  <span className="nav-icon">📅</span> Agenda da Semana
                </Link>
              </li>
            </>
          )}

          {/* LINKS DO ADMINISTRADOR/RECEPÇÃO */}
          {usuario?.perfil === 'admin' && (
            <>
              <li>
                <Link to="/agenda" className={`nav-link ${isActive('/agenda')}`}>
                  <span className="nav-icon">📋</span> Agenda Geral
                </Link>
              </li>
              <li>
                <Link to="/atendimento" className={`nav-link ${isActive('/atendimento') || location.pathname.startsWith('/atendimento') ? 'active' : ''}`}>
                  <span className="nav-icon">💡</span> Monitorar Fila
                </Link>
              </li>
              <li>
                <Link to="/agendar" className={`nav-link ${isActive('/agendar')}`}>
                  <span className="nav-icon">📅</span> Lançar Agendamento
                </Link>
              </li>
              <li>
                <Link to="/clientes" className={`nav-link ${isActive('/clientes')}`}>
                  <span className="nav-icon">👤</span> Pacientes
                </Link>
              </li>
              <li>
                <Link to="/profissionais" className={`nav-link ${isActive('/profissionais')}`}>
                  <span className="nav-icon">👥</span> Corpo Clínico
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{getInitials(usuario.nome)}</div>
          <div className="user-info">
            <div className="user-name">{usuario.nome}</div>
            <div className="user-role">{usuario.perfil}</div>
          </div>
        </div>
        <button className="btn btn-outline btn-logout" onClick={handleLogout}>
          <span style={{marginRight: '0.5rem'}}>🚪</span> Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
