import { useState, useEffect } from 'react';
import { listarAgendamentos, cancelarAgendamento, atualizarAgendamento } from '../services/api';
import AgendamentoCard from '../components/AgendamentoCard';
import Loading from '../components/Loading';
import { Calendar, ChevronLeft, ChevronRight, Filter, List, LayoutGrid, Clock, CalendarDays, CheckCircle2, XCircle } from 'lucide-react';
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
    <div className="agenda-premium-container fade-in">
      <div className="agenda-header-premium">
        <div className="header-text">
          <h1>Minha Agenda</h1>
          <p>Gerencie seus compromissos e histórico de saúde</p>
        </div>
        <div className="agenda-view-toggle">
          <button
            className={`toggle-btn ${view === 'diaria' ? 'active' : ''}`}
            onClick={() => setView('diaria')}
          >
            <List size={16} /> Diária
          </button>
          <button
            className={`toggle-btn ${view === 'semanal' ? 'active' : ''}`}
            onClick={() => setView('semanal')}
          >
            <CalendarDays size={16} /> Semanal
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="agenda-toolbar-premium">
        <div className="date-navigator-premium">
          <button className="nav-arrow" onClick={() => navegarData(-1)}><ChevronLeft size={20} /></button>
          <button className="btn-today-premium" onClick={irParaHoje}>Hoje</button>
          <div className="current-date-display">
            <Calendar size={18} className="icon-cal" />
            <span>{getDisplayDate()}</span>
          </div>
          <button className="nav-arrow" onClick={() => navegarData(1)}><ChevronRight size={20} /></button>
        </div>

        <div className="filter-box-premium">
          <Filter size={16} />
          <select
            className="premium-select-flat"
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
      </div>

      {loading ? (
        <Loading text="Sincronizando compromissos..." />
      ) : agendamentosFiltrados.length === 0 ? (
        <div className="empty-agenda-state">
          <div className="empty-icon-box"><Calendar size={48} /></div>
          <h3>Sua agenda está livre</h3>
          <p>Não encontramos agendamentos para este período selecionado.</p>
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

      {!loading && agendamentosFiltrados.length > 0 && (
        <div className="agenda-footer-summary">
          <div className="summary-pill blue">
            <span className="pill-dot"></span>
            <strong>{agendamentosFiltrados.length}</strong> Total
          </div>
          <div className="summary-pill orange">
            <span className="pill-dot"></span>
            <strong>{agendamentosFiltrados.filter(a => a.status === 'agendado').length}</strong> Agendados
          </div>
          <div className="summary-pill green">
            <span className="pill-dot"></span>
            <strong>{agendamentosFiltrados.filter(a => a.status === 'confirmado').length}</strong> Confirmados
          </div>
        </div>
      )}
    </div>
  );
}
