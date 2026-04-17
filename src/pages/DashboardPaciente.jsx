import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarAgendamentos, buscarHistoricoSaude } from '../services/api';
import Loading from '../components/Loading';
import { Calendar, Heart, Plus, Users, Clock, Clipboard, FileText, Sparkles } from 'lucide-react';
import '../styles/DashboardPaciente.css';

export default function DashboardPaciente() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const usuarioStr = localStorage.getItem('usuario');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : { nome: 'Paciente' };

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [resAgendamentos, resHistorico] = await Promise.all([
        listarAgendamentos({ status: 'agendado,confirmado' }),
        buscarHistoricoSaude()
      ]);
      
      // Filtrar apenas agendamentos futuros
      const hoje = new Date();
      const futuros = resAgendamentos.data.filter(a => new Date(a.data_hora) >= hoje);
      
      setAgendamentos(futuros.slice(0, 3)); // Mostrar os 3 próximos
      setHistorico(resHistorico.data);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProfImage = (nome) => {
    const map = {
      'Dr. Carlos Eduardo': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
      'Dra. Ana Beatrix': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
      'Dr. Ricardo Santos': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
      'Dra. Mariana Luz': 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?w=400&h=400&fit=crop',
      'Dr. Henrique Silva': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
      'Dra. Letícia Costa': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop'
    };
    return map[nome] || `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=15803d&color=fff`;
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading) return <Loading text="Preparando seu Portal de Saúde..." />;

  const proximaConsulta = agendamentos[0];

  return (
    <div className="paciente-portal-container fade-in">
      <div className="paciente-header-premium">
        <div className="greeting-box">
          <div className="welcome-tag"><Sparkles size={14} /> Portal VitalHub</div>
          <h1>{getSaudacao()}, <span className="paciente-name-highlight">{usuario.nome.split(' ')[0]}</span></h1>
          <p>Seu espaço dedicado à saúde e bem-estar.</p>
        </div>
        <div className="header-stats-paciente">
          <div className="stat-unit">
            <span className="stat-val">{historico.length}</span>
            <span className="stat-lab">Registros</span>
          </div>
        </div>
      </div>

      <div className="paciente-main-layout">
        {/* COLUNA ESQUERDA: COMPROMISSOS */}
        <div className="paciente-action-column">
          <div className="glass-card next-appointment-card">
            <div className="card-badge-header">
              <Calendar size={18} />
              <span>Próximo Compromisso</span>
            </div>
            
            {proximaConsulta ? (
              <div className="appointment-details-premium">
                <div className="date-display">
                  <span className="big-time">{new Date(proximaConsulta.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="full-date">{new Date(proximaConsulta.data_hora).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                </div>
                
                <div className="professional-mini-card">
                  <img src={getProfImage(proximaConsulta.profissional_nome)} alt={proximaConsulta.profissional_nome} className="prof-thumb-pac" />
                  <div className="prof-meta">
                    <strong>Dr(a). {proximaConsulta.profissional_nome}</strong>
                    <span>{proximaConsulta.servico_nome}</span>
                  </div>
                </div>

                <button className="btn-appointment-details" onClick={() => navigate('/agenda')}>
                  Gerenciar Agendamento
                </button>
              </div>
            ) : (
              <div className="empty-appointment-box">
                <p>Nenhuma consulta agendada para os próximos dias.</p>
                <Link to="/agendar" className="btn-agendar-hero">
                  <Plus size={18} /> Agendar Nova Consulta
                </Link>
              </div>
            )}
          </div>

          <div className="shortcuts-grid-paciente">
            <Link to="/agendar" className="shortcut-card">
              <div className="shortcut-icon green"><Plus size={24} /></div>
              <span>Agendar</span>
            </Link>
            <Link to="/profissionais" className="shortcut-card">
              <div className="shortcut-icon blue"><Users size={24} /></div>
              <span>Equipe</span>
            </Link>
          </div>
        </div>

        {/* COLUNA DIREITA: HISTÓRICO / PRONTUÁRIOS */}
        <div className="paciente-history-column">
          <div className="glass-card history-card-premium">
            <div className="history-header">
              <h3><Clipboard size={22} /> Linha do Tempo de Saúde</h3>
            </div>

            <div className="timeline-container">
              {historico.length > 0 ? historico.map((item, idx) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="marker-dot"></div>
                    {idx !== historico.length - 1 && <div className="marker-line"></div>}
                  </div>
                  <div className="timeline-content-box">
                    <div className="item-header-pac">
                      <span className="item-date">{new Date(item.data_hora).toLocaleDateString('pt-BR')}</span>
                      <span className="item-service-tag">{item.servico_nome}</span>
                    </div>
                    
                    <div className="item-professional-row">
                      <img src={getProfImage(item.profissional_nome)} alt={item.profissional_nome} className="micro-prof-thumb" />
                      <div className="prof-row-info">
                        <strong>Dr(a). {item.profissional_nome}</strong>
                      </div>
                    </div>

                    <div className="item-actions-pac">
                      {item.prescricoes && (
                        <button className="pac-action-btn"><FileText size={14} /> Receita</button>
                      )}
                      {item.exames && (
                        <button className="pac-action-btn"><Clipboard size={14} /> Exames</button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="empty-history-state">
                  <FileText size={48} className="empty-icon-pac" />
                  <p>Seu histórico de saúde será exibido aqui após sua primeira consulta.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ESTILOS INLINE ADICIONAIS PARA O DASHBOARD */}
      <style>{`
        .action-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-500);
          background: rgba(59, 130, 246, 0.05);
        }
        .history-list::-webkit-scrollbar {
          width: 4px;
        }
        .history-list::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 10px;
        }
        .history-item {
          transition: all 0.2s;
        }
        .history-item:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: var(--primary-400) !important;
        }
      `}</style>
    </div>
  );
}
