import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listarAgendamentos } from '../services/api';
import Loading from '../components/Loading';

export default function DashboardProfissional() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const usuarioStr = localStorage.getItem('usuario');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : { nome: 'Doutor(a)' };

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

  if (loading) return <Loading text="Entrando no VitalPro Hub..." />;

  // Métricas do dia
  const total = agendamentos.length;
  const aguardando = agendamentos.filter(a => ['agendado', 'confirmado', 'em_espera'].includes(a.status)).length;
  const atendidos = agendamentos.filter(a => a.status === 'concluido').length;
  const proximo = agendamentos.find(a => ['confirmado', 'em_espera'].includes(a.status));

  return (
    <div className="dashboard-profissional fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {getSaudacao()}, <span style={{ color: 'var(--primary-400)' }}>{usuario.nome.toLowerCase().startsWith('dr') ? usuario.nome.split(' ')[0] : `Dr(a). ${usuario.nome.split(' ')[0]}`}</span> 🩺
          </h1>
          <p style={{ color: 'var(--dark-400)' }}>Você tem {aguardando} {aguardando === 1 ? 'paciente' : 'pacientes'} aguardando atendimento hoje.</p>
        </div>
        <div className="date-badge" style={{ padding: '0.5rem 1rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
          📅 {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS */}
      <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
          <span className="stat-label">Total do Dia</span>
          <div className="stat-value">{total}</div>
        </div>
        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <span className="stat-label">Restantes</span>
          <div className="stat-value">{aguardando}</div>
        </div>
        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <span className="stat-label">Finalizados</span>
          <div className="stat-value">{atendidos}</div>
        </div>
        <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-500)' }}>
          <span className="stat-label">Desempenho</span>
          <div className="stat-value">{total > 0 ? Math.round((atendidos / total) * 100) : 0}%</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(400px, 2fr) 1fr', gap: '2rem' }}>
        
        {/* COLUNA ESQUERDA: PRÓXIMO PACIENTE E ATALHOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* CARD DE PRÓXIMO PACIENTE EM DESTAQUE */}
          <div className="glass-card premium-card" style={{ 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ animation: 'pulse 2s infinite' }}>🔵</span> Próximo Paciente
            </h3>
            
            {proximo ? (
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: 'var(--radius-xl)', 
                  background: 'var(--primary-600)', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', fontSize: '2.5rem', color: 'white',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  👤
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{proximo.cliente_nome}</div>
                  <div style={{ color: 'var(--dark-400)', marginBottom: '1rem' }}>Sessão de {proximo.servico_nome}</div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => navigate(`/atendimento/${proximo.id}`)}>
                      Iniciar Atendimento Now
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/atendimento')}>
                      Fila Completa
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--primary-400)', fontSize: '1.5rem', fontWeight: '800' }}>
                    {new Date(proximo.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className="badge badge-confirmado">Confirmado</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <p style={{ color: 'var(--dark-500)' }}>Nenhum paciente aguardando no momento.</p>
              </div>
            )}
          </div>

          {/* GRID DE ACESSOS RÁPIDOS */}
          <div className="grid grid-3">
            <Link to="/atendimento" className="glass-card action-card" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚶‍♂️</div>
              <div style={{ fontWeight: '600', color: 'white' }}>Fila de Hoje</div>
            </Link>
            <Link to="/agenda" className="glass-card action-card" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
              <div style={{ fontWeight: '600', color: 'white' }}>Minha Agenda</div>
            </Link>
            <Link to="/clientes" className="glass-card action-card" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
              <div style={{ fontWeight: '600', color: 'white' }}>Meus Pacientes</div>
            </Link>
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO DA AGENDA */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
           <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <span>📋</span> Últimas Finalizadas
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {agendamentos.filter(a => a.status === 'concluido').slice(0, 5).map(a => (
               <div key={a.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                 <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{a.cliente_nome}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--dark-500)', display: 'flex', justifyContent: 'space-between' }}>
                   <span>{a.servico_nome}</span>
                   <span>{new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
               </div>
             ))}
             {atendidos === 0 && <p style={{ color: 'var(--dark-500)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>Nada finalizado ainda.</p>}
           </div>
        </div>

      </div>

      <style>{`
        .stat-card { padding: 1.25rem; }
        .stat-label { font-size: 0.8rem; color: var(--dark-500); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .stat-value { font-size: 2rem; font-weight: 800; color: white; margin-top: 0.25rem; }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
