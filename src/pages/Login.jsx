import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, registro } from '../services/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      if (isLogin) {
        const res = await login(form.email, form.senha);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        navigate('/agenda');
      } else {
        await registro({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          telefone: form.telefone
        });
        // Auto-login após registro
        const res = await login(form.email, form.senha);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        navigate('/agenda');
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card login-card animate-slide-up">
        <div className="login-header">
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--primary-500), var(--violet-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>📅</div>
          <h2>{isLogin ? 'Bem-vindo de volta' : 'Criar sua conta'}</h2>
          <p>{isLogin ? 'Faça login para acessar sua agenda' : 'Cadastre-se para começar a agendar'}</p>
        </div>

        {erro && <div className="alert alert-error">⚠️ {erro}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="form-input"
                placeholder="Seu nome completo"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className="form-input"
                placeholder="(11) 99999-9999"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading
              ? '⏳ Processando...'
              : isLogin
                ? '🔐 Entrar'
                : '🚀 Cadastrar'
            }
          </button>
        </form>

        <div className="login-divider">ou</div>

        <button
          className="btn btn-secondary"
          style={{ width: '100%' }}
          onClick={() => { setIsLogin(!isLogin); setErro(''); }}
        >
          {isLogin ? '📝 Criar uma conta' : '🔐 Já tenho uma conta'}
        </button>

        {isLogin && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', fontSize: '0.8rem' }}>
            <p style={{ color: 'var(--dark-400)', marginBottom: '0.5rem', fontWeight: '600' }}>Contas de teste:</p>
            <p style={{ color: 'var(--dark-500)' }}>👑 admin@clinicavita.com / 123456</p>
            <p style={{ color: 'var(--dark-500)' }}>🩺 ana.silva@clinicavita.com / 123456</p>
            <p style={{ color: 'var(--dark-500)' }}>👤 maria.santos@email.com / 123456</p>
          </div>
        )}
      </div>
    </div>
  );
}
