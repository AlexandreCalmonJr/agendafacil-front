import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const handleAgendar = () => {
    if (isLoggedIn) {
      navigate('/agendar');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', padding: '4rem 0' }}>
      
      {/* Hero Section */}
      <section className="hero" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', textAlign: 'center', paddingBottom: '4rem' }}>
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 2rem', color: 'white',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          ⚕️
        </div>
        <h1 style={{ fontSize: '3.8rem', letterSpacing: '-1px', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          Clínica Vita<br />
          <span style={{ color: 'var(--primary-400)', fontWeight: '300' }}>Excelência em Saúde</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--dark-300)', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto' }}>
          Agende sua consulta com nossos especialistas. Oferecemos atendimento humanizado, corpo clínico de excelência e ambientes exclusivos para o seu bem-estar.
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '3rem', gap: '1rem' }}>
          <button onClick={handleAgendar} className="btn btn-primary btn-lg" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            📅 Agendar Consulta
          </button>
          
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-lg" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                👤 Área do Paciente
              </Link>
              <Link to="/profissionais" className="btn btn-outline btn-lg" style={{ padding: '1rem 2rem', fontSize: '1.1rem', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                👥 Corpo Clínico
              </Link>
            </>
          ) : (
            <Link to="/agenda" className="btn btn-secondary btn-lg" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              📋 Minhas Consultas
            </Link>
          )}
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="features-grid" style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="feature-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-400)' }}>⚕️</div>
          <h3 style={{ color: 'white', fontSize: '1.3rem' }}>Corpo Clínico Seleto</h3>
          <p style={{ color: 'var(--dark-400)' }}>Especialistas altamente qualificados e dedicados ao seu bem-estar, proporcionando diagnósticos e tratamentos precisos.</p>
        </div>
        <div className="feature-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>🩺</div>
          <h3 style={{ color: 'white', fontSize: '1.3rem' }}>Atendimento Humanizado</h3>
          <p style={{ color: 'var(--dark-400)' }}>Foco total no paciente, com consultas rigorosas que respeitam o seu tempo e as suas necessidades individuais.</p>
        </div>
        <div className="feature-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--violet-400)' }}>🔬</div>
          <h3 style={{ color: 'white', fontSize: '1.3rem' }}>Tecnologia de Ponta</h3>
          <p style={{ color: 'var(--dark-400)' }}>Acompanhamento integrado com prontuários eletrônicos modernos, garantindo máxima segurança e agilidade.</p>
        </div>
      </section>

    </div>
  );
}
