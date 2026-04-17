import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarAgendamentos, atualizarAgendamento } from '../services/api';
import Loading from '../components/Loading';
import { Calendar, Clock, User, CheckCircle, Play, FileText, Coffee, AlertCircle } from 'lucide-react';
import '../styles/PainelMedico.css';

export default function PainelMedico() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const usuarioStr = localStorage.getItem('usuario');
  const medico = usuarioStr ? JSON.parse(usuarioStr) : { nome: 'Doutor' };

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

  useEffect(() => {
    carregarFila();
  }, []);

  const carregarFila = async () => {
    setLoading(true);
    try {
      // Buscar apenas os agendamentos de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const res = await listarAgendamentos({ data: hoje });
      setAgendamentos(res.data);
    } catch (err) {
      console.error('Erro ao carregar fila:', err);
    } finally {
      setLoading(false);
    }
  };

  const mudarStatus = async (id, novoStatus) => {
    try {
      await atualizarAgendamento(id, { status: novoStatus });
      carregarFila();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao mudar status');
    }
  };

  const iniciarAtendimento = async (id) => {
    await mudarStatus(id, 'em_atendimento');
    navigate(`/atendimento/${id}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'agendado': return <span className="badge badge-agendado">🕐 Agendado</span>;
      case 'confirmado': return <span className="badge badge-confirmado">✅ Confirmado</span>;
      case 'em_espera': return <span className="badge" style={{ background: 'var(--warning)', color: 'black' }}>⏳ Em Espera</span>;
      case 'em_atendimento': return <span className="badge" style={{ background: 'var(--primary-500)', color: 'white' }}>👨‍⚕️ Em Atendimento</span>;
      case 'concluido': return <span className="badge badge-concluido">✔️ Concluído</span>;
      case 'cancelado': return <span className="badge badge-cancelado">❌ Cancelado</span>;
      default: return <span className="badge">Desconhecido</span>;
    }
  };

  // Filtrar e ordenar a fila
  const agendamentosAtivos = agendamentos.filter(a => !['cancelado', 'concluido'].includes(a.status));
  const historico = agendamentos.filter(a => ['cancelado', 'concluido'].includes(a.status));

  if (loading) return <Loading text="Carregando fila de hoje..." />;

  return (
    <div className="painel-medico-container animate-fade-in">
      <div className="dashboard-header-premium">
        <div className="header-identity">
          <div className="medico-avatar-wrapper">
            <img src={getProfImage(medico.nome)} alt={medico.nome} className="medico-photo-real" />
            <div className="online-pulse"></div>
          </div>
          <div>
            <h1>Painel de Atendimento</h1>
            <p>Dr(a). {medico.nome} • {medico.especialidade || 'Especialista'}</p>
          </div>
        </div>
        <div className="header-date">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
        </div>
      </div>

      <div className="dashboard-layout-grid">
        {/* FILA DE ATIVOS */}
        <div className="fila-section">
          <div className="section-title-premium">
            <div className="title-left">
              <Clock size={20} />
              <h3>Fila de Hoje</h3>
            </div>
            <span className="count-badge">{agendamentosAtivos.length} Pacientes</span>
          </div>
          
          {agendamentosAtivos.length === 0 ? (
            <div className="empty-state-modern">
              <Coffee size={48} className="empty-icon" />
              <h3>Fila Limpa</h3>
              <p>Não há pacientes aguardando no momento.</p>
              <button className="btn btn-secondary btn-sm" onClick={carregarFila}>Atualizar Fila</button>
            </div>
          ) : (
            <div className="grid-cards-fila">
              {agendamentosAtivos.map(a => (
                <div key={a.id} className={`atendimento-card ${a.status}`}>
                  <div className="card-top">
                    <span className="time-tag"><Clock size={14} /> {new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    {getStatusBadge(a.status)}
                  </div>
                  
                  <div className="paciente-info">
                    <User size={20} className="user-icon" />
                    <div>
                      <h4 className="paciente-nome-text">{a.cliente_nome}</h4>
                      <span className="servico-nome-text">{a.servico_nome}</span>
                    </div>
                  </div>

                  <div className="card-actions-premium">
                    {a.status === 'agendado' && (
                      <button className="btn-card-action check" onClick={() => mudarStatus(a.id, 'confirmado')}>
                        <CheckCircle size={16} /> Confirmar
                      </button>
                    )}
                    {(a.status === 'confirmado' || a.status === 'agendado') && (
                      <button className="btn-card-action wait" onClick={() => mudarStatus(a.id, 'em_espera')}>
                        <AlertCircle size={16} /> Chegou
                      </button>
                    )}
                    {(a.status === 'em_espera' || a.status === 'confirmado') && (
                      <button className="btn-card-action primary" onClick={() => iniciarAtendimento(a.id)}>
                        <Play size={16} /> Atender
                      </button>
                    )}
                    {a.status === 'em_atendimento' && (
                      <button className="btn-card-action primary highlight" onClick={() => navigate(`/atendimento/${a.id}`)}>
                        <FileText size={16} /> Prontuário
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HISTORICO/CONCLUIDOS DO DIA */}
        <div className="historico-sidebar">
          <div className="section-title-premium compact">
            <CheckCircle size={18} />
            <h3>Finalizados</h3>
          </div>
          
          <div className="historico-list-modern">
            {historico.length === 0 ? (
              <p className="empty-mini-text">Nenhum atendimento finalizado.</p>
            ) : (
              historico.map(a => (
                <div key={a.id} className="historico-item-modern">
                  <div className="hist-info">
                    <strong>{a.cliente_nome}</strong>
                    <span>{a.servico_nome}</span>
                  </div>
                  <CheckCircle size={16} className="success-icon" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
