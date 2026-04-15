import { useState, useEffect } from 'react';
import { listarProfissionais, listarServicos, criarAgendamento } from '../services/api';

export default function FormAgendamento({ onSuccess, onCancel }) {
  const [step, setStep] = useState(1);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [form, setForm] = useState({
    profissional_id: '',
    servico_id: '',
    data: '',
    hora: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarProfissionais();
  }, []);

  useEffect(() => {
    if (form.profissional_id) {
      carregarServicos(form.profissional_id);
    }
  }, [form.profissional_id]);

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
    if (step === 1 && !form.profissional_id) {
      setErro('Selecione um profissional');
      return;
    }
    if (step === 2 && !form.servico_id) {
      setErro('Selecione um serviço');
      return;
    }
    if (step === 3 && (!form.data || !form.hora)) {
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
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const data_hora = `${form.data}T${form.hora}:00`;

      await criarAgendamento({
        cliente_id: usuario.cliente_id || 1,
        profissional_id: parseInt(form.profissional_id),
        servico_id: parseInt(form.servico_id),
        data_hora,
        observacoes: form.observacoes
      });

      setSucesso('Agendamento criado com sucesso!');
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

  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Steps indicator
  const steps = [
    { num: 1, label: 'Profissional' },
    { num: 2, label: 'Serviço' },
    { num: 3, label: 'Data/Hora' },
    { num: 4, label: 'Confirmar' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        {steps.map((s) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: '700',
              background: step >= s.num
                ? 'linear-gradient(135deg, var(--primary-600), var(--violet-600))'
                : 'var(--glass-bg)',
              color: step >= s.num ? 'white' : 'var(--dark-500)',
              border: `1px solid ${step >= s.num ? 'transparent' : 'var(--glass-border)'}`,
              transition: 'all 0.3s'
            }}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: step >= s.num ? 'var(--dark-200)' : 'var(--dark-500)',
              display: window.innerWidth < 480 ? 'none' : 'inline'
            }}>
              {s.label}
            </span>
            {s.num < 4 && (
              <div style={{
                width: '30px',
                height: '2px',
                background: step > s.num ? 'var(--primary-500)' : 'var(--glass-border)',
                transition: 'all 0.3s'
              }}></div>
            )}
          </div>
        ))}
      </div>

      {erro && <div className="alert alert-error">⚠️ {erro}</div>}
      {sucesso && <div className="alert alert-success">✅ {sucesso}</div>}

      {/* Step 1: Profissional */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Escolha o Profissional</h3>
          <div className="grid" style={{ gap: '0.75rem' }}>
            {profissionais.map(prof => (
              <label
                key={prof.id}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: form.profissional_id === String(prof.id)
                    ? '1px solid var(--primary-500)'
                    : '1px solid var(--glass-border)',
                  background: form.profissional_id === String(prof.id)
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'var(--glass-bg)'
                }}
              >
                <input
                  type="radio"
                  name="profissional_id"
                  value={prof.id}
                  checked={form.profissional_id === String(prof.id)}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--violet-500))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>🩺</div>
                <div>
                  <div style={{ fontWeight: '600', color: 'white' }}>{prof.nome}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--dark-400)' }}>{prof.especialidade}</div>
                </div>
                {form.profissional_id === String(prof.id) && (
                  <span style={{ marginLeft: 'auto', color: 'var(--primary-400)', fontSize: '1.25rem' }}>✓</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Serviço */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>
            Escolha o Serviço
            {selectedProf && <span style={{ color: 'var(--dark-400)', fontWeight: '400', fontSize: '0.9rem' }}> — {selectedProf.nome}</span>}
          </h3>
          <div className="grid" style={{ gap: '0.75rem' }}>
            {servicos.map(serv => (
              <label
                key={serv.id}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  padding: '1rem',
                  border: form.servico_id === String(serv.id)
                    ? '1px solid var(--accent-500)'
                    : '1px solid var(--glass-border)',
                  background: form.servico_id === String(serv.id)
                    ? 'rgba(6, 182, 212, 0.1)'
                    : 'var(--glass-bg)'
                }}
              >
                <input
                  type="radio"
                  name="servico_id"
                  value={serv.id}
                  checked={form.servico_id === String(serv.id)}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'white' }}>{serv.nome}</div>
                    {serv.descricao && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--dark-500)', marginTop: '0.25rem' }}>{serv.descricao}</div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: 'var(--dark-400)', marginTop: '0.5rem' }}>
                      ⏱ {serv.duracao_minutos} min
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: 'var(--accent-400)',
                    whiteSpace: 'nowrap'
                  }}>
                    R$ {Number(serv.preco).toFixed(2)}
                  </div>
                </div>
              </label>
            ))}
            {servicos.length === 0 && (
              <p style={{ color: 'var(--dark-500)', textAlign: 'center', padding: '1rem' }}>
                Nenhum serviço disponível para este profissional.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Data e Hora */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Escolha Data e Horário</h3>
          <div className="form-group">
            <label className="form-label">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Horário</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
              {horariosDisponiveis.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, hora: h }))}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: form.hora === h ? '1px solid var(--primary-500)' : '1px solid var(--glass-border)',
                    background: form.hora === h ? 'rgba(59, 130, 246, 0.15)' : 'var(--glass-bg)',
                    color: form.hora === h ? 'var(--primary-400)' : 'var(--dark-300)',
                    cursor: 'pointer',
                    fontWeight: form.hora === h ? '600' : '400',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-family)',
                    transition: 'all 0.2s'
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Observações (opcional)</label>
            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Alguma informação adicional..."
            />
          </div>
        </div>
      )}

      {/* Step 4: Confirmação */}
      {step === 4 && (
        <div className="animate-fade-in">
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Confirme seu Agendamento</h3>
          <div className="glass-card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Profissional</span>
                <div style={{ color: 'white', fontWeight: '600' }}>
                  {selectedProf?.nome} — {selectedProf?.especialidade}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Serviço</span>
                <div style={{ color: 'white', fontWeight: '600' }}>
                  {selectedServico?.nome} ({selectedServico?.duracao_minutos} min)
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Data e Hora</span>
                <div style={{ color: 'white', fontWeight: '600' }}>
                  {form.data && new Date(form.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                  })} às {form.hora}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Valor</span>
                <div style={{ color: 'var(--accent-400)', fontWeight: '700', fontSize: '1.25rem' }}>
                  R$ {selectedServico ? Number(selectedServico.preco).toFixed(2) : '0.00'}
                </div>
              </div>
              {form.observacoes && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--dark-500)', textTransform: 'uppercase' }}>Observações</span>
                  <div style={{ color: 'var(--dark-300)' }}>{form.observacoes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <div>
          {step > 1 && (
            <button type="button" className="btn btn-secondary" onClick={prevStep}>
              ← Voltar
            </button>
          )}
          {onCancel && step === 1 && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
        <div>
          {step < 4 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              Próximo →
            </button>
          ) : (
            <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
              {loading ? '⏳ Agendando...' : '✅ Confirmar Agendamento'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
