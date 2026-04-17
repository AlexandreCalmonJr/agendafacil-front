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
          <h1>Sua Clínica com Gestão <span>Inteligente.</span></h1>
          <p>A tecnologia que simplifica o cuidado. Do agendamento online ao prontuário eletrônico completo, focamos no que importa: o seu paciente.</p>
          
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
          <motion.div className="feature-card" variants={itemVariants}>
            <div className="icon-wrapper"><Calendar /></div>
            <h3>Agendamento Online</h3>
            <p>Seus pacientes agendam em segundos com confirmação em tempo real.</p>
          </motion.div>

          <motion.div className="feature-card high" variants={itemVariants}>
            <div className="icon-wrapper"><Activity /></div>
            <h3>Prontuário Digital</h3>
            <p>Todo o histórico clínico e exames organizados de forma clara e segura.</p>
          </motion.div>

          <motion.div className="feature-card" variants={itemVariants}>
            <div className="icon-wrapper"><Smartphone /></div>
            <h3>Teleconsulta</h3>
            <p>Atendimento remoto seguro com prescrição digital integrada.</p>
          </motion.div>

          <motion.div className="feature-card" variants={itemVariants}>
            <div className="icon-wrapper"><ShieldCheck /></div>
            <h3>Segurança LGPD</h3>
            <p>Dados protegidos com criptografia de ponta a ponta e total conformidade.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
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
