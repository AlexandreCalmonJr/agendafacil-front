import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { listarAgendamentos, atualizarAgendamento } from '../services/api';
import { getProfImage } from '../utils/images';
import Loading from '../components/Loading';
import { 
  Bell, Sparkles, TrendingUp, CheckCircle2, History as HistoryIcon, 
  Stethoscope, Calendar, Clock, Users as UsersIcon, Play, FileText, 
  Coffee, AlertCircle, User
} from 'lucide-react';
import '../styles/DashboardProfissional.css';

export default function DashboardProfissional() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { usuario } = useAuth();

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

  const mudarStatus = async (id, novoStatus) => {
    try {
      await atualizarAgendamento(id, { status: novoStatus });
      carregarResumo();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao mudar status');
    }
  };

  const iniciarAtendimento = async (id) => {
    await mudarStatus(id, 'em_atendimento');
    navigate(`/atendimento/${id}`);
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getStatusBadge = (status) => {
    const map = {
      agendado: { label: 'Agendado', className: 'badge-agendado' },
      confirmado: { label: 'Confirmado', className: 'badge-confirmado' },
      em_espera: { label: 'Em Espera', className: 'badge-espera' },
      em_atendimento: { label: 'Atendendo', className: 'badge-atendimento' },
      concluido: { label: 'Concluído', className: 'badge-concluido' },
      cancelado: { label: 'Cancelado', className: 'badge-cancelado' }
    };
    const config = map[status] || { label: status, className: '' };
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) return <Loading text="Conectando ao VitalPro Hub..." />;

  const total = agendamentos.length;
  const aguardando = agendamentos.filter(a => ['agendado', 'confirmado', 'em_espera'].includes(a.status)).length;
  const atendidos = agendamentos.filter(a => a.status === 'concluido').length;
  const proximo = agendamentos.find(a => ['confirmado', 'em_espera', 'em_atendimento'].includes(a.status));

  const agendamentosAtivos = agendamentos.filter(a => !['cancelado', 'concluido'].includes(a.status));
  const historico = agendamentos.filter(a => ['cancelado', 'concluido'].includes(a.status));

  return (
    <div className="dashboard-profissional fade-in">
      {/* HEADER COM SAUDAÇÃO */}
      <div className="dashboard-header-pro">
        <div className="welcome-section">
          <span className="welcome-badge"><Sparkles size={14} /> Hub de Excelência</span>
          <h1>
            {getSaudacao()}, <span className="highlight-text">{usuario?.nome}</span>
          </h1>
          <p>Você possui <strong>{aguardando}</strong> pacientes aguardando atendimento.</p>
        </div>
        <div className="header-meta">
          <div className="date-badge-premium">
            <Calendar size={16} /> {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS */}
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
          {/* PRÓXIMO PACIENTE */}
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
                    {getStatusBadge(proximo.status)}
                  </div>
                  <button className="btn-start-atendimento" onClick={() => navigate(`/atendimento/${proximo.id}`)}>
                    <Play size={18} /> Iniciar Atendimento
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-featured">
                <Coffee size={40} />
                <p>Nenhum paciente aguardando no momento.</p>
              </div>
            )}
          </div>

          {/* FILA DE HOJE COM AÇÕES */}
          <div className="fila-section">
            <div className="section-title-pro">
              <h3><Clock size={18} /> Fila de Hoje</h3>
              <span className="count-badge-pro">{agendamentosAtivos.length} Pacientes</span>
            </div>

            {agendamentosAtivos.length === 0 ? (
              <div className="empty-fila">
                <Coffee size={36} />
                <h4>Fila Limpa</h4>
                <p>Nenhum paciente aguardando.</p>
              </div>
            ) : (
              <div className="fila-cards">
                {agendamentosAtivos.map(a => (
                  <div key={a.id} className={`fila-card fila-${a.status}`}>
                    <div className="fila-card-top">
                      <span className="fila-time"><Clock size={13} /> {new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      {getStatusBadge(a.status)}
                    </div>
                    <div className="fila-paciente">
                      <User size={18} />
                      <div>
                        <strong>{a.cliente_nome}</strong>
                        <span>{a.servico_nome}</span>
                      </div>
                    </div>
                    <div className="fila-actions">
                      {a.status === 'agendado' && (
                        <button className="fila-btn check" onClick={() => mudarStatus(a.id, 'confirmado')}>
                          <CheckCircle2 size={14} /> Confirmar
                        </button>
                      )}
                      {(a.status === 'confirmado' || a.status === 'agendado') && (
                        <button className="fila-btn wait" onClick={() => mudarStatus(a.id, 'em_espera')}>
                          <AlertCircle size={14} /> Chegou
                        </button>
                      )}
                      {(a.status === 'em_espera' || a.status === 'confirmado') && (
                        <button className="fila-btn primary" onClick={() => iniciarAtendimento(a.id)}>
                          <Play size={14} /> Atender
                        </button>
                      )}
                      {a.status === 'em_atendimento' && (
                        <button className="fila-btn primary" onClick={() => navigate(`/atendimento/${a.id}`)}>
                          <FileText size={14} /> Prontuário
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SHORTCUTS */}
          <div className="shortcuts-grid">
            <Link to="/atendimento" className="shortcut-item-premium">
              <div className="shortcut-icon-box blue"><Clock size={24} /></div>
              <span>Sala de Espera</span>
            </Link>
            <Link to="/agenda" className="shortcut-item-premium">
              <div className="shortcut-icon-box green"><Calendar size={24} /></div>
              <span>Minha Agenda</span>
            </Link>
            <Link to="/clientes" className="shortcut-item-premium">
              <div className="shortcut-icon-box orange"><UsersIcon size={24} /></div>
              <span>Meus Pacientes</span>
            </Link>
          </div>
        </div>

        <div className="right-column">
          {/* HISTÓRICO DO DIA */}
          <div className="side-card glass">
            <h3><HistoryIcon size={18} /> Finalizados Hoje</h3>
            <div className="recent-list">
              {historico.length === 0 ? (
                <p className="empty-text">Nenhum atendimento finalizado.</p>
              ) : (
                historico.map(a => (
                  <div key={a.id} className="recent-item">
                    <div className="recent-time">{new Date(a.data_hora).getHours()}:{new Date(a.data_hora).getMinutes().toString().padStart(2, '0')}</div>
                    <div className="recent-info">
                      <strong>{a.cliente_nome}</strong>
                      <span>{a.servico_nome}</span>
                    </div>
                    <CheckCircle2 size={14} className="success-icon" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
