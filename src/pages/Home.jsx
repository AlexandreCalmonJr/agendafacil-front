import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Home.css';
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
      <div className="hero-overlay"></div>
      {/* Hero Section */}
      <section className="hero-section">
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
    </div>
  );
};

export default Home;
