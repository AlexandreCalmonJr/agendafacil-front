import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarAgendamento, buscarProntuario, salvarProntuario, atualizarAgendamento, buscarHistoricoSaude } from '../services/api';
import Loading from '../components/Loading';
import { generateClinicPDF } from '../utils/pdfGenerator';
import { 
  FileText, 
  Download, 
  Archive, 
  History, 
  Stethoscope, 
  Eye, 
  CheckCircle,
  FileSearch
} from 'lucide-react';

export default function SalaAtendimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('evolucao');
  const [historicoPaciente, setHistoricoPaciente] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [showExamModal, setShowExamModal] = useState(false);

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

      const resHistorico = await buscarHistoricoSaude(resAgendamento.data.cliente_id);
      setHistoricoPaciente(resHistorico.data);
    } catch (err) {
      console.error('Erro ao carregar dados da sala:', err);
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
      alert('Erro ao salvar prontuário.');
    } finally {
      setSaving(false);
    }
  };

  const handleConcluir = async () => {
    if (window.confirm('Tem certeza que deseja finalizar este atendimento?')) {
      setSaving(true);
      try {
        await salvarProntuario(id, prontuario);
        await atualizarAgendamento(id, { status: 'concluido' });
        navigate('/atendimento');
      } catch (err) {
        alert('Erro ao finalizar atendimento.');
        setSaving(false);
      }
    }
  };

  // Funções para Elite PDF Generator
  const handleDownloadPDF = (tipo) => {
    generateClinicPDF({
      ...agendamento,
      ...prontuario
    }, tipo);
  };

  if (loading || !agendamento) return <Loading text="Conectando à sala segura..." />;

  const dataAgendamento = new Date(agendamento.data_hora);

  return (
    <div className="animate-fade-in sala-atendimento">
      <div className="atendimento-layout">
        
        {/* SIDEBAR PACIENTE (ELITE DESIGN) */}
        <aside className="paciente-sidebar glass-card">
          <div className="paciente-avatar">
            <div className="avatar-circle">
              {agendamento.cliente_nome.charAt(0)}
            </div>
            <h3>{agendamento.cliente_nome}</h3>
            <span className="badge-online">● Em Atendimento</span>
          </div>

          <div className="info-list">
            <div className="info-item">
              <label>Protocolo</label>
              <span>#{id.toString().padStart(5, '0')}</span>
            </div>
            <div className="info-item">
              <label>Especialidade</label>
              <div className="tag">{agendamento.servico_nome}</div>
            </div>
            <div className="info-item">
              <label>Sala Atual</label>
              <span>{agendamento.sala || 'Consultório 01'}</span>
            </div>
          </div>

          <div className="actions-stack">
            <button className="btn btn-primary btn-concluir" onClick={handleConcluir} disabled={saving}>
              <CheckCircle size={20} /> Concluir Consulta
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/atendimento')}>
              Pausar Sessão
            </button>
          </div>
        </aside>

        {/* WORKSPACE PRINCIPAL */}
        <main className="atendimento-main">
          <nav className="tabs-nav glass">
            <button className={activeTab === 'evolucao' ? 'active' : ''} onClick={() => setActiveTab('evolucao')}>
              <Stethoscope size={18} /> Evolução
            </button>
            <button className={activeTab === 'receita' ? 'active' : ''} onClick={() => setActiveTab('receita')}>
              <FileText size={18} /> Receituário
            </button>
            <button className={activeTab === 'exames' ? 'active' : ''} onClick={() => setActiveTab('exames')}>
              <Download size={18} /> Exames
            </button>
            <button className={activeTab === 'historico' ? 'active' : ''} onClick={() => setActiveTab('historico')}>
              <History size={18} /> Prontuário 360º
            </button>
          </nav>

          <div className="workspace-content glass-card">
            {activeTab === 'evolucao' && (
              <div className="editor-container fade-in">
                <div className="editor-header">
                  <h3>Anotações Clínicas (SOAP)</h3>
                  <span className="auto-save">{saving ? 'Salvando...' : 'Anotações seguras'}</span>
                </div>
                <textarea
                  name="notas_clinicas"
                  value={prontuario.notas_clinicas}
                  onChange={handleProntuarioChange}
                  className="atendimento-textarea"
                  placeholder="S: Paciente refere...&#10;O: Exame físico demonstra...&#10;A: Hipótese diagnóstica...&#10;P: Conduta sugerida..."
                ></textarea>
              </div>
            )}

            {activeTab === 'receita' && (
              <div className="editor-container fade-in">
                <div className="editor-header">
                  <h3>Prescrição Digital</h3>
                  <button className="btn-elite-action" onClick={() => handleDownloadPDF('RECEITA')}>
                    <Download size={16} /> Baixar PDF Oficial
                  </button>
                </div>
                <textarea
                  name="prescricoes"
                  value={prontuario.prescricoes}
                  onChange={handleProntuarioChange}
                  className="atendimento-textarea prescription-style"
                  placeholder="1. Medicamento X --------- 1 caixa&#10;Tomar via oral 1 vez ao dia."
                ></textarea>
              </div>
            )}

            {activeTab === 'exames' && (
              <div className="editor-container fade-in">
                <div className="editor-header">
                  <h3>Solicitações de Exames</h3>
                  <button className="btn-elite-action" onClick={() => handleDownloadPDF('EXAMES')}>
                    <Download size={16} /> Gerar PDF do Pedido
                  </button>
                </div>
                <textarea
                  name="exames"
                  value={prontuario.exames}
                  onChange={handleProntuarioChange}
                  className="atendimento-textarea"
                  placeholder="Solicito:&#10;- Hemograma&#10;- Glicemia"
                ></textarea>
                
                <div className="quick-exam-viewer glass">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-badge"><Archive size={20} /></div>
                    <div>
                      <strong>Exames Anexados pelo Paciente</strong>
                      <p style={{ margin: 0, opacity: 0.6, fontSize: '0.8rem' }}>Arquivos disponíveis para visualização 360º</p>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline" onClick={() => setShowExamModal(true)}>
                    <Eye size={16} /> Abrir Visualizador
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="historico-container fade-in">
                <div className="historico-header">
                  <h3>Linha do Tempo Clínica</h3>
                  <p>Mergulho completo no histórico do paciente</p>
                </div>
                <div className="timeline">
                  {historicoPaciente.length > 0 ? historicoPaciente.map(h => (
                    <div key={h.id} className="timeline-item glass">
                      <div className="timeline-date">{new Date(h.data_hora).toLocaleDateString()}</div>
                      <div className="timeline-content">
                        <strong>{h.servico_nome} | Dr(a). {h.profissional_nome}</strong>
                        <p>{h.notas_clinicas || 'Sem notas.'}</p>
                        <div className="mini-badges">
                          {h.prescricoes && <span>💊 Medicamentos</span>}
                          {h.exames && <span>🔬 Exames</span>}
                        </div>
                      </div>
                    </div>
                  )) : <p className="empty">Nenhum histórico anterior encontrado.</p>}
                </div>
              </div>
            )}

            <footer className="workspace-footer">
              <span className="status-msg">{mensagem}</span>
              <button className="btn btn-primary" onClick={handleSalvar} disabled={saving}>
                <Download size={18} /> Salvar Rascunho
              </button>
            </footer>
          </div>
        </main>
      </div>

      {/* MODAL SIMULADO DE EXAMES (FEATURE 5) */}
      {showExamModal && (
        <div className="exam-modal-overlay" onClick={() => setShowExamModal(false)}>
          <div className="exam-modal" onClick={e => e.stopPropagation()}>
            <header>
              <h3><FileSearch size={22} /> Visualizador de Exames VitalPro</h3>
              <button onClick={() => setShowExamModal(false)}>×</button>
            </header>
            <div className="exam-body">
              <div className="exam-file-sim">
                <header>Ressonância Magnética_Abdomen.pdf</header>
                <div className="sim-viewer">
                  <p>📄 [ SIMULAÇÃO DE VISUALIZAÇÃO DE EXAMES ]</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Imagens DICOM e Laudos em Alta Resolução</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sala-atendimento { padding: 2rem; background: #0f172a; min-height: 100vh; }
        .atendimento-layout { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; max-width: 1600px; margin: 0 auto; }
        
        .paciente-sidebar { height: fit-content; position: sticky; top: 2rem; padding: 2rem; }
        .paciente-avatar { text-align: center; margin-bottom: 2rem; }
        .avatar-circle { width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #d946ef); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: white; margin: 0 auto 1rem; }
        .badge-online { font-size: 0.75rem; color: #10b981; font-weight: 600; display: block; margin-top: 0.5rem; }
        
        .info-list { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2.5rem; }
        .info-item label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 0.25rem; }
        .info-item span { font-weight: 600; color: #f1f5f9; }
        .tag { display: inline-block; padding: 4px 10px; background: rgba(139, 92, 246, 0.2); color: #c4b5fd; border-radius: 6px; font-size: 0.85rem; font-weight: 500; }
        
        .actions-stack { display: flex; flex-direction: column; gap: 1rem; }
        .btn-concluir { background: linear-gradient(135deg, #8b5cf6, #7c3aed); display: flex; align-items: center; gap: 0.5rem; justify-content: center; padding: 1rem; }
        
        .atendimento-main { display: flex; flex-direction: column; gap: 1rem; }
        .tabs-nav { display: flex; padding: 0.5rem; border-radius: 16px; gap: 0.5rem; }
        .tabs-nav button { flex: 1; padding: 1rem; background: transparent; border: none; color: #94a3b8; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; justify-content: center; font-weight: 500; transition: 0.3s; }
        .tabs-nav button:hover { background: rgba(255, 255, 255, 0.05); color: white; }
        .tabs-nav button.active { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; box-shadow: inset 0 0 0 1px rgba(139, 92, 246, 0.3); }
        
        .workspace-content { padding: 0; min-height: 600px; display: flex; flex-direction: column; }
        .editor-container { padding: 2rem; flex: 1; display: flex; flex-direction: column; }
        .editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .auto-save { font-size: 0.8rem; color: #64748b; font-style: italic; }
        
        .atendimento-textarea { width: 100%; flex: 1; background: rgba(15, 23, 42, 0.3); border: 1px solid rgba(139, 92, 246, 0.1); border-radius: 12px; padding: 1.5rem; color: #f1f5f9; font-size: 1.1rem; line-height: 1.6; resize: none; min-height: 400px; }
        .atendimento-textarea:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1); }
        .prescription-style { font-family: 'Courier New', Courier, monospace; background: rgba(255, 255, 255, 0.02); }
        
        .btn-elite-action { background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .btn-elite-action:hover { background: #7c3aed; transform: translateY(-1px); }
        
        .quick-exam-viewer { margin-top: 2rem; padding: 1.5rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .icon-badge { width: 40px; height: 40px; background: #8b5cf6; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        
        .workspace-footer { padding: 1.5rem 2rem; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(255, 255, 255, 0.01); }
        
        .historico-container { padding: 2rem; }
        .timeline { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
        .timeline-item { padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8b5cf6; }
        .timeline-date { font-size: 0.8rem; color: #8b5cf6; font-weight: 700; margin-bottom: 0.5rem; }
        .mini-badges { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .mini-badges span { font-size: 0.7rem; background: rgba(255, 255, 255, 0.05); padding: 4px 8px; border-radius: 4px; }
        
        .exam-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .exam-modal { width: 90%; max-width: 1000px; height: 80vh; background: #1e293b; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,1); display: flex; flex-direction: column; overflow: hidden; }
        .exam-modal header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; color: white; }
        .exam-modal header button { background: transparent; border: none; color: #94a3b8; font-size: 2rem; cursor: pointer; }
        .exam-body { padding: 2rem; flex: 1; display: flex; align-items: center; justify-content: center; }
        .exam-file-sim { width: 100%; max-width: 600px; height: 400px; background: white; border-radius: 8px; color: #0f172a; display: flex; flex-direction: column; }
        .exam-file-sim header { background: #334155; color: white; padding: 0.75rem; font-size: 0.9rem; }
        .sim-viewer { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
      `}</style>
    </div>
  );
}
