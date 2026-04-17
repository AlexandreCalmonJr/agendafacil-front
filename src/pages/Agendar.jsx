import { useNavigate } from 'react-router-dom';
import FormAgendamento from '../components/FormAgendamento';
import '../styles/Agendar.css';

export default function Agendar() {
  const navigate = useNavigate();

  return (
    <div className="agendar-container fade-in">
      <div className="agendar-header-premium">
        <h1>Novo Agendamento</h1>
        <p>Siga os passos abaixo para marcar sua consulta com nossos especialistas.</p>
      </div>

      <div className="wizard-shell glass-card">
        <FormAgendamento
          onSuccess={() => navigate('/agenda')}
          onCancel={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
}
