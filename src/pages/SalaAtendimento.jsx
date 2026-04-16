import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarAgendamento, buscarProntuario, salvarProntuario, atualizarAgendamento } from '../services/api';
import Loading from '../components/Loading';

export default function SalaAtendimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('evolucao'); // evolucao | receita | exames
  const [mensagem, setMensagem] = useState('');

  const [prontuario, setProntuario] = useState({
    notas_clinicas: '',
    prescricoes: '',
    exames: ''
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const resAgendamento = await buscarAgendamento(id);
      setAgendamento(resAgendamento.data);

      const resProntuario = await buscarProntuario(id);
      if (resProntuario.data) {
        setProntuario({
          notas_clinicas: resProntuario.data.notas_clinicas || '',
          prescricoes: resProntuario.data.prescricoes || '',
          exames: resProntuario.data.exames || ''
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dados da sala:', err);
      alert('Erro ao carregar os dados. Verifique a conexão.');
      navigate('/atendimento');
    } finally {
      setLoading(false);
    }
  };

  const handleProntuarioChange = (e) => {
    const { name, value } = e.target;
    setProntuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async () => {
    setSaving(true);
    setMensagem('');
    try {
      await salvarProntuario(id, prontuario);
      setMensagem('✅ Salvo com sucesso!');
      setTimeout(() => setMensagem(''), 3000);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao salvar prontuário.');
    } finally {
      setSaving(false);
    }
  };

  const handleConcluir = async () => {
    if (window.confirm('Tem certeza que deseja finalizar este atendimento? Não será possível editar a evolução depois.')) {
      setSaving(true);
      try {
        await salvarProntuario(id, prontuario); // Salva uma última vez
        await atualizarAgendamento(id, { status: 'concluido' });
        navigate('/atendimento');
      } catch (err) {
        alert('Erro ao finalizar atendimento.');
        setSaving(false);
      }
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  if (loading || !agendamento) return <Loading text="Entrando na sala de atendimento..." />;

  const dataAgendamento = new Date(agendamento.data_hora);

  return (
    <div className="animate-fade-in print-wrapper">
      {/* Header / Sidebar com dados do paciente */}
      <div className="grid print-hide" style={{ gridTemplateColumns: '1fr 3fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* SIDEBAR PACIENTE */}
        <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-500), var(--violet-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', color: 'white'
            }}>
              👤
            </div>
            <h3 style={{ color: 'white' }}>{agendamento.cliente_nome}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Data e Hora</span>
              <div style={{ color: 'var(--dark-200)', fontWeight: '500' }}>
                {dataAgendamento.toLocaleDateString('pt-BR')} às {dataAgendamento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Serviço</span>
              <div style={{ color: 'var(--accent-400)', fontWeight: '500' }}>{agendamento.servico_nome}</div>
            </div>
            {agendamento.observacoes && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Motivo / Observação</span>
                <div style={{ color: 'var(--dark-300)', fontStyle: 'italic', fontSize: '0.9rem' }}>"{agendamento.observacoes}"</div>
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '0.5rem' }} onClick={handleConcluir} disabled={saving}>
            {saving ? '⏳ Aguarde...' : '✅ Concluir Consulta'}
          </button>
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/atendimento')} disabled={saving}>
            Sair (Pausar)
          </button>
        </div>

        {/* WORKSPACE PRONTUÁRIO */}
        <div>
          <div className="glass-card" style={{ padding: '0' }}>
            {/* TABS */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
              <button 
                onClick={() => setActiveTab('evolucao')}
                style={{
                  flex: 1, padding: '1rem', background: 'transparent', border: 'none', color: activeTab === 'evolucao' ? 'var(--primary-400)' : 'var(--dark-400)',
                  fontWeight: activeTab === 'evolucao' ? 'bold' : 'normal', borderBottom: activeTab === 'evolucao' ? '2px solid var(--primary-500)' : '2px solid transparent', cursor: 'pointer'
                }}>
                📝 Evolução Clínica
              </button>
              <button 
                onClick={() => setActiveTab('receita')}
                style={{
                  flex: 1, padding: '1rem', background: 'transparent', border: 'none', color: activeTab === 'receita' ? 'var(--primary-400)' : 'var(--dark-400)',
                  fontWeight: activeTab === 'receita' ? 'bold' : 'normal', borderBottom: activeTab === 'receita' ? '2px solid var(--primary-500)' : '2px solid transparent', cursor: 'pointer'
                }}>
                💊 Receituário
              </button>
              <button 
                onClick={() => setActiveTab('exames')}
                style={{
                  flex: 1, padding: '1rem', background: 'transparent', border: 'none', color: activeTab === 'exames' ? 'var(--primary-400)' : 'var(--dark-400)',
                  fontWeight: activeTab === 'exames' ? 'bold' : 'normal', borderBottom: activeTab === 'exames' ? '2px solid var(--primary-500)' : '2px solid transparent', cursor: 'pointer'
                }}>
                🔬 Pedido de Exames
              </button>
            </div>

            {/* CONTENT */}
            <div style={{ padding: '2rem' }}>
              {activeTab === 'evolucao' && (
                <div className="animate-fade-in">
                  <h3 style={{ color: 'white', marginBottom: '1rem' }}>Anotações da Consulta</h3>
                  <textarea
                    name="notas_clinicas"
                    value={prontuario.notas_clinicas}
                    onChange={handleProntuarioChange}
                    className="form-textarea"
                    placeholder="Subjetivo, Objetivo, Avaliação, Plano (SOAP)..."
                    style={{ minHeight: '350px', fontSize: '1rem', lineHeight: '1.5' }}
                  ></textarea>
                </div>
              )}

              {activeTab === 'receita' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'white' }}>Receituário Médico</h3>
                    <button className="btn btn-sm btn-outline" onClick={handleImprimir}>🖨️ Imprimir Receita</button>
                  </div>
                  <div className="print-area">
                    {/* Cabeçalho de impressão (oculto na tela normal) */}
                    <div className="print-only" style={{ display: 'none', textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid black', paddingBottom: '1rem' }}>
                      <h2 style={{ color: 'black' }}>CLÍNICA VITA</h2>
                      <p style={{ color: 'black', margin: 0 }}>Profissional: {agendamento.profissional_nome}</p>
                      <br/>
                      <h3 style={{ color: 'black' }}>Receituário</h3>
                      <p style={{ color: 'black', margin: 0 }}>Paciente: <b>{agendamento.cliente_nome}</b></p>
                      <p style={{ color: 'black', margin: 0 }}>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                    <textarea
                      name="prescricoes"
                      value={prontuario.prescricoes}
                      onChange={handleProntuarioChange}
                      className="form-textarea"
                      placeholder="Uso interno:&#10;1. Medicamento X 500mg ------ 1 caixa&#10;Tomar 1 comprimido de 8 em 8 horas por 7 dias."
                      style={{ minHeight: '350px', fontSize: '1.1rem', lineHeight: '1.6' }}
                    ></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'exames' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'white' }}>Solicitação de Exames</h3>
                    <button className="btn btn-sm btn-outline" onClick={handleImprimir}>🖨️ Imprimir Pedido</button>
                  </div>
                  <div className="print-area">
                    <div className="print-only" style={{ display: 'none', textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid black', paddingBottom: '1rem' }}>
                      <h2 style={{ color: 'black' }}>CLÍNICA VITA</h2>
                      <p style={{ color: 'black', margin: 0 }}>Profissional: {agendamento.profissional_nome}</p>
                      <br/>
                      <h3 style={{ color: 'black' }}>Pedido de Exames</h3>
                      <p style={{ color: 'black', margin: 0 }}>Paciente: <b>{agendamento.cliente_nome}</b></p>
                      <p style={{ color: 'black', margin: 0 }}>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                    <textarea
                      name="exames"
                      value={prontuario.exames}
                      onChange={handleProntuarioChange}
                      className="form-textarea"
                      placeholder="Solicito:&#10;1. Hemograma Completo&#10;2. Glicemia de jejum&#10;Justificativa: Checkup anual."
                      style={{ minHeight: '350px', fontSize: '1.1rem', lineHeight: '1.6' }}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* ACTION BAR INFERIOR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--success)', fontWeight: '500', minWidth: '150px' }}>{mensagem}</span>
                <button className="btn btn-primary" onClick={handleSalvar} disabled={saving}>
                  💾 Salvar Rascunho
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          .print-wrapper, .print-wrapper .print-area, .print-wrapper .print-area * {
            visibility: visible;
          }
          .print-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-hide {
            display: none !important;
          }
          .form-textarea {
            border: none;
            resize: none;
            overflow: hidden;
            height: auto;
          }
          .print-only {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
