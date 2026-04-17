import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { listarProfissionais } from '../services/api';
import logo from '../assets/image/logo.jpg';
import '../styles/Header.css';

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
          <div className="logo-icon">
            <img src={logo} alt="Clínica Vita" />
          </div>
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
          <li>
            <Link to="/especialidades" className={isActive('/especialidades')} onClick={() => setMenuOpen(false)}>
              Especialidades
            </Link>
          </li>
          <li>
            <Link to="/noticias" className={isActive('/noticias')} onClick={() => setMenuOpen(false)}>
              Notícias da Saúde
            </Link>
          </li>
          <li>
            <Link to="/novidades" className={isActive('/novidades')} onClick={() => setMenuOpen(false)}>
              Novidades da Clínica
            </Link>
          </li>
          <li>
            <Link to="/contato" className={isActive('/contato')} onClick={() => setMenuOpen(false)}>
              Fale Conosco
            </Link>
          </li>
        </ul>

        <div className="navbar-user">
          <Link to="/login" className="btn btn-sm btn-outline">
            Painel do Profissional
          </Link>
        </div>
      </div>
    </nav>
  );
}
