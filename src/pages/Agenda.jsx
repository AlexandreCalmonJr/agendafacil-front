import { useState, useEffect } from 'react';
import { listarAgendamentos, cancelarAgendamento, atualizarAgendamento } from '../services/api';
import AgendamentoCard from '../components/AgendamentoCard';
import Loading from '../components/Loading';
import '../styles/Agenda.css';

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('diaria'); // diaria | semanal
  const [dataAtual, setDataAtual] = useState(new Date());
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    carregarAgendamentos();
  }, [dataAtual, view]);

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const filtros = {};

      if (view === 'diaria') {
        filtros.data = formatDate(dataAtual);
      }

      const res = await listarAgendamentos(filtros);
      let dados = res.data;

      // Filtro semanal no front-end
      if (view === 'semanal') {
        const inicioSemana = getInicioSemana(dataAtual);
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(fimSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59);

        dados = dados.filter(a => {
          const d = new Date(a.data_hora);
          return d >= inicioSemana && d <= fimSemana;
        });
      }

      setAgendamentos(dados);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm('Deseja realmente cancelar este agendamento?')) {
      try {
        await cancelarAgendamento(id);
        carregarAgendamentos();
      } catch (err) {
        alert(err.response?.data?.erro || 'Erro ao cancelar');
      }
    }
  };

  const handleConfirmar = async (agendamento) => {
    try {
      await atualizarAgendamento(agendamento.id, { status: 'confirmado' });
      carregarAgendamentos();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao confirmar');
    }
  };

  const navegarData = (direcao) => {
    const nova = new Date(dataAtual);
    if (view === 'diaria') {
      nova.setDate(nova.getDate() + direcao);
    } else {
      nova.setDate(nova.getDate() + (7 * direcao));
    }
    setDataAtual(nova);
  };

  const irParaHoje = () => setDataAtual(new Date());

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getInicioSemana = (date) => {
    const d = new Date(date);
    const dia = d.getDay();
    const diff = d.getDate() - dia + (dia === 0 ? -6 : 1); // segunda como início
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getDisplayDate = () => {
    if (view === 'diaria') {
      return dataAtual.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } else {
      const inicio = getInicioSemana(dataAtual);
      const fim = new Date(inicio);
      fim.setDate(fim.getDate() + 6);
      return `${inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — ${fim.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }
  };

  const agendamentosFiltrados = filtroStatus
    ? agendamentos.filter(a => a.status === filtroStatus)
    : agendamentos;

  // Agrupar por data para view semanal
  const agendamentosPorData = {};
  if (view === 'semanal') {
    agendamentosFiltrados.forEach(a => {
      const dataKey = new Date(a.data_hora).toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'short'
      });
      if (!agendamentosPorData[dataKey]) agendamentosPorData[dataKey] = [];
      agendamentosPorData[dataKey].push(a);
    });
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>📋 Agenda</h1>
        <p>Visualize e gerencie seus agendamentos</p>
      </div>

      {/* Controls */}
      <div className="agenda-controls">
        <div className="agenda-toggle">
          <button
            className={view === 'diaria' ? 'active' : ''}
            onClick={() => setView('diaria')}
          >
            📅 Diária
          </button>
          <button
            className={view === 'semanal' ? 'active' : ''}
            onClick={() => setView('semanal')}
          >
            📆 Semanal
          </button>
        </div>

        <div className="agenda-date-nav">
          <button className="btn btn-sm btn-secondary" onClick={() => navegarData(-1)}>←</button>
          <button className="btn btn-sm btn-outline" onClick={irParaHoje}>Hoje</button>
          <span className="date-display">{getDisplayDate()}</span>
          <button className="btn btn-sm btn-secondary" onClick={() => navegarData(1)}>→</button>
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <Loading text="Carregando agenda..." />
      ) : agendamentosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Nenhum agendamento encontrado</h3>
          <p>Não há agendamentos para este período.</p>
        </div>
      ) : view === 'diaria' ? (
        <div className="grid" style={{ gap: '1rem' }}>
          {agendamentosFiltrados.map(a => (
            <AgendamentoCard
              key={a.id}
              agendamento={a}
              onCancelar={handleCancelar}
              onAtualizar={handleConfirmar}
            />
          ))}
        </div>
      ) : (
        <div className="grid" style={{ gap: '2rem' }}>
          {Object.entries(agendamentosPorData).map(([data, ags]) => (
            <div key={data}>
              <h3 style={{
                color: 'var(--primary-300)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '600',
                marginBottom: '0.75rem',
                textTransform: 'capitalize',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--glass-border)'
              }}>
                {data}
              </h3>
              <div className="grid" style={{ gap: '0.75rem' }}>
                {ags.map(a => (
                  <AgendamentoCard
                    key={a.id}
                    agendamento={a}
                    onCancelar={handleCancelar}
                    onAtualizar={handleConfirmar}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && agendamentosFiltrados.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div className="glass-card" style={{ display: 'inline-flex', gap: '2rem', padding: '1rem 2rem' }}>
            <div>
              <span style={{ color: 'var(--dark-400)', fontSize: '0.75rem' }}>Total</span>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>{agendamentosFiltrados.length}</div>
            </div>
            <div>
              <span style={{ color: 'var(--dark-400)', fontSize: '0.75rem' }}>Agendados</span>
              <div style={{ color: 'var(--info)', fontWeight: '700', fontSize: '1.25rem' }}>
                {agendamentosFiltrados.filter(a => a.status === 'agendado').length}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--dark-400)', fontSize: '0.75rem' }}>Confirmados</span>
              <div style={{ color: 'var(--success)', fontWeight: '700', fontSize: '1.25rem' }}>
                {agendamentosFiltrados.filter(a => a.status === 'confirmado').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
