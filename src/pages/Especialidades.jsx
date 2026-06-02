import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarProfissionais } from '../services/api';
import { getSpecialtyImage } from '../utils/images';
import Loading from '../components/Loading';
import '../styles/Especialidades.css';

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

      <div className="content-envelope">
        <div className="especialidades-grid">
          {especialidades.map((esp, index) => (
            <div key={esp.nome || index} className="especialidade-card">
              <div className="especialidade-icon">
                <img 
                  src={getSpecialtyImage(esp.nome)} 
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
                
                <Link to={`/profissionais?especialidade=${esp.nome}`} className="btn-especialidade">
                  Explorar Equipe
                </Link>
              </div>
            </div>
          ))}
        </div>
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
