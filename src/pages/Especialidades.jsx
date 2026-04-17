import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarProfissionais } from '../services/api';
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

  const getImageUrl = (esp) => {
    const map = {
      'Cardiologia': 'https://images.unsplash.com/photo-1628178144529-2a512f28f991?w=800&h=600&fit=crop',
      'Pediatria': 'https://images.unsplash.com/photo-1581594658210-c5c85ce9d03d?w=800&h=600&fit=crop',
      'Dermatologia': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop',
      'Ortopedia': 'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=800&h=600&fit=crop',
      'Ginecologia': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
      'Neurologia': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop',
      'Urologia': 'https://images.unsplash.com/photo-1579154235828-ac7a61d67417?w=800&h=600&fit=crop',
      'Psiquiatria': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
      'Psiquiatria Clínica': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
      'Oftalmologia': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
      'Endocrinologia': 'https://images.unsplash.com/photo-1511174511562-5f7f18585481?w=800&h=600&fit=crop',
      'Otorrinolaringologia': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      'Gastrenterologia': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop',
      'Pneumologia': 'https://images.unsplash.com/photo-1559757117-5941c424b4f4?w=800&h=600&fit=crop',
      'Hematologia': 'https://images.unsplash.com/photo-1579154235828-ac7a61d67417?w=800&h=600&fit=crop',
      'Nutrologia': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=600&fit=crop',
      'Geriatria': 'https://images.unsplash.com/photo-1581578731522-99c56ca310bd?w=800&h=600&fit=crop'
    };
    return map[esp] || 'https://images.unsplash.com/photo-1505751172107-57322a39d4b6?w=800&h=600&fit=crop';
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

      <div className="content-envelope">
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
