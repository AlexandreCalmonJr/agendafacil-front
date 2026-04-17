import React, { useState, useEffect } from 'react';
import { listarAgendamentos, listarProfissionais } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Globe, Calendar, Plus, Users, Search, MoreHorizontal } from 'lucide-react';
import '../styles/GestaoGlobal.css';

const GestaoGlobal = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    carregarDados();
  }, [dataSelecionada]);

  const carregarDados = async () => {
    try {
      const [resProg, resAgen] = await Promise.all([
        listarProfissionais(),
        listarAgendamentos({ data: dataSelecionada })
      ]);
      setProfissionais(resProg.data);
      setAgendamentos(resAgen.data);
    } catch (err) {
      console.error('Erro ao carregar gestão global:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAgendamentosPorProfissional = (profId) => {
    return agendamentos.filter(a => a.profissional_id === profId);
  };

  if (loading) return <div className="loading">Carregando Agenda Global...</div>;

  return (
    <div className="gestao-global-premium fade-in">
      <header className="gestao-header-premium">
        <div className="header-title-box">
          <div className="title-icon"><Globe size={24} /></div>
          <div>
            <h1>Gestão Global de Agenda</h1>
            <p>Monitoramento operacional em tempo real</p>
          </div>
        </div>
        <div className="gestao-actions-premium">
          <div className="date-box">
            <Calendar size={18} />
            <input 
              type="date" 
              className="premium-input-date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="agenda-grid-premium">
        {profissionais.map(p => (
          <div key={p.id} className="doctor-column-premium">
            <div className="doctor-header-card">
              <div className="doctor-avatar-box">
                {p.nome.charAt(0)}
              </div>
              <div className="doctor-meta">
                <strong>{p.nome}</strong>
                <span>{p.especialidade}</span>
              </div>
              <button className="btn-more"><MoreHorizontal size={16} /></button>
            </div>

            <div className="doctor-slots-list">
              {getAgendamentosPorProfissional(p.id).length > 0 ? (
                getAgendamentosPorProfissional(p.id).map(ag => (
                  <div key={ag.id} className={`agenda-item-premium status-${ag.status}`}>
                    <div className="slot-time-col">
                      <span className="time-val">{ag.data_hora.split('T')[1].substring(0, 5)}</span>
                    </div>
                    <div className="slot-content-col">
                      <p className="patient-name">{ag.cliente_nome}</p>
                      <p className="service-name">{ag.servico_nome}</p>
                      <div className="status-badge-premium">{ag.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-column">
                  <Calendar size={24} opacity={0.2} />
                  <p>Sem agenda para hoje</p>
                </div>
              )}
            </div>
            
            <button className="btn-quick-add">
              <Plus size={16} /> Encaixe Rápido
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GestaoGlobal;
