import { useNavigate, useLocation } from 'react-router-dom';
import FormAgendamento from '../components/FormAgendamento';
import '../styles/Agendar.css';

export default function Agendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillData = location.state || null;

  return (
    <div className="agendar-container fade-in">
      <div className="agendar-header-premium">
        <h1>{prefillData?.reagendar ? 'Reagendar Consulta' : 'Novo Agendamento'}</h1>
        <p>{prefillData?.reagendar ? 'Escolha uma nova data e horário para sua consulta.' : 'Siga os passos abaixo para marcar sua consulta com nossos especialistas.'}</p>
      </div>

      <div className="wizard-shell glass-card">
        <FormAgendamento
          prefill={prefillData?.reagendar ? prefillData : null}
          onSuccess={() => navigate('/agenda')}
          onCancel={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
}
