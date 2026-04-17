import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Calendar,
  Smartphone,
  Stethoscope,
  Newspaper,
  Megaphone
} from 'lucide-react';
import { listarProfissionais, listarNoticiasSaude, listarNovidadesClinica } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [novidades, setNovidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosHome() {
      try {
        const [profRes, newsRes, novRes] = await Promise.all([
          listarProfissionais(),
          listarNoticiasSaude(),
          listarNovidadesClinica()
        ]);
        
        // Pegamos apenas as 4 primeiras especialidades únicas/profissionais
        setEspecialidades(profRes.data.slice(0, 4));
        // Pegamos 3 notícias do G1
        setNoticias(newsRes.data.slice(0, 3));
        // Pegamos 3 novidades da clínica
        setNovidades(novRes.data.slice(0, 3));
      } catch (err) {
        console.error("Erro ao carregar dados da home:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDadosHome();
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="landing-page">
      <div className="hero-overlay"></div>
      
      {/* Hero Section - FOCO NO AGENDAMENTO */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span className="hero-badge">✧ Tecnologia & Humanização ✧</motion.span>
          <h1>Agende sua Saúde em <span>Segundos.</span></h1>
          <p>Potencialize seu cuidado com a Clínica Vita. Agendamento online intuitivo, teleconsulta segura e uma equipe de elite pronta para te atender.</p>
          
          <div className="hero-cta">
            <Link to="/agendar" className="btn-hero-primary">
              Agendar Agora <Calendar size={20} />
            </Link>
            <Link to="/profissionais" className="btn-hero-secondary">
              Ver Profissionais
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item"><strong>+10k</strong><span>Pacientes</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><strong>100%</strong><span>Digital</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><strong>4.9/5</strong><span>Avaliação</span></div>
          </div>
        </motion.div>
      </section>

      {/* Seção Especialidades - NOVIDADE */}
      <section className="home-section specialties-preview">
        <div className="section-header">
          <span className="section-badge"><Stethoscope size={16} /> Especialidades</span>
          <h2>Cuidado Especializado para Você</h2>
          <Link to="/especialidades" className="view-all">Ver todas especialidades <ArrowRight size={16} /></Link>
        </div>
        <div className="specialties-grid">
          {especialidades.map((esp, i) => (
            <motion.div key={i} className="mini-specialty-card" whileHover={{ y: -5 }}>
              <div className="mini-card-icon">⚕️</div>
              <h4>{esp.especialidade}</h4>
              <p>{esp.nome}</p>
            </motion.div>
          ))}
          {especialidades.length === 0 && !loading && (
            <div className="empty-mini">Nenhuma especialidade disponível no momento.</div>
          )}
        </div>
      </section>

      {/* Features Section - REUTILIZADA */}
      <section className="features-section">
        <div className="section-header">
          <h2>Por que a Clínica Vita?</h2>
          <p>O ecossistema Portal VitaHub foi desenhado para sua conveniência.</p>
        </div>
        <div className="features-bento">
          <div className="feature-card highlight">
            <Calendar />
            <h3>Agendamento Inteligente</h3>
            <p>Escolha data e hora sem complicação, 24 horas por dia.</p>
          </div>
          <div className="feature-card">
            <Smartphone />
            <h3>Teleconsulta HD</h3>
            <p>Atendimento médico de qualidade no conforto do seu lar.</p>
          </div>
          <div className="feature-card">
            <ShieldCheck />
            <h3>Dados Seguros</h3>
            <p>Seu histórico clínico protegido com criptografia de ponta.</p>
          </div>
          <div className="feature-card">
            <Activity />
            <h3>Monitoramento</h3>
            <p>Acompanhe sua evolução e exames em tempo real no portal.</p>
          </div>
        </div>
      </section>

      {/* Seção Notícias - NOVIDADE */}
      <section className="home-section news-preview">
        <div className="section-header">
          <span className="section-badge"><Newspaper size={16} /> Radar de Saúde</span>
          <h2>Últimas do G1 Saúde</h2>
          <Link to="/noticias" className="view-all">Ler todas notícias <ArrowRight size={16} /></Link>
        </div>
        <div className="news-mini-grid">
          {noticias.map((news, i) => (
            <a href={news.link} target="_blank" key={i} className="mini-news-item">
              <span className="mini-news-date">{news.date}</span>
              <h4>{news.title}</h4>
            </a>
          ))}
        </div>
      </section>

      {/* Seção Novidades Clínica - NOVIDADE */}
      <section className="home-section clinic-updates">
        <div className="section-header">
          <span className="section-badge"><Megaphone size={16} /> Novidades Vita</span>
          <h2>O que acontece na Clínica</h2>
        </div>
        <div className="updates-row">
          {novidades.map((nov, i) => (
            <div key={i} className="mini-update-card">
              <img src={nov.image} alt={nov.title} />
              <div className="update-info">
                <span className="update-tag">{nov.category}</span>
                <h4>{nov.title}</h4>
                <Link to="/novidades">Saiba mais</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="trust-container">
          <div className="trust-content">
            <div className="trust-text">
              <h3>Excelência & Confiança</h3>
              <ul className="trust-list">
                <li><CheckCircle2 size={24} className="check-icon" /> Profissionais das melhores instituições.</li>
                <li><CheckCircle2 size={24} className="check-icon" /> Tecnologia de agendamento anti-conflito.</li>
                <li><CheckCircle2 size={24} className="check-icon" /> Ambiente moderno e humanizado.</li>
              </ul>
            </div>
            <div className="trust-image">
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
