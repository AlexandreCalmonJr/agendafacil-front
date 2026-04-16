import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listarAgendamentos } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import Loading from '../components/Loading';
import { Bell, BellRing, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import './DashboardProfissional.css';

export default function DashboardProfissional() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  // Feature 4: Notificações em Tempo Real
  const { notification, clearNotification } = useNotifications(usuario);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    setLoading(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const res = await listarAgendamentos({ data: hoje });
      setAgendamentos(res.data);
    } catch (err) {
      console.error('Erro ao carregar resumo do dia:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading) return <Loading text="Conectando ao VitalPro Hub..." />;

  // Métricas do dia
  const total = agendamentos.length;
  const aguardando = agendamentos.filter(a => ['agendado', 'confirmado', 'em_espera'].includes(a.status)).length;
  const atendidos = agendamentos.filter(a => a.status === 'concluido').length;
  const proximo = agendamentos.find(a => ['confirmado', 'em_espera'].includes(a.status));

  return (
    <div className="dashboard-profissional fade-in">
      
      {/* ALERTA DE NOTIFICAÇÃO (FEATURE 4) */}
      {notification && (
        <div className="notification-toast glass animate-slide-down">
          <div className="toast-content">
            <div className="toast-icon pulse"><BellRing size={24} /></div>
            <div className="toast-text">
              <strong>Check-in Realizado!</strong>
              <p>{notification.msg}</p>
            </div>
            <button className="toast-close" onClick={clearNotification}>×</button>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      <div className="dashboard-header">
        <div className="welcome-section">
          <span className="welcome-badge"><Sparkles size={14} /> Hub de Excelência</span>
          <h1>
            {getSaudacao()}, <span className="highlight-text">{usuario?.nome.split(' ')[0]}</span> 🩺
          </h1>
          <p>Você possui <strong>{aguardando}</strong> pacientes aguardando atendimento.</p>
        </div>
        <div className="header-meta">
          <div className="date-badge">
            📅 {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS (ELITE DESIGN) */}
      <div className="metrics-row">
        <div className="metric-card-pro glass">
          <div className="metric-icon-pro blue"><TrendingUp size={20} /></div>
          <div className="metric-details">
            <span className="label">Total Hoje</span>
            <span className="value">{total}</span>
          </div>
        </div>
        <div className="metric-card-pro glass">
          <div className="metric-icon-pro orange"><Bell size={20} /></div>
          <div className="metric-details">
            <span className="label">Aguardando</span>
            <span className="value">{aguardando}</span>
          </div>
        </div>
        <div className="metric-card-pro glass">
          <div className="metric-icon-pro green"><CheckCircle2 size={20} /></div>
          <div className="metric-details">
            <span className="label">Concluídos</span>
            <span className="value">{atendidos}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="left-column">
          {/* CARD DE PRÓXIMO PACIENTE (ELITE STYLE) */}
          <div className="featured-card glass">
            <div className="card-badge">PRÓXIMO PACIENTE</div>
            {proximo ? (
              <div className="featured-patient">
                <div className="patient-main">
                  <div className="patient-avatar-large">
                    {proximo.cliente_nome.charAt(0)}
                  </div>
                  <div className="patient-info-large">
                    <h2>{proximo.cliente_nome}</h2>
                    <span className="service-tag">{proximo.servico_nome}</span>
                  </div>
                </div>
                <div className="patient-meta-large">
                  <div className="time-group">
                    <span className="large-time">
                      {new Date(proximo.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`status-pill pill-${proximo.status}`}>{proximo.status}</span>
                  </div>
                  <button className="btn-start-atendimento" onClick={() => navigate(`/atendimento/${proximo.id}`)}>
                    Iniciar Atendimento
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-featured">
                <p>Nenhum paciente aguardando no momento.</p>
              </div>
            )}
          </div>

          <div className="shortcuts-grid">
            <Link to="/atendimento" className="shortcut-item glass">
              <div className="shortcut-icon">🚶‍♂️</div>
              <span>Sala de Espera</span>
            </Link>
            <Link to="/agenda" className="shortcut-item glass">
              <div className="shortcut-icon">📅</div>
              <span>Minha Agenda</span>
            </Link>
            <Link to="/clientes" className="shortcut-item glass">
              <div className="shortcut-icon">📂</div>
              <span>Meus Pacientes</span>
            </Link>
          </div>
        </div>

        <div className="right-column">
          <div className="side-card glass">
            <h3><History size={18} /> Atendimentos Recentes</h3>
            <div className="recent-list">
              {agendamentos.filter(a => a.status === 'concluido').slice(0, 4).map(a => (
                <div key={a.id} className="recent-item">
                  <div className="recent-time">{new Date(a.data_hora).getHours()}:{new Date(a.data_hora).getMinutes().toString().padStart(2, '0')}</div>
                  <div className="recent-info">
                    <strong>{a.cliente_nome}</strong>
                    <span>{a.servico_nome}</span>
                  </div>
                </div>
              ))}
              {atendidos === 0 && <p className="empty-text">Nenhum atendimento finalizado hoje.</p>}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
