import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listarAgendamentos } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import Loading from '../components/Loading';
import { Bell, BellRing, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

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

      <style jsx>{`
        .dashboard-profissional { padding: 2rem; max-width: 1400px; margin: 0 auto; }
        .welcome-badge { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 1rem; }
        .highlight-text { color: #8b5cf6; }
        
        .metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .metric-card-pro { padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; border-radius: 20px; }
        .metric-icon-pro { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .metric-icon-pro.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .metric-icon-pro.orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .metric-icon-pro.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .metric-details .label { font-size: 0.8rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
        .metric-details .value { font-size: 1.8rem; font-weight: 800; display: block; color: white; }

        .dashboard-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        
        .featured-card { padding: 2.5rem; border-radius: 24px; position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(15, 23, 42, 0.5) 100%); border: 1px solid rgba(139, 92, 246, 0.2); }
        .card-badge { position: absolute; top: 0; right: 0; background: #8b5cf6; color: white; padding: 6px 16px; font-size: 0.7rem; font-weight: 800; border-bottom-left-radius: 12px; }
        
        .featured-patient { display: flex; justify-content: space-between; align-items: center; }
        .patient-main { display: flex; align-items: center; gap: 1.5rem; }
        .patient-avatar-large { width: 80px; height: 80px; background: #8b5cf6; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: white; font-weight: 700; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3); }
        .patient-info-large h2 { font-size: 2rem; margin: 0; color: white; }
        .service-tag { background: rgba(255, 255, 255, 0.05); color: #94a3b8; padding: 4px 10px; border-radius: 6px; font-size: 0.9rem; }
        
        .patient-meta-large { text-align: right; }
        .large-time { font-size: 2.5rem; font-weight: 800; display: block; color: white; color: #8b5cf6; }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-top: 0.5rem; }
        .pill-em_espera { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        
        .btn-start-atendimento { margin-top: 1.5rem; background: #8b5cf6; color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
        .btn-start-atendimento:hover { background: #7c3aed; transform: translateY(-3px); }

        .shortcuts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .shortcut-item { padding: 1.5rem; text-align: center; border-radius: 18px; text-decoration: none; color: white; transition: 0.3s; }
        .shortcut-item:hover { background: rgba(139, 92, 246, 0.1); border-color: #8b5cf6; }
        .shortcut-icon { font-size: 2rem; margin-bottom: 0.5rem; }

        .side-card { padding: 1.5rem; border-radius: 20px; }
        .recent-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .recent-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.02); border-radius: 14px; }
        .recent-time { font-weight: 800; color: #8b5cf6; }
        .recent-info strong { display: block; font-size: 0.95rem; }
        .recent-info span { font-size: 0.8rem; opacity: 0.6; }

        .notification-toast { position: fixed; top: 2rem; right: 2rem; z-index: 9999; padding: 1.5rem; border-radius: 16px; border: 1px solid #8b5cf6; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 350px; background: rgba(15, 23, 42, 0.95); }
        .toast-content { display: flex; gap: 1rem; align-items: flex-start; }
        .toast-icon.pulse { color: #8b5cf6; animation: toast-pulse 1.5s infinite; }
        .toast-text strong { display: block; color: white; }
        .toast-text p { font-size: 0.9rem; margin: 4px 0 0; color: #94a3b8; }
        .toast-close { background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; }
        .toast-progress { position: absolute; bottom: 0; left: 0; height: 3px; background: #8b5cf6; animation: progress 5s linear forwards; }

        @keyframes progress { from { width: 100%; } to { width: 0%; } }
        @keyframes toast-pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
