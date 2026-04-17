import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarProfissionais } from '../services/api';
import Loading from '../components/Loading';
import '../styles/Especialidades.css';

// Importando imagens locais
import imgClinicoGeral from '../assets/image/especialidades/clinico geral.jpg';
import imgPsiquiatria from '../assets/image/especialidades/pisquiatria.png';

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await listarProfissionais();
        // Extrair especialidades únicas e contar profissionais
        const counts = {};
        res.data.forEach(p => {
          counts[p.especialidade] = (counts[p.especialidade] || 0) + 1;
        });
        
        const unique = Object.keys(counts).map(nome => ({
          nome,
          profissionaisCount: counts[nome]
        }));
        
        setEspecialidades(unique);
      } catch (err) {
        console.error("Erro ao carregar especialidades:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const getImageUrl = (esp) => {
    const images = {
      'Clínica Geral / Medicina da Família': imgClinicoGeral,
      'Psiquiatria Clínica': imgPsiquiatria,
      'Dermatologia': 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=800',
      'Nutrição': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
      'Cardiologia': 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800',
      'Pediatria': 'https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?auto=format&fit=crop&q=80&w=800'
    };
    return images[esp] || 'https://images.unsplash.com/photo-1505751172107-16781432f22b?auto=format&fit=crop&q=80&w=800';
  };

  const getDescricao = (esp) => {
    const descricoes = {
      'Clínica Geral / Medicina da Família': 'Atendimento integral e preventivo para todas as idades, focando na saúde contínua da família.',
      'Psiquiatria Clínica': 'Cuidado especializado na saúde mental, tratando transtornos emocionais e comportamentais com empatia.',
      'Dermatologia': 'Tratamentos avançados para a saúde da pele, cabelos e unhas, unindo saúde e estética.',
      'Nutrição': 'Orientação alimentar personalizada para promover longevidade e bem-estar através da nutrição.',
      'Cardiologia': 'Prevenção e tratamento de doenças do coração com tecnologia e cuidado especializado.',
      'Ortopedia': 'Cuidado focado no sistema locomotor, tratando lesões e dores para devolver sua mobilidade.'
    };
    return descricoes[esp] || 'Atendimento especializado com os melhores profissionais da região para cuidar da sua saúde.';
  };

  if (loading) return <Loading text="Carregando especialidades..." />;

  return (
    <div className="especialidades-page fade-in">
      <header className="especialidades-header">
        <h1>Nossas Especialidades</h1>
        <p>
          A Clínica Vita oferece um corpo clínico multidisciplinar preparado para atender 
          você e sua família com excelência e humanização.
        </p>
      </header>

      <div className="especialidades-grid">
        {especialidades.map((esp, index) => (
          <div key={index} className="especialidade-card">
            <div className="especialidade-icon">
              <img 
                src={getImageUrl(esp.nome)} 
                alt={esp.nome} 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1505751172107-16781432f22b?auto=format&fit=crop&q=80&w=800';
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="specialty-info">
              <h3>{esp.nome}</h3>
              <p>{getDescricao(esp.nome)}</p>
              <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: '600' }}>
                {esp.profissionaisCount} {esp.profissionaisCount === 1 ? 'Profissional disponível' : 'Profissionais disponíveis'}
              </div>
              <Link to={`/profissionais?especialidade=${esp.nome}`} className="btn-especialidade">
                Ver Médicos
              </Link>
            </div>
          </div>
        ))}
      </div>

      {especialidades.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Nenhuma especialidade encontrada no momento.</h3>
          <p>Por favor, volte mais tarde.</p>
        </div>
      )}
    </div>
  );
}
