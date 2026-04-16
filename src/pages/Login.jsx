import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login, registro } from '../services/api';
import '../styles/Login.css';

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

  return (
    <div className="login-page">
      <div className="login-overlay"></div>
      
      <div className="login-container">
        {/* CARD DO PACIENTE */}
        <div className="login-card animate-slide-up">
          <div className="login-card-header">
            <div className="login-card-icon patient">👤</div>
            <h2 className="login-card-title">{isPacienteLogin ? 'Área do Paciente' : 'Criar Conta (Paciente)'}</h2>
            <p className="login-card-subtitle">{isPacienteLogin ? 'Faça login para ver suas consultas' : 'Agende com nossos especialistas'}</p>
          </div>

          {pacienteErro && <div className="login-error">⚠️ {pacienteErro}</div>}

          <form onSubmit={handlePacienteSubmit} className="login-form">
            {!isPacienteLogin && (
              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <input type="text" value={formPaciente.nome} onChange={(e) => setFormPaciente({ ...formPaciente, nome: e.target.value })} className="form-input" placeholder="Seu nome completo" required />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={formPaciente.email} onChange={(e) => setFormPaciente({ ...formPaciente, email: e.target.value })} className="form-input" placeholder="seu@email.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input type="password" value={formPaciente.senha} onChange={(e) => setFormPaciente({ ...formPaciente, senha: e.target.value })} className="form-input" placeholder="••••••" required />
            </div>

            {!isPacienteLogin && (
              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input type="text" value={formPaciente.telefone} onChange={(e) => setFormPaciente({ ...formPaciente, telefone: e.target.value })} className="form-input" placeholder="(11) 99999-9999" />
              </div>
            )}

            <button type="submit" className="btn btn-primary login-form-button patient-btn" disabled={pacienteLoading}>
              {pacienteLoading ? '⏳ Processando...' : isPacienteLogin ? '🔐 Acessar Minhas Consultas' : '🚀 Cadastrar'}
            </button>
          </form>

          <button className="btn btn-outline login-toggle-button" onClick={() => { setIsPacienteLogin(!isPacienteLogin); setPacienteErro(''); }}>
            {isPacienteLogin ? '📝 Primeira vez? Cadastre-se' : '🔐 Já sou paciente e tenho conta'}
          </button>
        </div>

        {/* CARD DO PROFISSIONAL */}
        <div className="login-card professional-card animate-slide-up">
          <div className="login-card-header">
            <div className="login-card-icon professional">👨‍⚕️</div>
            <h2 className="login-card-title">Área do Profissional</h2>
            <p className="login-card-subtitle">Acesso restrito para corpo clínico e recepção</p>
          </div>

          {profissionalErro && <div className="login-error">⚠️ {profissionalErro}</div>}

          <form onSubmit={handleProfissionalSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Corporativo</label>
              <input type="email" value={formProfissional.email} onChange={(e) => setFormProfissional({ ...formProfissional, email: e.target.value })} className="form-input professional-input" placeholder="seu.nome@clinica.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Senha de Rede</label>
              <input type="password" value={formProfissional.senha} onChange={(e) => setFormProfissional({ ...formProfissional, senha: e.target.value })} className="form-input professional-input" placeholder="••••••" required />
            </div>

            <button type="submit" className="btn btn-primary login-form-button professional-btn" disabled={profissionalLoading}>
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
