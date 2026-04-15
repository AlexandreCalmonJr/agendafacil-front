import { Link } from 'react-router-dom';

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <h1>Bem-vindo à Clinica Vita<br />Agende seus serviços de forma simples e rápida</h1>
        <p>
          A Clinica Vita oferece uma plataforma completa para gerenciar agendamentos
          da sua clínica com praticidade e eficiência.
        </p>
        <div className="hero-actions">
          {isLoggedIn ? (
            <>
              <Link to="/agendar" className="btn btn-primary btn-lg">
                📅 Novo Agendamento
              </Link>
              <Link to="/agenda" className="btn btn-secondary btn-lg">
                📋 Ver Agenda
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                🚀 Começar Agora
              </Link>
              <Link to="/profissionais" className="btn btn-secondary btn-lg">
                👥 Ver Profissionais
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👨‍⚕️</div>
          <div>
            <div className="stat-value">3+</div>
            <div className="stat-label">Profissionais</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">7+</div>
            <div className="stat-label">Serviços</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon violet">👥</div>
          <div>
            <div className="stat-value">100+</div>
            <div className="stat-label">Clientes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">📅</div>
          <div>
            <div className="stat-value">500+</div>
            <div className="stat-label">Agendamentos</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-grid">
        <div className="glass-card feature-card">
          <div className="feature-icon">📅</div>
          <h3>Agendamento Online</h3>
          <p>Agende consultas e serviços diretamente pela plataforma, escolhendo profissional, serviço, data e horário.</p>
        </div>
        <div className="glass-card feature-card">
          <div className="feature-icon">📊</div>
          <h3>Agenda Visual</h3>
          <p>Visualize a agenda diária ou semanal de cada profissional com cards informativos e status em tempo real.</p>
        </div>
        <div className="glass-card feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Controle de Acesso</h3>
          <p>Sistema de perfis (admin, profissional, cliente) com permissões específicas para cada tipo de usuário.</p>
        </div>
        <div className="glass-card feature-card">
          <div className="feature-icon">🔄</div>
          <h3>Reagendamento Fácil</h3>
          <p>Cancele ou reagende seus compromissos com apenas alguns cliques, sem complicação.</p>
        </div>
        <div className="glass-card feature-card">
          <div className="feature-icon">👤</div>
          <h3>Cadastro de Clientes</h3>
          <p>Gerencie seus clientes com informações completas de contato, CPF e histórico de agendamentos.</p>
        </div>
        <div className="glass-card feature-card">
          <div className="feature-icon">📱</div>
          <h3>Design Responsivo</h3>
          <p>Acesse de qualquer dispositivo — desktop, tablet ou smartphone — com uma interface moderna e intuitiva.</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
          <h2 style={{ color: 'white', fontSize: 'var(--font-size-2xl)', fontWeight: '700', marginBottom: '1rem' }}>
            Pronto para começar?
          </h2>
          <p style={{ color: 'var(--dark-400)', marginBottom: '1.5rem' }}>
            Crie sua conta gratuitamente e comece a gerenciar seus agendamentos agora mesmo.
          </p>
          <Link to={isLoggedIn ? '/agendar' : '/login'} className="btn btn-primary btn-lg">
            {isLoggedIn ? '📅 Agendar Agora' : '🚀 Criar Conta Grátis'}
          </Link>
        </div>
      </section>
    </div>
  );
}
