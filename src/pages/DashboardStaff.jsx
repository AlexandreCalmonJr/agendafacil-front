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

  // OTIMIZAÇÃO: useMemo evita recálculo das métricas em renders desnecessários
  const metricas = useMemo(() => {
    return agendamentos.reduce((acc, curr) => {
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
      // Atualização otimista local para evitar refetch completo se não necessário
      setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: 'em_espera' } : ag));
    } catch (err) {
      alert('Erro ao confirmar chegada');
    }
  };

  const handlePagamento = async (id) => {
    try {
      await atualizarAgendamento(id, { pagamento_status: 'pago' });
      setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, pagamento_status: 'pago' } : ag));
    } catch (err) {
      alert('Erro ao dar baixa no pagamento');
    }
  };

  if (loading && agendamentos.length === 0) return <Loading text="Carregando VitalStaff Hub..." />;

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

      </div>

      {/* Visual Insights Section */}
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
          <RevenueChart data={[
            { name: 'Presencial', total: agendamentos.filter(a => a.modalidade === 'presencial').reduce((acc, curr) => acc + Number(curr.valor_consulta || curr.preco || 0), 0) },
            { name: 'Teleconsulta', total: agendamentos.filter(a => a.modalidade === 'teleconsulta').reduce((acc, curr) => acc + Number(curr.valor_consulta || curr.preco || 0), 0) },
            { name: 'Check-up', total: agendamentos.filter(a => a.servico_nome.includes('Check')).reduce((acc, curr) => acc + Number(curr.valor_consulta || curr.preco || 0), 0) },
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
                {agendamentos.length > 0 ? agendamentos.map(ag => (
                  <tr key={ag.id} className={ag.status}>
                    <td className="time-col">{ag.data_hora.split('T')[1]?.substring(0, 5) || '--:--'}</td>
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
                        {ag.status.replace('_', ' ')}
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
                          <button 
                            onClick={() => handleCheckIn(ag.id)}
                            className="btn-action checkin" 
                            title="Confirmar Chegada"
                          >
                            📍 Check-in
                          </button>
                        )}
                        {ag.pagamento_status === 'pendente' && (
                          <button 
                            onClick={() => handlePagamento(ag.id)}
                            className="btn-action pay" 
                            title="Baixa no Pagamento"
                          >
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

        <div className="content-card glass side-actions">
          <h3>Acesso Rápido</h3>
          <div className="quick-links">
            <button className="lnk-card">
              <span className="icon">🩺</span>
              <div>
                <strong>Cadastrar Médico</strong>
                <span>Novo profissional</span>
              </div>
            </button>
            <button className="lnk-card">
              <span className="icon">👤</span>
              <div>
                <strong>Novo Paciente</strong>
                <span>Criar cadastro</span>
              </div>
            </button>
            <button className="lnk-card">
              <span className="icon">📊</span>
              <div>
                <strong>Financeiro</strong>
                <span>Relatórios</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .metric-card { display: flex; align-items: center; padding: 1.2rem; border-radius: 20px; gap: 1rem; }
        .metric-icon { font-size: 2rem; background: rgba(255, 255, 255, 0.1); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
        .metric-info .label { display: block; font-size: 0.8rem; opacity: 0.7; }
        .metric-info .value { font-size: 1.3rem; font-weight: 700; color: #fff; }
        .staff-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .staff-table th { text-align: left; padding: 1rem; opacity: 0.6; font-size: 0.85rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .staff-table td { padding: 1.2rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .room-label { background: rgba(139, 92, 246, 0.2); color: #c4b5fd; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem !important; }
        .status-em_espera { color: #f59e0b; }
        .status-concluido { color: #10b981; }
        .btn-action { padding: 0.5rem 0.8rem; border-radius: 8px; border: none; cursor: pointer; font-size: 0.8rem; transition: 0.3s; }
        .btn-action.checkin { background: #6366f1; color: white; }
        .btn-action.pay { background: #10b981; color: white; }
        .btn-action:hover { opacity: 0.8; transform: translateY(-2px); }
        .quick-links { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 0.5rem; }
        .lnk-card { display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: white; text-align: left; cursor: pointer; transition: 0.2s; }
        .lnk-card:hover { background: rgba(255, 255, 255, 0.1); border-color: #6366f1; }
        .lnk-card .icon { font-size: 1.3rem; }
        .lnk-card div strong { display: block; font-size: 0.9rem; }
        .lnk-card div span { font-size: 0.75rem; opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default DashboardStaff;
