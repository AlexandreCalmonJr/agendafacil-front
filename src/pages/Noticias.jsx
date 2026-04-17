import { useState, useEffect } from 'react';
import { listarNoticiasSaude } from '../services/api';
import Loading from '../components/Loading';
import '../styles/Noticias.css';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarNoticias() {
      try {
        setLoading(true);
        const res = await listarNoticiasSaude();
        setNoticias(res.data);
      } catch (err) {
        console.error("Erro ao carregar notícias:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarNoticias();
  }, []);

  if (loading) return <Loading text="Buscando as últimas notícias de saúde..." />;

  return (
    <div className="noticias-page fade-in">
      <header className="especialidades-header">
        <h1>Notícias da Saúde</h1>
        <p>Acompanhe as últimas atualizações e descobertas do mundo da medicina (Fonte: G1 Saúde).</p>
      </header>

      <div className="noticias-grid">
        {noticias.length > 0 ? (
          noticias.map((item, index) => (
            <div key={index} className="news-card">
              <div className="news-image">
                <span className="news-category">Saúde</span>
                <img 
                  src={item.image || `https://images.unsplash.com/photo-1505751172107-16781432f22b?auto=format&fit=crop&q=80&w=800&sig=${index}`} 
                  alt="" 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1505751172107-16781432f22b?auto=format&fit=crop&q=80&w=800';
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="news-content">
                <span className="news-date">{item.date}</span>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-excerpt">{item.excerpt}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-link">
                  Ler notícia completa ➔
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>Não foi possível carregar as notícias.</h3>
            <p>Tente novamente mais tarde.</p>
          </div>
        )}
      </div>
    </div>
  );
}
