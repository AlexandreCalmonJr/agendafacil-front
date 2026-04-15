import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const usuarioStr = localStorage.getItem('usuario');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">📅</div>
          <span>AgendaFácil</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>
              Início
            </Link>
          </li>

          {isLoggedIn && (
            <>
              <li>
                <Link to="/agenda" className={isActive('/agenda')} onClick={() => setMenuOpen(false)}>
                  Agenda
                </Link>
              </li>
              <li>
                <Link to="/agendar" className={isActive('/agendar')} onClick={() => setMenuOpen(false)}>
                  Agendar
                </Link>
              </li>
              {usuario?.perfil !== 'cliente' && (
                <li>
                  <Link to="/clientes" className={isActive('/clientes')} onClick={() => setMenuOpen(false)}>
                    Clientes
                  </Link>
                </li>
              )}
              <li>
                <Link to="/profissionais" className={isActive('/profissionais')} onClick={() => setMenuOpen(false)}>
                  Profissionais
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-user">
          {isLoggedIn && usuario ? (
            <>
              <div className="user-info">
                <div className="user-name">{usuario.nome}</div>
                <div className="user-role">{usuario.perfil}</div>
              </div>
              <div className="user-avatar">{getInitials(usuario.nome)}</div>
              <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
