import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login, registro } from '../services/api';

export default function Login() {
  const [isPacienteLogin, setIsPacienteLogin] = useState(true);

  const [pacienteLoading, setPacienteLoading] = useState(false);
  const [pacienteErro, setPacienteErro] = useState('');
  const [formPaciente, setFormPaciente] = useState({ nome: '', email: '', senha: '', telefone: '' });

  const [profissionalLoading, setProfissionalLoading] = useState(false);
  const [profissionalErro, setProfissionalErro] = useState('');
  const [formProfissional, setFormProfissional] = useState({ email: '', senha: '' });
 
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const redirecionarPorPerfil = (usuario) => {
    if (usuario.perfil === 'admin' || usuario.perfil === 'recepcionista') {
      navigate('/dashboard-staff');
    } else if (usuario.perfil === 'profissional') {
      navigate('/dashboard-profissional');
    } else {
      navigate('/dashboard');
    }
  };

  const handlePacienteSubmit = async (e) => {
    e.preventDefault();
    setPacienteLoading(true);
    setPacienteErro('');

    try {
      if (isPacienteLogin) {
        const res = await login(formPaciente.email, formPaciente.senha);
        loginContext(res.data.usuario, res.data.token);
        redirecionarPorPerfil(res.data.usuario);
      } else {
        await registro({
          nome: formPaciente.nome,
          email: formPaciente.email,
          senha: formPaciente.senha,
          telefone: formPaciente.telefone
        });
        const res = await login(formPaciente.email, formPaciente.senha);
        loginContext(res.data.usuario, res.data.token);
        redirecionarPorPerfil(res.data.usuario);
      }
    } catch (err) {
      setPacienteErro(err.response?.data?.erro || 'Erro ao processar. Tente novamente.');
    } finally {
      setPacienteLoading(false);
    }
  };

  const handleProfissionalSubmit = async (e) => {
    e.preventDefault();
    setProfissionalLoading(true);
    setProfissionalErro('');

    try {
      const res = await login(formProfissional.email, formProfissional.senha);
      loginContext(res.data.usuario, res.data.token);
      redirecionarPorPerfil(res.data.usuario);
    } catch (err) {
      setProfissionalErro(err.response?.data?.erro || 'Credenciais inválidas.');
    } finally {
      setProfissionalLoading(false);
    }
  };

  // Estilos Elite Inline para evitar conflitos de parser
  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at center, rgba(10, 10, 11, 0.6) 0%, rgba(2, 6, 23, 0.95) 100%)',
      backdropFilter: 'blur(8px)',
    },
    container: {
      position: 'relative',
      zIndex: 10,
      width: '100%',
      maxWidth: '1000px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
    },
    card: {
      padding: '2.5rem',
      borderRadius: '24px',
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      color: 'white'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      
      <div style={styles.container}>
        {/* CARD DO PACIENTE */}
        <div style={styles.card} className="animate-slide-up">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
            }}>👤</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{isPacienteLogin ? 'Área do Paciente' : 'Criar Conta (Paciente)'}</h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{isPacienteLogin ? 'Faça login para ver suas consultas' : 'Agende com nossos especialistas'}</p>
          </div>

          {pacienteErro && <div style={{ marginBottom: '1rem', color: '#ef4444', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '0.8rem' }}>⚠️ {pacienteErro}</div>}

          <form onSubmit={handlePacienteSubmit}>
            {!isPacienteLogin && (
              <div className="form-group">
                <label className="form-label" style={{ color: '#94a3b8' }}>Nome completo</label>
                <input type="text" value={formPaciente.nome} onChange={(e) => setFormPaciente({ ...formPaciente, nome: e.target.value })} className="form-input" placeholder="Seu nome completo" required />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" style={{ color: '#94a3b8' }}>Email</label>
              <input type="email" value={formPaciente.email} onChange={(e) => setFormPaciente({ ...formPaciente, email: e.target.value })} className="form-input" placeholder="seu@email.com" required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#94a3b8' }}>Senha</label>
              <input type="password" value={formPaciente.senha} onChange={(e) => setFormPaciente({ ...formPaciente, senha: e.target.value })} className="form-input" placeholder="••••••" required />
            </div>

            {!isPacienteLogin && (
              <div className="form-group">
                <label className="form-label" style={{ color: '#94a3b8' }}>WhatsApp</label>
                <input type="text" value={formPaciente.telefone} onChange={(e) => setFormPaciente({ ...formPaciente, telefone: e.target.value })} className="form-input" placeholder="(11) 99999-9999" />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: '#3b82f6' }} disabled={pacienteLoading}>
              {pacienteLoading ? '⏳ Processando...' : isPacienteLogin ? '🔐 Acessar Minhas Consultas' : '🚀 Cadastrar'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            <button className="btn btn-outline" style={{ width: '100%', color: '#60a5fa', borderColor: '#3b82f6' }} onClick={() => { setIsPacienteLogin(!isPacienteLogin); setPacienteErro(''); }}>
              {isPacienteLogin ? '📝 Primeira vez? Cadastre-se' : '🔐 Já sou paciente e tenho conta'}
            </button>
          </div>
        </div>

        {/* CARD DO PROFISSIONAL */}
        <div style={{ ...styles.card, background: 'rgba(15, 23, 42, 0.6)' }} className="animate-slide-up">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
            }}>👨‍⚕️</div>
            <h2 style={{ fontSize: '1.5rem', color: '#a78bfa', fontWeight: '800' }}>Área do Profissional</h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Acesso restrito para corpo clínico e recepção</p>
          </div>

          {profissionalErro && <div style={{ marginBottom: '1rem', color: '#ef4444', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '0.8rem' }}>⚠️ {profissionalErro}</div>}

          <form onSubmit={handleProfissionalSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#a78bfa' }}>Email Corporativo</label>
              <input type="email" value={formProfissional.email} onChange={(e) => setFormProfissional({ ...formProfissional, email: e.target.value })} className="form-input" placeholder="seu.nome@clinica.com" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }} required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#a78bfa' }}>Senha de Rede</label>
              <input type="password" value={formProfissional.senha} onChange={(e) => setFormProfissional({ ...formProfissional, senha: e.target.value })} className="form-input" placeholder="••••••" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: '#8b5cf6', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }} disabled={profissionalLoading}>
              {profissionalLoading ? '⏳ Autenticando...' : '🔐 Acessar Sistema'}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(139, 92, 246, 0.1)', paddingTop: '1.5rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Conta teste: ana.silva@clinica.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
