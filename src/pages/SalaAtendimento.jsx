import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarAgendamento, buscarProntuario, salvarProntuario, atualizarAgendamento, buscarHistoricoSaude } from '../services/api';
import Loading from '../components/Loading';
import { generateClinicPDF } from '../utils/pdfGenerator';
import { 
  FileText, 
  Download, 
  Archive, 
  History as HistoryIcon, 
  Stethoscope, 
  Eye, 
  CheckCircle,
  FileSearch,
  User,
  Activity,
  ClipboardList,
  Save,
  CheckCircle2
} from 'lucide-react';
import '../styles/SalaAtendimento.css';

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
    <div className="sala-atendimento-premium fade-in">
      <div className="atendimento-workspace-layout">
        
        {/* SIDEBAR PACIENTE PREMIUM */}
        <aside className="paciente-command-sidebar">
          <div className="paciente-profile-header">
            <div className="avatar-med-premium">
              {agendamento.cliente_nome.charAt(0)}
            </div>
            <div className="status-indicator">
              <div className="pulse-dot"></div>
              <span>Atendimento em Curso</span>
            </div>
            <h2>{agendamento.cliente_nome}</h2>
          </div>

          <div className="paciente-info-grid">
            <div className="info-block">
              <label>Protocolo</label>
              <strong>#{id.toString().padStart(5, '0')}</strong>
            </div>
            <div className="info-block">
              <label>Especialidade</label>
              <strong>{agendamento.servico_nome}</strong>
            </div>
            <div className="info-block">
              <label>Data/Hora</label>
              <strong>{new Date(agendamento.data_hora).toLocaleDateString()} - {new Date(agendamento.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
          </div>

          <div className="atendimento-actions-primary">
            <button className="btn-finish-premium" onClick={handleConcluir} disabled={saving}>
              <CheckCircle2 size={18} /> Finalizar Consulta
            </button>
            <button className="btn-pause-premium" onClick={() => navigate('/atendimento')}>
              Pausar Atendimento
            </button>
          </div>
        </aside>

        {/* WORKSPACE DE COMANDO */}
        <main className="atendimento-command-center">
          <nav className="command-tabs">
            <button className={`tab-btn ${activeTab === 'evolucao' ? 'active' : ''}`} onClick={() => setActiveTab('evolucao')}>
              <Stethoscope size={16} /> <span>Evolução Clínica</span>
            </button>
            <button className={`tab-btn ${activeTab === 'receita' ? 'active' : ''}`} onClick={() => setActiveTab('receita')}>
              <ClipboardList size={16} /> <span>Receituário</span>
            </button>
            <button className={`tab-btn ${activeTab === 'exames' ? 'active' : ''}`} onClick={() => setActiveTab('exames')}>
              <FileText size={16} /> <span>Solicitar Exames</span>
            </button>
            <button className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setActiveTab('historico')}>
              <HistoryIcon size={16} /> <span>Histórico do Paciente</span>
            </button>
          </nav>

          <div className="command-workspace-shell">
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

            <footer className="command-footer">
              <div className="save-status">
                {saving ? <div className="spinner-mini"></div> : <CheckCircle2 size={14} color="var(--primary-500)" />}
                <span>{mensagem || (saving ? 'Sincronizando...' : 'Alterações salvas localmente')}</span>
              </div>
              <button className="btn-save-premium" onClick={handleSalvar} disabled={saving}>
                <Save size={18} /> Salvar Alterações
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
    </div>
  );
}
