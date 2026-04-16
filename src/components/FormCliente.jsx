import { useState } from 'react';
import { criarCliente } from '../services/api';
import '../styles/FormCliente.css';

export default function FormCliente({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    data_nascimento: '',
    cpf: '',
    endereco: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Máscara de CPF
    if (name === 'cpf') {
      const digits = value.replace(/\D/g, '').slice(0, 11);
      let masked = digits;
      if (digits.length > 3) masked = digits.slice(0, 3) + '.' + digits.slice(3);
      if (digits.length > 6) masked = masked.slice(0, 7) + '.' + digits.slice(6);
      if (digits.length > 9) masked = masked.slice(0, 11) + '-' + digits.slice(9);
      setForm(prev => ({ ...prev, cpf: masked }));
      return;
    }

    // Máscara de telefone
    if (name === 'telefone') {
      const digits = value.replace(/\D/g, '').slice(0, 11);
      let masked = digits;
      if (digits.length > 0) masked = '(' + digits;
      if (digits.length > 2) masked = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
      if (digits.length > 7) masked = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
      setForm(prev => ({ ...prev, telefone: masked }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    if (!form.nome || !form.email || !form.senha) {
      setErro('Nome, email e senha são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      await criarCliente(form);
      setSucesso('Cliente cadastrado com sucesso!');
      setForm({ nome: '', email: '', senha: '', telefone: '', data_nascimento: '', cpf: '', endereco: '' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {erro && <div className="alert alert-error">⚠️ {erro}</div>}
      {sucesso && <div className="alert alert-success">✅ {sucesso}</div>}

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Nome completo *</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="form-input"
            placeholder="João da Silva"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            placeholder="joao@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Senha *</label>
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

        <div className="form-group">
          <label className="form-label">CPF</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            className="form-input"
            placeholder="123.456.789-00"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Data de Nascimento</label>
          <input
            type="date"
            name="data_nascimento"
            value={form.data_nascimento}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Endereço</label>
        <input
          type="text"
          name="endereco"
          value={form.endereco}
          onChange={handleChange}
          className="form-input"
          placeholder="Rua, número, bairro - cidade/UF"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ Salvando...' : '💾 Cadastrar Cliente'}
        </button>
      </div>
    </form>
  );
}
