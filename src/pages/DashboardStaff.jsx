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
import { Activity, DollarSign, Users, Calendar, MapPin, CheckCircle, CreditCard, Plus } from 'lucide-react';
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

  // Metricas
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

  const getProfImage = (nome) => {
    const map = {
      'Dr. Carlos Eduardo': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
      'Dra. Ana Beatrix': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
      'Dr. Ricardo Santos': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
      'Dra. Mariana Luz': 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?w=400&h=400&fit=crop',
      'Dr. Henrique Silva': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
      'Dra. Letícia Costa': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop'
    };
    return map[nome] || `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=0f172a&color=fff`;
  };

  if (loading && (!agendamentos || agendamentos.length === 0)) return <Loading text="Carregando VitalStaff Hub..." />;

  return (
    <div className="dashboard-container-staff fade-in">
      <header className="dashboard-header-staff">
        <div className="staff-identity">
          <div className="company-badge"><Activity size={16} /> Operações VitalHub</div>
          <h1>Centro de Controle</h1>
          <p>Monitoramento em tempo real • {format(new Date(), "eeee, dd 'de' MMMM", { locale: ptBR })}</p>
        </div>
        <button className="btn-staff-plus">
          <Plus size={20} /> Novo Atendimento
        </button>
      </header>

      {/* Cards de Métricas Premium */}
      <div className="metrics-staff-grid">
        <div className="staff-metric-card">
          <div className="icon-box blue"><Users size={24} /></div>
          <div className="info-box">
            <span className="val">{metricas.naClinica}</span>
            <span className="lab">Pacientes na Clínica</span>
          </div>
        </div>
        <div className="staff-metric-card">
          <div className="icon-box green"><DollarSign size={24} /></div>
          <div className="info-box">
            <span className="val">R$ {metricas.faturado.toLocaleString('pt-BR')}</span>
            <span className="lab">Receita Confirmada</span>
          </div>
        </div>
        <div className="staff-metric-card">
          <div className="icon-box orange"><CreditCard size={24} /></div>
          <div className="info-box">
            <span className="val">R$ {metricas.pendente.toLocaleString('pt-BR')}</span>
            <span className="lab">Pagamentos Pendentes</span>
          </div>
        </div>
      </div>

      <div className="analytics-staff-row">
        <div className="glass-card-staff chart-box">
          <div className="chart-header">
            <h3>Fluxo de Pacientes (7 Dias)</h3>
            <span className="chart-info">Evolução da demanda semanal</span>
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
      </div>

      <div className="agenda-operacional-wrapper">
        <div className="glass-card-staff no-padding">
          <div className="agenda-header-padded">
            <h3>Agenda do Dia</h3>
            <span className="total-dia-badge">{metricas.totalDia} agendamentos hoje</span>
          </div>
          
          <div className="table-responsive-staff">
            <table className="staff-table-premium">
              <thead>
                <tr>
                  <th>Horário</th>
                  <th>Paciente</th>
                  <th>Especialista</th>
                  <th>Status Atendimento</th>
                  <th>Pagamento</th>
                  <th>Ações de Fluxo</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos && agendamentos.length > 0 ? agendamentos.map(ag => (
                  <tr key={ag.id}>
                    <td className="time-td">
                      <div className="time-chip-staff">
                        <Calendar size={12} />
                        {ag.data_hora?.split('T')[1]?.substring(0, 5) || '--:--'}
                      </div>
                    </td>
                    <td>
                      <div className="paciente-cell">
                        <strong>{ag.cliente_nome}</strong>
                        <span>{ag.servico_nome}</span>
                      </div>
                    </td>
                    <td>
                      <div className="doutor-cell">
                        <img src={getProfImage(ag.profissional_nome)} alt={ag.profissional_nome} className="doutor-thumb" />
                        <div>
                          <strong>{ag.profissional_nome}</strong>
                          <span className="sala-label"><MapPin size={12} /> {ag.sala || 'Sala 01'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`staff-badge status-${ag.status}`}>
                        {ag.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`staff-pay pay-${ag.pagamento_status}`}>
                        {ag.pagamento_status === 'pago' ? <CheckCircle size={14} /> : <DollarSign size={14} />}
                        {ag.pagamento_status === 'pago' ? 'Liquidado' : 'Pendente'}
                      </span>
                    </td>
                    <td>
                      <div className="staff-actions">
                        {ag.status === 'agendado' && (
                          <button onClick={() => handleCheckIn(ag.id)} className="btn-staff-act checkin">Dar Entrada</button>
                        )}
                        {ag.pagamento_status === 'pendente' && (
                          <button onClick={() => handlePagamento(ag.id)} className="btn-staff-act pay">Receber</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="empty-staff-msg">
                      <div className="empty-info">
                        <Calendar size={32} opacity={0.2} />
                        <p>Nenhum atendimento registrado para este turno.</p>
                      </div>
                    </td>
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