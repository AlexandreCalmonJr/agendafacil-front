import { useState, useEffect } from 'react';
import { listarProfissionais, listarServicos, criarAgendamento, listarClientes, buscarDisponibilidade } from '../services/api';
import Toast from './Toast';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Stethoscope, 
  Clock, 
  Video, 
  Building2,
  Sparkles,
  Info
} from 'lucide-react';
import '../styles/FormAgendamento.css';

export default function FormAgendamento({ onSuccess, onCancel, prefill }) {
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
  const isAdminOrRecepcao = ['admin', 'recepcionista'].includes(usuarioLocal?.perfil);

  const [step, setStep] = useState(0);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const [form, setForm] = useState({
    cliente_id: isAdminOrRecepcao ? '' : (usuarioLocal?.cliente_id || 1),
    profissional_id: prefill?.profissional_id ? String(prefill.profissional_id) : '',
    servico_id: prefill?.servico_id ? String(prefill.servico_id) : '',
    data: '',
    hora: '',
    observacoes: prefill?.observacoes || '',
    modalidade: prefill?.modalidade || 'presencial'
  });

  const [especialidadeFiltro, setEspecialidadeFiltro] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  useEffect(() => {
    carregarProfissionais();
    if (isAdminOrRecepcao) carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const res = await listarClientes();
      setClientes(res.data);
    } catch {
      console.error('Erro ao listar clientes');
    }
  };

  useEffect(() => {
    if (form.profissional_id) {
      carregarServicos(form.profissional_id);
      if (!prefill?.servico_id) {
        setForm(prev => ({ ...prev, servico_id: '', data: '', hora: '' }));
      } else {
        setForm(prev => ({ ...prev, data: '', hora: '' }));
      }
      setHorariosOcupados([]);
    }
  }, [form.profissional_id]);

  useEffect(() => {
    if (form.data && form.profissional_id) {
      carregarHorariosOcupados();
    }
  }, [form.data, form.profissional_id]);

  const carregarHorariosOcupados = async () => {
    try {
      const res = await buscarDisponibilidade({
        data: form.data,
        profissional_id: form.profissional_id
      });
      setHorariosOcupados(res.data.map(h => h.hora));
    } catch (err) {
      console.error('Erro ao carregar horários ocupados');
    }
  };

  const carregarProfissionais = async () => {
    try {
      const res = await listarProfissionais();
      setProfissionais(res.data);
    } catch (err) {
      setErro('Erro ao carregar profissionais');
    }
  };

  const carregarServicos = async (profId) => {
    try {
      const res = await listarServicos(profId);
      setServicos(res.data);
    } catch (err) {
      setErro('Erro ao carregar serviços');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErro('');
  };

  const nextStep = () => {
    if (step === 0 && isAdminOrRecepcao && !form.cliente_id) {
      setErro('Selecione um paciente');
      return;
    }
    if (step === 0 && !isAdminOrRecepcao && !form.profissional_id) {
      setErro('Selecione um profissional');
      return;
    }
    if (step === 0 && isAdminOrRecepcao && !form.profissional_id) {
      setErro('Selecione um profissional');
      return;
    }
    if (step === 0 && !form.servico_id) {
      setErro('Selecione um serviço');
      return;
    }
    if (step === 1 && (!form.data || !form.hora)) {
      setErro('Selecione data e hora');
      return;
    }
    setErro('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const data_hora = `${form.data}T${form.hora}:00`;

      await criarAgendamento({
        cliente_id: parseInt(form.cliente_id),
        profissional_id: parseInt(form.profissional_id),
        servico_id: parseInt(form.servico_id),
        data_hora,
        observacoes: form.observacoes,
        modalidade: form.modalidade
      });

      setToast({ message: 'Agendamento criado com sucesso!', type: 'success' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const selectedProf = profissionais.find(p => p.id === parseInt(form.profissional_id));
  const selectedServico = servicos.find(s => s.id === parseInt(form.servico_id));

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

  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const especialidadesUnicas = [...new Set(profissionais.map(p => p.especialidade))];
  
  const profissionaisFiltrados = profissionais.filter(p => 
    !especialidadeFiltro || p.especialidade === especialidadeFiltro
  );

  const totalSteps = 3;

  const steps = isAdminOrRecepcao
    ? [{ num: 0, label: 'Paciente & Profissional' }, { num: 1, label: 'Data & Hora' }, { num: 2, label: 'Confirmar' }]
    : [{ num: 0, label: 'Profissional & Serviço' }, { num: 1, label: 'Data & Hora' }, { num: 2, label: 'Confirmar' }];

  return (
    <form onSubmit={handleSubmit}>
      <div className="wizard-steps-container">
        {steps.map((s, idx) => (
          <div key={s.num} className={`wizard-step-unit ${step >= s.num ? 'active' : ''}`}>
            <div className="step-circle">
              {step > s.num ? <Check size={16} /> : s.num + 1}
            </div>
            <span className="step-label">{s.label}</span>
            {idx < steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      {erro && <div className="alert alert-error"><Info size={14} /> {erro}</div>}

      {toast.message && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ message: '', type: 'success' })} 
        />
      )}

      {/* STEP 0: Profissional + Serviço (paciente selector para admin no topo) */}
      {step === 0 && (
        <div className="wizard-content-step fade-in">
          {isAdminOrRecepcao && (
            <div className="patient-selector-section">
              <label className="form-label">Paciente</label>
              <input 
                type="text" 
                placeholder="Buscar paciente por nome..."
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                className="form-input"
              />
              <div className="patient-chips-row">
                {clientes.filter(c => c.nome?.toLowerCase().includes(buscaCliente.toLowerCase())).slice(0, 6).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={`patient-chip ${form.cliente_id === String(c.id) ? 'selected' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, cliente_id: String(c.id) }))}
                  >
                    {c.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="step-options-header">
            <h3>Selecione o Profissional</h3>
            <select 
              className="premium-select-filter" 
              value={especialidadeFiltro}
              onChange={(e) => setEspecialidadeFiltro(e.target.value)}
            >
              <option value="">Todas Especialidades</option>
              {especialidadesUnicas.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          
          <div className="professional-selection-grid">
            {profissionaisFiltrados.map(prof => (
              <label key={prof.id} className={`prof-selection-card ${form.profissional_id === String(prof.id) ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="profissional_id"
                  value={prof.id}
                  checked={form.profissional_id === String(prof.id)}
                  onChange={handleChange}
                />
                <img src={getProfImage(prof.nome)} alt={prof.nome} className="prof-selection-img" />
                <div className="prof-selection-info">
                  <strong>{prof.nome}</strong>
                  <span>{prof.especialidade}</span>
                </div>
                {form.profissional_id === String(prof.id) && <div className="selected-indicator"><Check size={14} /></div>}
              </label>
            ))}
          </div>

          {form.profissional_id && servicos.length > 0 && (
            <>
              <div className="step-options-header" style={{ marginTop: '1.5rem' }}>
                <h3>Escolha o Serviço</h3>
                <span className="selected-sub">com {selectedProf?.nome}</span>
              </div>
              <div className="service-selection-grid">
                {servicos.map(serv => (
                  <label key={serv.id} className={`service-selection-card ${form.servico_id === String(serv.id) ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="servico_id"
                      value={serv.id}
                      checked={form.servico_id === String(serv.id)}
                      onChange={handleChange}
                    />
                    <div className="service-main-row">
                      <div className="service-meta">
                        <strong>{serv.nome}</strong>
                        <p>{serv.descricao || 'Consulta de rotina com especialista.'}</p>
                        <div className="service-duration"><Clock size={12} /> {serv.duracao_minutos} minutos</div>
                      </div>
                      <div className="service-price">R$ {Number(serv.preco).toFixed(2)}</div>
                    </div>
                    {form.servico_id === String(serv.id) && <div className="selected-indicator"><Check size={14} /></div>}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 1: Data/Hora + Modalidade */}
      {step === 1 && (
        <div className="wizard-content-step fade-in">
          <div className="step-options-header">
            <h3>Data e Horário</h3>
          </div>

          <div className="modality-selector-premium">
            <button 
              type="button" 
              className={`modality-btn ${form.modalidade === 'presencial' ? 'active' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, modalidade: 'presencial' }))}
            >
              <Building2 size={20} />
              <div>
                <strong>Presencial</strong>
                <span>Na clínica física</span>
              </div>
            </button>
            <button 
              type="button" 
              className={`modality-btn ${form.modalidade === 'teleconsulta' ? 'active' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, modalidade: 'teleconsulta' }))}
            >
              <Video size={20} />
              <div>
                <strong>Teleconsulta</strong>
                <span>Vídeo chamada</span>
              </div>
            </button>
          </div>

          <div className="scheduling-grid-premium">
            <div className="date-picker-side">
              <label>Selecione o Dia</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="premium-date-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="time-picker-side">
              <label>Horários {form.data ? 'Disponíveis' : '(selecione a data primeiro)'}</label>
              <div className="premium-time-grid">
                {horariosDisponiveis.map(h => {
                  const ocupado = horariosOcupados.includes(h);
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={ocupado || !form.data}
                      onClick={() => setForm(prev => ({ ...prev, hora: h }))}
                      className={`time-chip ${form.hora === h ? 'selected' : ''} ${ocupado ? 'occupied' : ''}`}
                      title={ocupado ? 'Horário já reservado' : `Agendar às ${h}`}
                    >
                      {h}
                      {ocupado && <span className="time-chip-occupied-label">Ocupado</span>}
                    </button>
                  );
                })}
              </div>
              {form.data && horariosOcupados.length > 0 && (
                <p className="time-hint">
                  <span className="time-hint-dot"></span>
                  Horários destacados já estão ocupados
                </p>
              )}
            </div>
          </div>
          
          <div className="form-group-premium">
            <label className="form-label">Observações (opcional)</label>
            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              className="premium-textarea"
              placeholder="Alguma informação adicional para o médico..."
            />
          </div>
        </div>
      )}

      {/* STEP 2: Confirmação */}
      {step === 2 && (
        <div className="wizard-content-step fade-in">
          <div className="step-options-header">
            <h3>Confirmação Final</h3>
          </div>

          <div className="summary-ticket-premium">
            <div className="ticket-header">
              <Sparkles size={20} />
              <span>Resumo do Agendamento</span>
            </div>
            
            <div className="ticket-body">
              <div className="ticket-row">
                <div className="ticket-info-unit">
                  <label>Especialista</label>
                  <div className="val-box">
                    <img src={getProfImage(selectedProf?.nome)} alt="" className="mini-prof" />
                    <strong>{selectedProf?.nome}</strong>
                  </div>
                </div>
              </div>
              <div className="ticket-row split">
                <div className="ticket-info-unit">
                  <label>Serviço</label>
                  <span>{selectedServico?.nome}</span>
                </div>
                <div className="ticket-info-unit">
                  <label>Modalidade</label>
                  <span>{form.modalidade === 'teleconsulta' ? 'Vídeo Chamada' : 'Presencial'}</span>
                </div>
              </div>
              <div className="ticket-row split">
                <div className="ticket-info-unit">
                  <label>Data</label>
                  <span>{form.data ? new Date(form.data + 'T00:00:00').toLocaleDateString('pt-BR') : '--'}</span>
                </div>
                <div className="ticket-info-unit">
                  <label>Horário</label>
                  <span>{form.hora}</span>
                </div>
              </div>
              <div className="ticket-divider"></div>
              <div className="ticket-footer">
                <div className="total-label">Total a pagar</div>
                <div className="total-val">R$ {selectedServico ? Number(selectedServico.preco).toFixed(2) : '0.00'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="wizard-navigation">
        <div className="nav-left">
          {step > 0 && (
            <button type="button" className="btn-wizard prev" onClick={prevStep}>
              <ChevronLeft size={18} /> Voltar
            </button>
          )}
          {onCancel && step === 0 && (
            <button type="button" className="btn-wizard cancel" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
        <div className="nav-right">
          {step < 2 ? (
            <button type="button" className="btn-wizard next primary" onClick={nextStep}>
              Próximo <ChevronRight size={18} />
            </button>
          ) : (
            <button type="submit" className="btn-wizard finish success" disabled={loading}>
              {loading ? 'Processando...' : 'Finalizar Agendamento'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
