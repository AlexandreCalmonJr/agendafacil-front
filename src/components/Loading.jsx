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
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div className="skeleton skeleton-line" style={{ width: '40%', height: '1.25rem' }}></div>
      <div className="skeleton skeleton-line" style={{ width: '80%', marginTop: '0.75rem' }}></div>
      <div className="skeleton skeleton-line" style={{ width: '60%' }}></div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <div className="skeleton" style={{ width: '80px', height: '2rem', borderRadius: '9999px' }}></div>
        <div className="skeleton" style={{ width: '80px', height: '2rem', borderRadius: '9999px' }}></div>
      </div>
    </div>
  );
}
