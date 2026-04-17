import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login, registro, loginGoogle } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { User, Stethoscope, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import logo from '../assets/image/logo.jpg';
import '../styles/Login.css';

export default function Login() {
  const [activeTab, setActiveTab] = useState('paciente'); // 'paciente' | 'profissional'
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'paciente' && isRegistering) {
        await registro({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          telefone: form.telefone
        });
        const res = await login(form.email, form.senha);
        loginContext(res.data.usuario, res.data.token);
        redirecionarPorPerfil(res.data.usuario);
      } else {
        const res = await login(form.email, form.senha);
        loginContext(res.data.usuario, res.data.token);
        redirecionarPorPerfil(res.data.usuario);
      }
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao processar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await loginGoogle(credentialResponse.credential);
      loginContext(res.data.usuario, res.data.token);
      redirecionarPorPerfil(res.data.usuario);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro no login com Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-page">
      <div className="login-sidebar">
        <div className="login-sidebar-header">
          <Link to="/" className="login-logo">
            <img src={logo} alt="Clínica Vita" />
          </Link>
        </div>

        <div className="login-form-container">
          <div className="login-titles">
            <h1>{isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1>
            <p>{isRegistering ? 'Junte-se a nós para cuidar melhor da sua saúde.' : 'Acesse seu painel para gerenciar sua saúde.'}</p>
          </div>

          <div className="login-type-selector">
            <button 
              className={`selector-btn ${activeTab === 'paciente' ? 'active' : ''}`}
              onClick={() => { setActiveTab('paciente'); setIsRegistering(false); setError(''); }}
            >
              <User size={18} /> Paciente
            </button>
            <button 
              className={`selector-btn ${activeTab === 'profissional' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profissional'); setIsRegistering(false); setError(''); }}
            >
              <Stethoscope size={18} /> Profissional
            </button>
          </div>

          {error && <div className="login-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-modern-form">
            {activeTab === 'paciente' && isRegistering && (
              <div className="input-group">
                <label><User size={16} /> Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={(e) => setForm({...form, nome: e.target.value})}
                  required 
                />
              </div>
            )}

            <div className="input-group">
              <label><Mail size={16} /> E-mail</label>
              <input 
                type="email" 
                placeholder="exemplo@email.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required 
              />
            </div>

            <div className="input-group">
              <label><Lock size={16} /> Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) => setForm({...form, senha: e.target.value})}
                required 
              />
            </div>

            {activeTab === 'paciente' && isRegistering && (
              <div className="input-group">
                <label><Phone size={16} /> WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={(e) => setForm({...form, telefone: e.target.value})}
                />
              </div>
            )}

            {!isRegistering && (
              <div className="forgot-password">
                <a href="#">Esqueceu a senha?</a>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Processando...' : (isRegistering ? 'Criar Conta' : 'Entrar')}
            </button>
          </form>

          <div className="login-social-separator">
            <span>ou continue com</span>
          </div>

          <div className="login-social-actions">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Erro no login com Google')}
              theme="outline"
              size="large"
              width="100%"
              shape="rectangular"
            />
          </div>

          <div className="login-footer-info">
            {activeTab === 'paciente' ? (
              <p>
                {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                <button onClick={() => setIsRegistering(!isRegistering)}>
                  {isRegistering ? 'Faça login' : 'Cadastre-se agora'}
                </button>
              </p>
            ) : (
              <div className="test-credentials">
                <p>Conta teste: <span>ana.silva@clinica.com / 123456</span></p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="login-visual-panel">
        <div className="visual-content">
          <blockquote>
            "O futuro pertence àqueles que acreditam na <span>beleza dos seus sonhos</span>."
            <footer>— Eleanor Roosevelt</footer>
          </blockquote>
          <div className="visual-badge">
            <div className="badge-glow"></div>
            <span>Excelência Médica Digital</span>
          </div>
        </div>
        <div className="visual-image-overlay"></div>
      </div>
    </div>
  );
}
