import { useState, useEffect } from 'react';
import { listarProfissionais, listarServicos } from '../services/api';
import Loading from '../components/Loading';
import '../styles/Profissionais.css';

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [profRes, servRes] = await Promise.all([
        listarProfissionais(),
        listarServicos()
      ]);

      setProfissionais(profRes.data);

      // Agrupar serviços por profissional
      const servicosMap = {};
      servRes.data.forEach(s => {
        if (!servicosMap[s.profissional_id]) servicosMap[s.profissional_id] = [];
        servicosMap[s.profissional_id].push(s);
      });
      setServicos(servicosMap);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const especialidadeIcons = {
    'Dermatologia': '🧴',
    'Nutrição': '🥗',
    'Psicologia': '🧠',
    'Cardiologia': '❤️',
    'Ortopedia': '🦴',
    'Pediatria': '👶'
  };

  const getIcon = (esp) => especialidadeIcons[esp] || '🩺';

  // Mapeamento de fotos reais para profissionais (Exemplo baseado nos nomes comuns da clínica)
  const getProfImage = (nome, index) => {
    const images = [
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop', // Médico Homem 1
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop', // Médica Mulher 1
      'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400&h=400&fit=crop', // Médica Mulher 2
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop', // Médico Homem 2
    ];
    return images[index % images.length];
  };

  if (loading) return <Loading text="Carregando profissionais..." />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>👨‍⚕️ Profissionais</h1>
        <p>Conheça nossa equipe e serviços disponíveis</p>
      </div>

      <div className="grid" style={{ gap: '1.5rem' }}>
        {profissionais.map((prof, index) => (
          <div
            key={prof.id}
            className="glass-card"
            style={{ overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setExpandido(expandido === prof.id ? null : prof.id)}
          >
            <div className={`prof-card-container ${expandido === prof.id ? 'expanded' : ''}`}>
              <div className="prof-card-header">
                {/* Real Photo Avatar */}
                <div className="prof-photo-wrapper">
                  <img src={getProfImage(prof.nome, index)} alt={prof.nome} className="prof-real-photo" />
                  <div className="prof-status-dot online"></div>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 className="prof-card-name">
                  {prof.nome}
                </h3>
                <span className="prof-badge">
                  {prof.especialidade}
                </span>
                {prof.descricao && (
                  <p className="prof-bio">
                    {prof.descricao}
                  </p>
                )}
                <div className="prof-contact-row">
                  <span>📧 {prof.email}</span>
                  {prof.telefone && <span>📞 {prof.telefone}</span>}
                  {prof.registro_profissional && <span>🏥 {prof.registro_profissional}</span>}
                </div>
              </div>

              {/* Expand icon */}
              <div className={`prof-expand-toggle ${expandido === prof.id ? 'active' : ''}`}>
                ▼
              </div>
            </div>

            {/* Serviços expandíveis */}
            {expandido === prof.id && servicos[prof.id] && (
              <div className="prof-services-explorer">
                <h4 className="services-title">
                  Serviços Disponíveis
                </h4>
                <div className="services-list">
                  {servicos[prof.id].map(serv => (
                    <div key={serv.id} className="service-item-row">
                      <div className="service-main-info">
                        <div className="service-name-text">{serv.nome}</div>
                        <div className="service-meta-text">
                          ⏱ {serv.duracao_minutos} min
                          {serv.descricao && ` — ${serv.descricao}`}
                        </div>
                      </div>
                      <div className="service-price-tag">
                        R$ {Number(serv.preco).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {profissionais.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👩‍⚕️</div>
          <h3>Nenhum profissional cadastrado</h3>
          <p>Aguarde o cadastro de profissionais pela administração.</p>
        </div>
      )}
    </div>
  );
}
