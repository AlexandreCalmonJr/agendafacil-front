import { useState, useEffect } from 'react';
import { listarNovidadesClinica } from '../services/api';
import Loading from '../components/Loading';
import '../styles/Noticias.css';

export default function Novidades() {
  const [novidades, setNovidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarNovidades() {
      try {
        setLoading(true);
        const res = await listarNovidadesClinica();
        setNovidades(res.data);
      } catch (err) {
        console.error("Erro ao carregar novidades da clínica:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarNovidades();
  }, []);

  if (loading) return <Loading text="Buscando novidades da Clínica Vita..." />;

  return (
    <div className="noticias-page fade-in">
      <header className="especialidades-header">
        <h1>Novidades da Clínica Vita</h1>
        <p>Acompanhe o que há de novo na sua clínica preferida: eventos, novos serviços e comunicados.</p>
      </header>

      <div className="noticias-grid">
        {novidades.map(item => (
          <div key={item.id} className="news-card clinic-news-card">
            <div className="news-image">
              <span className="news-category">{item.category}</span>
              <img src={item.image} alt={item.title} />
            </div>
            <div className="news-content">
              <span className="news-date">{item.date}</span>
              <h3 className="news-title">{item.title}</h3>
              <p className="news-excerpt">{item.excerpt}</p>
              <a href="#" className="news-link">Saiba mais ➔</a>
            </div>
          </div>
        ))}
      </div>

      {novidades.length === 0 && (
        <div className="empty-state">
          <h3>Nenhuma novidade no momento.</h3>
          <p>Fique atento para futuras atualizações!</p>
        </div>
      )}
    </div>
  );
}
