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

  const gradients = [
    'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
  ];

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
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              {/* Avatar */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: 'var(--radius-xl)',
                background: gradients[index % gradients.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0
              }}>
                {getIcon(prof.especialidade)}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: '700', marginBottom: '0.25rem' }}>
                  {prof.nome}
                </h3>
                <span className="badge" style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--violet-400)',
                  marginBottom: '0.5rem',
                  display: 'inline-flex'
                }}>
                  {prof.especialidade}
                </span>
                {prof.descricao && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--dark-400)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                    {prof.descricao}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--dark-500)' }}>
                  <span>📧 {prof.email}</span>
                  {prof.telefone && <span>📞 {prof.telefone}</span>}
                  {prof.registro_profissional && <span>🏥 {prof.registro_profissional}</span>}
                </div>
              </div>

              {/* Expand icon */}
              <div style={{
                color: 'var(--dark-500)',
                fontSize: '1.25rem',
                transition: 'transform 0.3s',
                transform: expandido === prof.id ? 'rotate(180deg)' : 'rotate(0)'
              }}>
                ▼
              </div>
            </div>

            {/* Serviços expandíveis */}
            {expandido === prof.id && servicos[prof.id] && (
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--glass-border)',
                animation: 'slideUp 0.3s ease'
              }}>
                <h4 style={{ color: 'var(--dark-300)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Serviços Disponíveis
                </h4>
                <div className="grid" style={{ gap: '0.75rem' }}>
                  {servicos[prof.id].map(serv => (
                    <div key={serv.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div>
                        <div style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>{serv.nome}</div>
                        <div style={{ color: 'var(--dark-500)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                          ⏱ {serv.duracao_minutos} min
                          {serv.descricao && ` — ${serv.descricao}`}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: 'var(--accent-400)',
                        whiteSpace: 'nowrap'
                      }}>
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
