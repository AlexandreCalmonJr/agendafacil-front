export default function AgendamentoCard({ agendamento, onCancelar, onAtualizar }) {
  const dataHora = new Date(agendamento.data_hora);
  const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const data = dataHora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  const statusConfig = {
    agendado: { label: 'Agendado', className: 'badge-agendado', icon: '🕐' },
    confirmado: { label: 'Confirmado', className: 'badge-confirmado', icon: '✅' },
    em_espera: { label: 'Em Espera', className: 'badge', icon: '⏳', style: { background: 'var(--warning)', color: 'black' } },
    em_atendimento: { label: 'Atendendo', className: 'badge', icon: '👨‍⚕️', style: { background: 'var(--primary-500)', color: 'white' } },
    cancelado: { label: 'Cancelado', className: 'badge-cancelado', icon: '❌' },
    concluido: { label: 'Concluído', className: 'badge-concluido', icon: '✔️' }
  };

  const statusInfo = statusConfig[agendamento.status] || statusConfig.agendado;
  const isCancelable = ['agendado', 'confirmado'].includes(agendamento.status);
  const isUpdatable = agendamento.status === 'agendado';

  return (
    <div className="glass-card agendamento-card animate-slide-up">
      <div className="time-block">
        <span className="time">{hora}</span>
        <span className="duration">{agendamento.duracao_minutos}min</span>
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <h4>{agendamento.servico_nome}</h4>
          <span className={`badge ${statusInfo.className}`} style={statusInfo.style || {}}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>
        <div className="card-info">
          <span>👤 {agendamento.cliente_nome || 'Cliente'}</span>
          <span>🩺 {agendamento.profissional_nome || 'Profissional'}</span>
          <span>📅 {data}</span>
          {agendamento.preco && (
            <span>💰 R$ {Number(agendamento.preco).toFixed(2)}</span>
          )}
        </div>
        {agendamento.observacoes && (
          <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            📝 {agendamento.observacoes}
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
            ✓ Confirmar
          </button>
        )}
        {isCancelable && onCancelar && (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onCancelar(agendamento.id)}
            title="Cancelar"
          >
            ✕ Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
