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
  FileSearch
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
              <HistoryIcon size={18} /> Prontuário 360º
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
    </div>
  );
}
