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
          <h1>Sua Clínica com Gestão <span>Inteligente & Humana.</span></h1>
          <p>Potencialize sua prática médica com tecnologia de ponta. Do agendamento online intuitivo ao prontuário digital completo, simplificamos processos para você focar no que realmente importa: a saúde e o bem-estar dos seus pacientes.</p>
          
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
          className="carousel-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="carousel-track"
            drag="x"
            dragConstraints={{ right: 0, left: -600 }}
            whileTap={{ cursor: "grabbing" }}
          >
            {[
              { icon: <Calendar />, title: "Agendamento Online", desc: "Seus pacientes agendam em segundos com confirmação em tempo real e lembretes inteligentes." },
              { icon: <Activity />, title: "Prontuário Digital", desc: "Histórico completo, prescrições e exames organizados em uma interface limpa e intuitiva." },
              { icon: <Smartphone />, title: "Teleconsulta HD", desc: "Realize atendimentos remotos seguros com videochamada de alta definição integrada." },
              { icon: <ShieldCheck />, title: "Segurança Avançada", desc: "Dados protegidos com criptografia de nível bancário e total conformidade com a LGPD." },
              { icon: <Users />, title: "Gestão de Equipe", desc: "Controle permissões, escalas e produtividade do seu staff em um único painel centralizado." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                className={`feature-card ${idx === 1 ? 'high' : ''}`}
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="icon-wrapper">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="carousel-hint">← Arraste para explorar →</div>
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
          <div className="footer-brand">
            <div className="footer-logo">⚕️ Clínica Vita</div>
            <p>Excelência em gestão em saúde. Unindo tecnologia de ponta ao cuidado humanizado para oferecer a melhor experiência médica.</p>
          </div>
          <div className="footer-links">
            <h4>Plataforma</h4>
            <ul>
              <li><Link to="/login">Acesso Profissional</Link></li>
              <li><Link to="/agendar">Agendamento</Link></li>
              <li><Link to="/profissionais">Corpo Clínico</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contato</h4>
            <ul>
              <li>suporte@clinicavita.com</li>
              <li>(11) 4004-0000</li>
              <li>Av. Paulista, 1000 - SP</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 VitalPro Hub. Todos os direitos reservados.</p>
          <div className="footer-legal">
            <a href="#">Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
