import '../styles/Loading.css';

export default function Loading({ text = 'Carregando...' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="spinner"></div>
      <span className="spinner-text">{text}</span>
    </div>
  );
}
