import { useState } from 'react';
import { criarProfissional, registro } from '../services/api';
import { UserPlus, Shield, Stethoscope, Briefcase } from 'lucide-react';
import '../styles/Usuarios.css';

export default function Usuarios() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    perfil: 'recepcionista',
    especialidade: '',
    descricao: '',
    registro_profissional: ''
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
    setSucesso('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    try {
      if (form.perfil === 'profissional') {
        if (!form.nome || !form.email || !form.senha || !form.especialidade) {
          throw new Error('Preencha os campos obrigatórios do médico (nome, email, senha, especialidade).');
        }
        await criarProfissional(form);
      } else {
        if (!form.nome || !form.email || !form.senha) {
          throw new Error('Preencha nome, email e senha.');
        }
        await registro({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          telefone: form.telefone,
          perfil: form.perfil
        });
      }
      
      setSucesso('Conta criada com sucesso!');
      setForm({
        nome: '', email: '', senha: '', telefone: '',
        perfil: 'recepcionista', especialidade: '', descricao: '', registro_profissional: ''
      });
    } catch (err) {
      setErro(err.message || err.response?.data?.erro || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="usuarios-container fade-in">
      <div className="page-header">
        <h1>Gerenciamento de Usuários</h1>
        <p>Cadastre novos profissionais, recepcionistas ou administradores para o sistema.</p>
      </div>

      <div className="glass-card usuarios-card">
        {erro && <div className="alert alert-error">⚠️ {erro}</div>}
        {sucesso && <div className="alert alert-success">✅ {sucesso}</div>}

        <form onSubmit={handleCreate} className="usuarios-form">
          <div className="role-selector">
            <label className={`role-badge ${form.perfil === 'recepcionista' ? 'active' : ''}`}>
              <input type="radio" name="perfil" value="recepcionista" checked={form.perfil === 'recepcionista'} onChange={handleChange} />
              <Briefcase size={18}/> Recepcionista
            </label>
            <label className={`role-badge ${form.perfil === 'profissional' ? 'active' : ''}`}>
              <input type="radio" name="perfil" value="profissional" checked={form.perfil === 'profissional'} onChange={handleChange} />
              <Stethoscope size={18}/> Profissional (Médico)
            </label>
            <label className={`role-badge ${form.perfil === 'admin' ? 'active' : ''}`}>
              <input type="radio" name="perfil" value="admin" checked={form.perfil === 'admin'} onChange={handleChange} />
              <Shield size={18}/> Administrador
            </label>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Nome Completo*</label>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} required className="form-input" placeholder="Ex: João Silva"/>
            </div>
            
            <div className="form-group">
              <label>Email Corporativo*</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="form-input" placeholder="joao.silva@clinicavita.com"/>
            </div>

            <div className="form-group">
              <label>Senha Inicial*</label>
              <input type="password" name="senha" value={form.senha} onChange={handleChange} required className="form-input" placeholder="Senha segura"/>
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="form-input" placeholder="(11) 99999-9999"/>
            </div>
          </div>

          {form.perfil === 'profissional' && (
            <div className="form-grid prof-extra-section fade-in">
              <div className="form-group">
                <label>Especialidade*</label>
                <input type="text" name="especialidade" value={form.especialidade} onChange={handleChange} required className="form-input" placeholder="Ex: Cardiologia"/>
              </div>
              <div className="form-group">
                <label>Registro Profissional (CRM/CRP)</label>
                <input type="text" name="registro_profissional" value={form.registro_profissional} onChange={handleChange} className="form-input" placeholder="CRM-SP 123456"/>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Mini Biografia/Descrição</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange} className="form-input" placeholder="Breve currículo ou apresentação..."/>
              </div>
            </div>
          )}

          <div className="form-footer">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', gap: '10px', height: '50px', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18}/> {loading ? 'Cadastrando...' : 'Criar Nova Conta no Sistema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
