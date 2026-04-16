import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarAgendamentos, atualizarAgendamento } from '../services/api';
import Loading from '../components/Loading';
import '../styles/PainelMedico.css';

export default function PainelMedico() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarFila();
  }, []);

  const carregarFila = async () => {
    setLoading(true);
    try {
      // Buscar apenas os agendamentos de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const res = await listarAgendamentos({ data: hoje });
      setAgendamentos(res.data);
    } catch (err) {
      console.error('Erro ao carregar fila:', err);
    } finally {
      setLoading(false);
    }
  };

  const mudarStatus = async (id, novoStatus) => {
    try {
      await atualizarAgendamento(id, { status: novoStatus });
      carregarFila();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao mudar status');
    }
  };

  const iniciarAtendimento = async (id) => {
    await mudarStatus(id, 'em_atendimento');
    navigate(`/atendimento/${id}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'agendado': return <span className="badge badge-agendado">🕐 Agendado</span>;
      case 'confirmado': return <span className="badge badge-confirmado">✅ Confirmado</span>;
      case 'em_espera': return <span className="badge" style={{ background: 'var(--warning)', color: 'black' }}>⏳ Em Espera</span>;
      case 'em_atendimento': return <span className="badge" style={{ background: 'var(--primary-500)', color: 'white' }}>👨‍⚕️ Em Atendimento</span>;
      case 'concluido': return <span className="badge badge-concluido">✔️ Concluído</span>;
      case 'cancelado': return <span className="badge badge-cancelado">❌ Cancelado</span>;
      default: return <span className="badge">Desconhecido</span>;
    }
  };

  // Filtrar e ordenar a fila
  const agendamentosAtivos = agendamentos.filter(a => !['cancelado', 'concluido'].includes(a.status));
  const historico = agendamentos.filter(a => ['cancelado', 'concluido'].includes(a.status));

  if (loading) return <Loading text="Carregando fila de hoje..." />;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>📋 Painel de Atendimento</h1>
        <p>Gerencie sua fila de pacientes de hoje</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* FILA DE ATIVOS */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            Fila de Hoje ({agendamentosAtivos.length})
          </h3>
          
          {agendamentosAtivos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">☕</div>
              <h3>Nenhum paciente na fila no momento</h3>
              <p>Sua agenda de hoje está livre de pendências.</p>
            </div>
          ) : (
            <div className="grid" style={{ gap: '1rem' }}>
              {agendamentosAtivos.map(a => (
                <div key={a.id} className="glass-card" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderLeft: a.status === 'em_espera' ? '4px solid var(--warning)' : 
                              a.status === 'em_atendimento' ? '4px solid var(--primary-500)' : '4px solid transparent'
                }}>
                  <div>
                    <div style={{ color: 'var(--primary-300)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                      {new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500' }}>
                      {a.cliente_nome}
                    </div>
                    <div style={{ color: 'var(--dark-400)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Serviço: {a.servico_nome}
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      {getStatusBadge(a.status)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {a.status === 'agendado' && (
                      <button className="btn btn-sm btn-outline" onClick={() => mudarStatus(a.id, 'confirmado')}>
                        Marcar Confirmado
                      </button>
                    )}
                    {(a.status === 'agendado' || a.status === 'confirmado') && (
                      <button className="btn btn-sm btn-secondary" onClick={() => mudarStatus(a.id, 'em_espera')} style={{ color: 'var(--warning)' }}>
                        Paciente Chegou
                      </button>
                    )}
                    {(a.status === 'em_espera' || a.status === 'confirmado') && (
                      <button className="btn btn-sm btn-primary" onClick={() => iniciarAtendimento(a.id)}>
                        ▶️ Atender
                      </button>
                    )}
                    {a.status === 'em_atendimento' && (
                      <button className="btn btn-sm btn-primary" onClick={() => navigate(`/atendimento/${a.id}`)}>
                        Abrir Prontuário
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HISTORICO/CONCLUIDOS DO DIA */}
        <div className="glass-card">
          <h3 style={{ color: 'var(--dark-300)', marginBottom: '1rem', fontSize: '1rem' }}>
            Finalizados ({historico.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {historico.length === 0 ? (
              <p style={{ color: 'var(--dark-500)', fontSize: '0.85rem' }}>Nenhum atendimento finalizado ainda.</p>
            ) : (
              historico.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ color: 'white', fontSize: '0.9rem' }}>{a.cliente_nome}</div>
                    <div style={{ color: 'var(--dark-500)', fontSize: '0.75rem' }}>{a.servico_nome}</div>
                  </div>
                  <div>
                    {getStatusBadge(a.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
