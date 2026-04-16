import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  const redirecionarPorPerfil = (usuario) => {
    if (usuario.perfil === 'admin') {
      navigate('/clientes');
    } else if (usuario.perfil === 'profissional') {
      navigate('/atendimento');
    } else {
      navigate('/agenda');
    }
  };

  const handlePacienteSubmit = async (e) => {
    e.preventDefault();
    setPacienteLoading(true);
    setPacienteErro('');

    try {
      if (isPacienteLogin) {
        const res = await login(formPaciente.email, formPaciente.senha);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        redirecionarPorPerfil(res.data.usuario);
      } else {
        await registro({
          nome: formPaciente.nome,
          email: formPaciente.email,
          senha: formPaciente.senha,
          telefone: formPaciente.telefone
        });
        const res = await login(formPaciente.email, formPaciente.senha);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
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
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      redirecionarPorPerfil(res.data.usuario);
    } catch (err) {
      setProfissionalErro(err.response?.data?.erro || 'Credenciais inválidas.');
    } finally {
      setProfissionalLoading(false);
    }
  };

  return (
    <div className="login-page fade-in" style={{ padding: '4rem 2rem' }}>

      <div style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* CARD DO PACIENTE */}
        <div className="glass-card login-card animate-slide-up" style={{ padding: '2.5rem', width: '100%', maxWidth: 'none', position: 'relative' }}>
          <div className="login-header">
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-400))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
            }}>👤</div>
            <h2 style={{ fontSize: '1.5rem' }}>{isPacienteLogin ? 'Área do Paciente' : 'Criar Conta (Paciente)'}</h2>
            <p style={{ fontSize: '0.9rem' }}>{isPacienteLogin ? 'Faça login para ver suas consultas' : 'Agende com nossos especialistas'}</p>
          </div>

          {pacienteErro && <div className="alert alert-error" style={{ marginBottom: '1rem', color: 'var(--danger)' }}>⚠️ {pacienteErro}</div>}

          <form onSubmit={handlePacienteSubmit}>
            {!isPacienteLogin && (
               <div className="form-group">
                 <label className="form-label">Nome completo</label>
                 <input type="text" value={formPaciente.nome} onChange={(e) => setFormPaciente({...formPaciente, nome: e.target.value})} className="form-input" placeholder="Seu nome completo" required />
               </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={formPaciente.email} onChange={(e) => setFormPaciente({...formPaciente, email: e.target.value})} className="form-input" placeholder="seu@email.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input type="password" value={formPaciente.senha} onChange={(e) => setFormPaciente({...formPaciente, senha: e.target.value})} className="form-input" placeholder="••••••" required />
            </div>

            {!isPacienteLogin && (
               <div className="form-group">
                 <label className="form-label">WhatsApp</label>
                 <input type="text" value={formPaciente.telefone} onChange={(e) => setFormPaciente({...formPaciente, telefone: e.target.value})} className="form-input" placeholder="(11) 99999-9999" />
               </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={pacienteLoading}>
              {pacienteLoading ? '⏳ Processando...' : isPacienteLogin ? '🔐 Acessar Minhas Consultas' : '🚀 Cadastrar'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { setIsPacienteLogin(!isPacienteLogin); setPacienteErro(''); }}>
              {isPacienteLogin ? '📝 Primeira vez? Cadastre-se' : '🔐 Já sou paciente e tenho conta'}
            </button>
          </div>
          
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--dark-500)' }}>
            Exemplo: maria.santos@email.com / 123456
          </div>
        </div>

        {/* CARD DO PROFISSIONAL */}
        <div className="glass-card login-card animate-slide-up" style={{ padding: '2.5rem', width: '100%', maxWidth: 'none', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div className="login-header">
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--violet-600), var(--violet-400))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
            }}>👨‍⚕️</div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--violet-400)' }}>Área do Profissional</h2>
            <p style={{ fontSize: '0.9rem' }}>Acesso restrito para corpo clínico e recepção</p>
          </div>

          {profissionalErro && <div className="alert alert-error" style={{ marginBottom: '1rem', color: 'var(--danger)' }}>⚠️ {profissionalErro}</div>}

          <form onSubmit={handleProfissionalSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--violet-200)' }}>Email Corporativo</label>
              <input type="email" value={formProfissional.email} onChange={(e) => setFormProfissional({...formProfissional, email: e.target.value})} className="form-input" placeholder="seu.nome@clinica.com" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }} required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--violet-200)' }}>Senha de Rede</label>
              <input type="password" value={formProfissional.senha} onChange={(e) => setFormProfissional({...formProfissional, senha: e.target.value})} className="form-input" placeholder="••••••" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--violet-600), var(--violet-500))', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }} disabled={profissionalLoading}>
              {profissionalLoading ? '⏳ Autenticando...' : '🔐 Acessar Sistema'}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(139, 92, 246, 0.1)', paddingTop: '1.5rem' }}>
            <p style={{ color: 'var(--dark-400)', fontSize: '0.8rem' }}>Precisa de ajuda? Contate o suporte interno.</p>
          </div>
          
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--dark-500)' }}>
             Exemplo: ana.silva@clinica.com / 123456
          </div>
        </div>

      </div>
    </div>
  );
}
