import React, { useState, useEffect } from 'react';
import { listarAgendamentos, listarProfissionais } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Gestão Global de Agenda 🌐</h1>
          <p>Visão consolidada de todos os profissionais</p>
        </div>
        <div className="header-actions">
          <input 
            type="date" 
            className="input-glass"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </div>
      </header>

      <div className="agenda-grid-container">
        {profissionais.map(p => (
          <div key={p.id} className="prof-column glass">
            <div className="prof-header">
              <div className="prof-avatar">
                {p.nome.charAt(0)}
              </div>
              <div className="prof-info">
                <strong>{p.nome}</strong>
                <span>{p.especialidade}</span>
              </div>
            </div>

            <div className="slots-container">
              {getAgendamentosPorProfissional(p.id).length > 0 ? (
                getAgendamentosPorProfissional(p.id).map(ag => (
                  <div key={ag.id} className={`agenda-slot ${ag.status}`}>
                    <span className="slot-time">{ag.data_hora.split('T')[1].substring(0, 5)}</span>
                    <div className="slot-details">
                      <strong>{ag.cliente_nome}</strong>
                      <span>{ag.servico_nome}</span>
                      <span className="slot-badge">{ag.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-slots">Sem agendamentos no dia.</div>
              )}
            </div>
            
            <button className="btn-add-slot">+ Encaixe</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GestaoGlobal;
