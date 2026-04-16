import React, { useEffect, useMemo } from 'react';
import { 
  listarAgendamentos, 
  atualizarAgendamento 
} from '../services/api';
import { useApi } from '../hooks/useApi';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Loading from '../components/Loading';
import { RevenueChart, PatientsFlowChart } from '../components/AnalyticsCharts';
import '../styles/DashboardStaff.css';

const DashboardStaff = () => {
  // Hook customizado para gerenciar a chamada de agendamentos
  const { 
    data: agendamentos = [], 
    loading, 
    execute: fetchAgendamentos,
    setData: setAgendamentos 
  } = useApi(listarAgendamentos);

  useEffect(() => {
    const hoje = format(new Date(), 'yyyy-MM-dd');
    fetchAgendamentos({ data: hoje });
  }, [fetchAgendamentos]);

  // CORREÇÃO: Adicionada proteção (agendamentos || []) para evitar erro de reduce em null
  const metricas = useMemo(() => {
    return (agendamentos || []).reduce((acc, curr) => {
      if (curr.status === 'em_espera' || curr.status === 'em_atendimento') acc.naClinica++;
      
      const valor = Number(curr.valor_consulta || curr.preco || 0);
      if (curr.pagamento_status === 'pago') acc.faturado += valor;
      else acc.pendente += valor;
      
      acc.totalDia++;
      return acc;
    }, { naClinica: 0, faturado: 0, pendente: 0, totalDia: 0 });
  }, [agendamentos]);

  const handleCheckIn = async (id) => {
    try {
      await atualizarAgendamento(id, { status: 'em_espera' });
      setAgendamentos(prev => (prev || []).map(ag => ag.id === id ? { ...ag, status: 'em_espera' } : ag));
    } catch (err) {
      alert('Erro ao confirmar chegada');
    }
  };

  const handlePagamento = async (id) => {
    try {
      await atualizarAgendamento(id, { pagamento_status: 'pago' });
      setAgendamentos(prev => (prev || []).map(ag => ag.id === id ? { ...ag, pagamento_status: 'pago' } : ag));
    } catch (err) {
      alert('Erro ao dar baixa no pagamento');
    }
  };

  if (loading && (!agendamentos || agendamentos.length === 0)) return <Loading text="Carregando VitalStaff Hub..." />;

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1>VitalStaff Hub 🏢</h1>
          <p>Gestão Operacional e Financeira da Clínica</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">➕ Novo Agendamento</button>
        </div>
      </header>

      {/* Cards de Métricas */}
      <div className="metrics-grid">
        <div className="metric-card glass">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <span className="label">Na Clínica</span>
            <span className="value">{metricas.naClinica}</span>
          </div>
        </div>
        <div className="metric-card glass">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <span className="label">Faturado Hoje</span>
            <span className="value">R$ {metricas.faturado.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        <div className="metric-card glass">
          <div className="metric-icon">⏳</div>
          <div className="metric-info">
            <span className="label">A Receber</span>
            <span className="value">R$ {metricas.pendente.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        <div className="metric-card glass">
          <div className="metric-icon">📅</div>
          <div className="metric-info">
            <span className="label">Total Dia</span>
            <span className="value">{metricas.totalDia}</span>
          </div>
        </div>
      </div>

      <div className="analytics-section grid grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="content-card glass">
          <div className="card-header">
            <h3>📈 Volume de Pacientes (Últimos 7 dias)</h3>
          </div>
          <PatientsFlowChart data={[
            { date: format(subDays(new Date(), 6), 'dd/MM'), pacientes: 12 },
            { date: format(subDays(new Date(), 5), 'dd/MM'), pacientes: 18 },
            { date: format(subDays(new Date(), 4), 'dd/MM'), pacientes: 15 },
            { date: format(subDays(new Date(), 3), 'dd/MM'), pacientes: 22 },
            { date: format(subDays(new Date(), 2), 'dd/MM'), pacientes: 30 },
            { date: format(subDays(new Date(), 1), 'dd/MM'), pacientes: 25 },
            { date: format(new Date(), 'dd/MM'), pacientes: metricas.totalDia },
          ]} />
        </div>
        <div className="content-card glass">
          <div className="card-header">
            <h3>💰 Faturamento por Modalidade</h3>
          </div>
          {/* CORREÇÃO: Adicionada proteção (agendamentos || []) nos filtros do gráfico */}
          <RevenueChart data={[
            { 
              name: 'Presencial', 
              total: (agendamentos || []).filter(a => a.modalidade === 'presencial')
                                         .reduce((acc, curr) => acc + Number(curr.valor_consulta || curr.preco || 0), 0) 
            },
            { 
              name: 'Teleconsulta', 
              total: (agendamentos || []).filter(a => a.modalidade === 'teleconsulta')
                                         .reduce((acc, curr) => acc + Number(curr.valor_consulta || curr.preco || 0), 0) 
            },
            { 
              name: 'Check-up', 
              total: (agendamentos || []).filter(a => a.servico_nome?.includes('Check'))
                                         .reduce((acc, curr) => acc + Number(curr.valor_consulta || curr.preco || 0), 0) 
            },
          ]} />
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="content-card glass main-list" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3>Agenda Operacional ({format(new Date(), "dd 'de' MMMM", { locale: ptBR })})</h3>
          </div>
          
          <div className="table-responsive">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Horário</th>
                  <th>Paciente / Serviço</th>
                  <th>Médico / Sala</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos && agendamentos.length > 0 ? agendamentos.map(ag => (
                  <tr key={ag.id} className={ag.status}>
                    <td className="time-col">{ag.data_hora?.split('T')[1]?.substring(0, 5) || '--:--'}</td>
                    <td>
                      <div className="name-cell">
                        <strong>{ag.cliente_nome}</strong>
                        <span>{ag.servico_nome}</span>
                      </div>
                    </td>
                    <td>
                      <div className="name-cell">
                        <strong>{ag.profissional_nome}</strong>
                        <span className="room-label">{ag.sala || 'Não definida'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge status-${ag.status}`}>
                        {ag.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge pay-${ag.pagamento_status}`}>
                        {ag.pagamento_status === 'pago' ? '✅ Pago' : '⏳ Pendente'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {ag.status === 'agendado' && (
                          <button onClick={() => handleCheckIn(ag.id)} className="btn-action checkin">
                            📍 Check-in
                          </button>
                        )}
                        {ag.pagamento_status === 'pendente' && (
                          <button onClick={() => handlePagamento(ag.id)} className="btn-action pay">
                            💵 Receber
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="empty-msg">Nenhum agendamento para hoje.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStaff;