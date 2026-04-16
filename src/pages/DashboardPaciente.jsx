import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarAgendamentos, buscarHistoricoSaude } from '../services/api';
import Loading from '../components/Loading';
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

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading) return <Loading text="Preparando seu Portal de Saúde..." />;

  const proximaConsulta = agendamentos[0];

  return (
    <div className="dashboard-paciente fade-in">
      <div className="paciente-dashboard-header">
        <div>
          <h1 className="paciente-saudacao">
            {getSaudacao()}, <span className="paciente-nome">{usuario.nome.split(' ')[0]}</span>! ✨
          </h1>
          <p className="paciente-subtitulo">Bem-vindo ao seu VitalHub. Aqui está o resumo da sua saúde.</p>
        </div>
      </div>

      <div className="paciente-dashboard-grid">
        
        {/* COLUNA ESQUERDA: RESUMO E AÇÕES */}
        <div className="paciente-sidebar-col">
          
          {/* CARD PRÓXIMA CONSULTA */}
          <div className="glass-card premium-card animate-slide-up proxima-consulta-card">
            <h3 className="proxima-consulta-title">
              <span>📅</span> Próximo Compromisso
            </h3>
            
            {proximaConsulta ? (
              <div>
                <div className="proxima-consulta-numero">
                  {new Date(proximaConsulta.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="proxima-consulta-label">
                  {new Date(proximaConsulta.data_hora).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                </div>
                <div className="proxima-consulta-details">
                  <div className="proxima-consulta-servico">{proximaConsulta.servico_nome}</div>
                  <div className="proxima-consulta-doctor">Dr(a). {proximaConsulta.profissional_nome}</div>
                </div>
                <button className="btn btn-primary proxima-consulta-button" onClick={() => navigate('/agenda')}>
                  Ver Detalhes
                </button>
              </div>
            ) : (
              <div className="proxima-consulta-empty">
                <p className="proxima-consulta-empty-text">Você não tem consultas agendadas.</p>
                <Link to="/agendar" className="btn btn-primary">Agendar Agora</Link>
              </div>
            )}
          </div>

          {/* ATALHOS RÁPIDOS */}
          <div className="action-cards-grid">
            <Link to="/agendar" className="glass-card action-card">
              <div className="action-card-icon">➕</div>
              <div className="action-card-title">Novo Agendamento</div>
            </Link>
            <Link to="/profissionais" className="glass-card action-card">
              <div className="action-card-icon">👥</div>
              <div className="action-card-title">Corpo Clínico</div>
            </Link>
          </div>
        </div>

        {/* COLUNA DIREITA: HISTÓRICO DE SAÚDE */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span>🩺</span> Histórico de Saúde
             </h3>
             <span className="badge badge-info">{historico.length} documentos</span>
          </div>

          <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {historico.length > 0 ? historico.map((item) => (
              <div key={item.id} className="history-item" style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-400)', fontWeight: '600' }}>
                    {new Date(item.data_hora).toLocaleDateString('pt-BR')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)' }}>{item.servico_nome}</span>
                </div>
                <div style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>Dr(a). {item.profissional_nome}</div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  {item.prescricoes && (
                    <button className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem' }} onClick={() => alert('Visualizando Receita...')}>
                      💊 Ver Receita
                    </button>
                  )}
                  {item.exames && (
                    <button className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem' }} onClick={() => alert('Visualizando Pedido de Exame...')}>
                      🔬 Pedido de Exame
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: 'var(--dark-500)', padding: '3rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
                <p>Nenhum prontuário registrado ainda.</p>
              </div>
            )}
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
