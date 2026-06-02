import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import '../styles/Toast.css';

const icons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />
};

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container toast-${type}`} role="alert">
      <div className="toast-icon">{icons[type]}</div>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fechar">
        <X size={14} />
      </button>
    </div>
  );
}
