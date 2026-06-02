import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, CheckCircle, Hourglass, Stethoscope, XCircle, CalendarCheck, Video, Building2, User, Calendar, DollarSign, Bell, FileText, RefreshCw } from 'lucide-react';
import '../styles/AgendamentoCard.css';

export default function AgendamentoCard({ agendamento, onCancelar, onAtualizar }) {
  const { usuario } = useAuth();
  const dataHora = new Date(agendamento.data_hora);
  const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const data = dataHora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  const statusConfig = {
    agendado: { label: 'Agendado', className: 'badge-agendado', icon: <Clock size={13} /> },
    confirmado: { label: 'Confirmado', className: 'badge-confirmado', icon: <CheckCircle size={13} /> },
    em_espera: { label: 'Em Espera', className: 'badge', icon: <Hourglass size={13} />, style: { background: 'var(--warning)', color: 'black' } },
    em_atendimento: { label: 'Atendendo', className: 'badge', icon: <Stethoscope size={13} />, style: { background: 'var(--primary-500)', color: 'white' } },
    cancelado: { label: 'Cancelado', className: 'badge-cancelado', icon: <XCircle size={13} /> },
    concluido: { label: 'Concluído', className: 'badge-concluido', icon: <CalendarCheck size={13} /> }
  };

  const statusInfo = statusConfig[agendamento.status] || statusConfig.agendado;
  const isCancelable = ['agendado', 'confirmado'].includes(agendamento.status);
  const isUpdatable = agendamento.status === 'agendado';
  const isProfissional = ['profissional', 'admin'].includes(usuario?.perfil);

  const handleEditLink = () => {
    const novoLink = window.prompt('Insira o link da teleconsulta (Zoom, Meet, WhatsApp):', agendamento.link_telemedicina || '');
    if (novoLink !== null && onAtualizar) {
      onAtualizar({ ...agendamento, link_telemedicina: novoLink });
    }
  };

  const gerarGoogleCalendarLink = () => {
    const titulo = `Consulta: ${agendamento.servico_nome} - Clínica Vita`;
    const detalhes = `Profissional: ${agendamento.profissional_nome}\nLocal: Clínica Vita\nObservações: ${agendamento.observacoes || 'Nenhum'}`;
    const dataInicio = agendamento.data_hora.replace(/-|:|\.\d\d\d/g, "");
    // Adiciona a duração para o fim (aproximado)
    const dataFimObj = new Date(new Date(agendamento.data_hora).getTime() + (agendamento.duracao_minutos || 30) * 60000);
    const dataFim = dataFimObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&details=${encodeURIComponent(detalhes)}&dates=${dataInicio}/${dataFim}`;
  };

  return (
    <div className="glass-card agendamento-card animate-slide-up">
      <div className="time-block">
        <span className="time">{hora}</span>
        <span className="duration">{agendamento.duracao_minutos}min</span>
      </div>

      <div className="card-body">
        <div className="card-header">
          <h4>{agendamento.servico_nome}</h4>
          <span className={`badge ${statusInfo.className}`} style={statusInfo.style || {}}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>
        <div className="card-info">
          <span>{agendamento.modalidade === 'teleconsulta' ? <><Video size={14} /> Teleconsulta</> : <><Building2 size={14} /> Presencial</>}</span>
          <span><User size={14} /> {agendamento.cliente_nome || 'Cliente'}</span>
          <span><Stethoscope size={14} /> {agendamento.profissional_nome || 'Profissional'}</span>
          <span><Calendar size={14} /> {data}</span>
          {agendamento.preco && (
            <span><DollarSign size={14} /> R$ {Number(agendamento.preco).toFixed(2)}</span>
          )}
          {agendamento.notificado && (
            <span className="agendamento-notificado" title="Lembrete enviado com sucesso"><Bell size={14} /> Notificado</span>
          )}
        </div>
        
        {agendamento.link_telemedicina && (
          <div className="agendamento-link">
            <a 
              href={agendamento.link_telemedicina} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-sm"
            >
              <Video size={14} /> Entrar na Teleconsulta
            </a>
          </div>
        )}

        {isProfissional && agendamento.modalidade === 'teleconsulta' && (
          <div className="agendamento-link-edit">
            <button 
              className="btn btn-sm btn-outline" 
              onClick={handleEditLink}
            >
              <RefreshCw size={14} /> {agendamento.link_telemedicina ? 'Alterar Link de Vídeo' : 'Definir Link de Vídeo'}
            </button>
          </div>
        )}
        {agendamento.observacoes && (
          <p className="agendamento-observacao">
            <FileText size={14} /> {agendamento.observacoes}
          </p>
        )}
      </div>

      <div className="card-actions">
        {isUpdatable && onAtualizar && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onAtualizar(agendamento)}
            title="Confirmar"
          >
            <CheckCircle size={14} /> Confirmar
          </button>
        )}
        {isCancelable && (
          <Link 
            to="/agendar" 
            state={{ 
              reagendar: true,
              profissional_id: agendamento.profissional_id,
              servico_id: agendamento.servico_id,
              modalidade: agendamento.modalidade,
              observacoes: agendamento.observacoes
            }} 
            className="btn btn-sm btn-outline" 
            style={{ textDecoration: 'none' }}
          >
            <RefreshCw size={14} /> Reagendar
          </Link>
        )}
        {isCancelable && onCancelar && (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onCancelar(agendamento.id)}
            title="Cancelar"
          >
            <XCircle size={14} /> Cancelar
          </button>
        )}
        <a 
          href={gerarGoogleCalendarLink()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline"
          title="Adicionar ao Google Agenda"
          style={{ textDecoration: 'none' }}
        >
          <Calendar size={14} /> Agenda
        </a>
      </div>
    </div>
  );
}
