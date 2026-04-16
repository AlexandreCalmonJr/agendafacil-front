import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { Calendar, Users, Shield, LogIn } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">⚕️</span>
            <span className="logo-text">Clínica Vita</span>
          </div>
          <nav className="header-nav">
            <Link to="/login" className="nav-link">Profissionais</Link>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Entrar
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Gestão de Agendamentos e Prontuários Médicos</h1>
          <p>Plataforma integrada para clínicas e profissionais de saúde gerenciarem consultas, pacientes e prontuários com segurança.</p>
          
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary btn-lg">
              Acessar Sistema
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Funcionalidades Principais</h2>
        
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon">
              <Calendar size={32} />
            </div>
            <h3>Agendamento</h3>
            <p>Gerencie consultas, confirmações e notificações automáticas de forma eficiente.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3>Pacientes & Prontuários</h3>
            <p>Mantenha histórico clínico organizado com acesso rápido aos dados de cada paciente.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Segurança de Dados</h3>
            <p>Informações protegidas conforme normas LGPD e padrões de seguran ça para saúde.</p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-content">
          <h2>Para Profissionais</h2>
          <p>Organize sua agenda, consulte histórico de pacientes e gere documentos rapidamente.</p>
          
          <h2 style={{ marginTop: '2rem' }}>Para Pacientes</h2>
          <p>Agende consultas, visualize seu histórico médico e receba notificações sobre seus atendimentos.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 Clínica Vita. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
