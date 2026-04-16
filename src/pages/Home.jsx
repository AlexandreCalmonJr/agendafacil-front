import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Calendar,
  Smartphone
} from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            ✧ Tecnologia & Humanização ✧
          </motion.span>
          <h1>A Excelência da Saúde em um <span>Clique.</span></h1>
          <p>Experimente o futuro da gestão clínica. Do agendamento inteligente à Sala 360º de telemedicina, conectamos você ao cuidado de elite.</p>
          
          <div className="hero-cta">
            <Link to="/login" className="btn-hero-primary">
              Começar Agora <ArrowRight size={20} />
            </Link>
            <Link to="/profissionais" className="btn-hero-secondary">
              Corpo Clínico
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <strong>+5.0k</strong>
              <span>Atendimentos</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <strong>100%</strong>
              <span>Seguro</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <strong>4.9/5</strong>
              <span>Avaliação</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="features-section">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <h2>Ecossistema VitalPro</h2>
          <p>Uma plataforma unificada para médicos, staff e pacientes.</p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="icon-wrapper"><Calendar /></div>
            <h3>Agendamento Smart</h3>
            <p>Agende consultas em segundos com confirmação automática por WhatsApp.</p>
          </motion.div>

          <motion.div className="feature-card glass-card high" variants={itemVariants}>
            <div className="icon-wrapper"><Activity /></div>
            <h3>Histórico 360º</h3>
            <p>Acesso completo à evolução clínica e exames em uma única tela integrada.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="icon-wrapper"><Smartphone /></div>
            <h3>Telemedicina HD</h3>
            <p>Consultas remotas seguras com ferramentas de prescrição em tempo real.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="icon-wrapper"><ShieldCheck /></div>
            <h3>Dados Blindados</h3>
            <p>Segurança de nível bancário e conformidade total com a LGPD.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="trust-section glass">
        <div className="trust-content">
          <div className="trust-text">
            <h3>Por que escolher a Clínica Vita?</h3>
            <ul className="trust-list">
              <li><CheckCircle2 size={18} /> Profissionais graduados nas melhores instituições.</li>
              <li><CheckCircle2 size={18} /> Infraestrutura tecnológica de última geração.</li>
              <li><CheckCircle2 size={18} /> Atendimento personalizado de elite.</li>
              <li><CheckCircle2 size={18} /> Localização privilegiada no coração da cidade.</li>
            </ul>
          </div>
          <div className="trust-image">
            <div className="floating-card animate-float">
              <Clock size={24} />
              <div>
                <strong>Agilidade</strong>
                <span>Fila zero na recepção</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">⚕️ Clínica Vita</div>
          <p>© 2026 VitalPro Hub. Todos os direitos reservados.</p>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          background: #0a0a0b;
          color: white;
          overflow-x: hidden;
        }

        .hero-section {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop') center/cover;
          text-align: center;
          padding: 2rem;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(10, 10, 11, 0.4) 0%, rgba(10, 10, 11, 0.98) 80%);
          backdrop-filter: blur(2px);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.2rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 50px;
          font-size: 0.8rem;
          color: #a78bfa;
          margin-bottom: 2rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .hero-content h1 {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #f8f9fa;
          text-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }

        .hero-content h1 span {
          color: #8b5cf6;
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content p {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0,0,0,0.9);
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
        }

        .btn-hero-primary {
          background: #8b5cf6;
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: 0.3s;
          text-decoration: none;
        }

        .btn-hero-primary:hover {
          background: #7c3aed;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
        }

        .btn-hero-secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          transition: 0.3s;
          text-decoration: none;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
        }

        .stat-item strong { display: block; font-size: 1.8rem; }
        .stat-item span { font-size: 0.9rem; opacity: 0.6; }
        .stat-divider { width: 1px; height: 40px; background: rgba(255, 255, 255, 0.1); }

        .features-section { padding: 8rem 2rem; max-width: 1200px; margin: 0 auto; }
        .section-header { text-align: center; margin-bottom: 4rem; }
        .section-header h2 { font-size: 2.5rem; margin-bottom: 1rem; }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2.5rem;
          border-radius: 24px;
          height: 100%;
          transition: 0.3s;
        }

        .feature-card:hover {
          background: rgba(139, 92, 246, 0.05);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-5px);
        }

        .icon-wrapper {
          width: 50px;
          height: 50px;
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .trust-section {
          max-width: 1200px;
          margin: 4rem auto 8rem;
          padding: 4rem;
          border-radius: 32px;
        }

        .trust-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .trust-list {
          list-style: none;
          padding: 0;
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .trust-list li {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .trust-list li :global(svg) { color: #10b981; }

        .trust-image {
          height: 300px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1));
          border-radius: 24px;
          position: relative;
        }

        .floating-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, -60%); }
        }

        .landing-footer {
          padding: 4rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
        }

        .footer-logo {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.5rem; }
          .hero-stats { flex-direction: column; gap: 1.5rem; }
          .trust-content { grid-template-columns: 1fr; }
          .stat-divider { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;
