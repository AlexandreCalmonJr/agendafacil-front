import '../styles/Loading.css';

export default function Loading({ text = 'Carregando...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span className="spinner-text">{text}</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card skeleton-card">
      <div className="skeleton skeleton-line" style={{ width: '40%', height: '1.25rem' }}></div>
      <div className="skeleton skeleton-line" style={{ width: '80%' }}></div>
      <div className="skeleton skeleton-line" style={{ width: '60%' }}></div>
      <div className="skeleton-buttons">
        <div className="skeleton" style={{ width: '80px', height: '2rem', borderRadius: '9999px' }}></div>
        <div className="skeleton" style={{ width: '80px', height: '2rem', borderRadius: '9999px' }}></div>
      </div>
    </div>
  );
}
