import React, { useState, useEffect } from 'react';
import { listarAgendamentos, listarProfissionais } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

      <style jsx>{`
        .agenda-grid-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 2rem;
          min-height: 70vh;
        }

        .prof-column {
          min-width: 300px;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          padding: 1.5rem;
        }

        .prof-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .prof-avatar {
          width: 45px;
          height: 45px;
          background: #8b5cf6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .prof-info strong { display: block; font-size: 1rem; }
        .prof-info span { font-size: 0.8rem; opacity: 0.6; }

        .slots-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .agenda-slot {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          transition: 0.3s;
        }

        .agenda-slot:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .agenda-slot.em_espera { border-left: 4px solid #f59e0b; }
        .agenda-slot.concluido { opacity: 0.5; }

        .slot-time {
          font-family: monospace;
          font-weight: 700;
          color: #a78bfa;
          font-size: 1.1rem;
        }

        .slot-details strong { display: block; font-size: 0.95rem; }
        .slot-details span { display: block; font-size: 0.8rem; opacity: 0.6; }

        .slot-badge {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
          font-size: 0.7rem !important;
          text-transform: uppercase;
        }

        .btn-add-slot {
          margin-top: 1.5rem;
          background: transparent;
          border: 1px dashed rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.8rem;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-add-slot:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .empty-slots {
          text-align: center;
          padding: 3rem 1rem;
          opacity: 0.4;
          font-style: italic;
        }

        .input-glass {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.6rem 1rem;
          border-radius: 10px;
        }

        .loading { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 1.5rem; color: #8b5cf6; }
      `}</style>
    </div>
  );
};

export default GestaoGlobal;
