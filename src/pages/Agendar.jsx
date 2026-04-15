import { useNavigate } from 'react-router-dom';
import FormAgendamento from '../components/FormAgendamento';

export default function Agendar() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>📅 Novo Agendamento</h1>
        <p>Selecione o profissional, serviço, data e horário desejado</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
        <FormAgendamento
          onSuccess={() => navigate('/agenda')}
          onCancel={() => navigate('/agenda')}
        />
      </div>
    </div>
  );
}
