import { useState, useEffect } from 'react';
import { listarClientes } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FormCliente from '../components/FormCliente';
import Loading from '../components/Loading';
import '../styles/Clientes.css';

export default function Clientes() {
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState('');
  
  const isProfissional = usuario?.perfil === 'profissional';

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const res = await listarClientes();
      setClientes(res.data);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    c.email?.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpf?.includes(busca)
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>👥 {isProfissional ? 'Meus Pacientes' : 'Clientes'}</h1>
          <p>{isProfissional ? 'Acompanhe os pacientes do seu consultório' : 'Gerencie os clientes da clínica'}</p>
        </div>
        {!isProfissional && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Fechar' : '➕ Novo Cliente'}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card animate-slide-up" style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: '700', marginBottom: '1.5rem' }}>
            Cadastrar Novo Cliente
          </h3>
          <FormCliente
            onSuccess={() => { setShowForm(false); carregarClientes(); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Buscar por nome, email ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* List */}
      {loading ? (
        <Loading text="Carregando clientes..." />
      ) : clientesFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nenhum cliente encontrado</h3>
          <p>{busca ? 'Tente uma busca diferente.' : 'Cadastre o primeiro cliente.'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Nascimento</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-500), var(--primary-500))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {c.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{c.nome}</span>
                    </div>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.telefone || '—'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.cpf || '—'}</td>
                  <td>
                    {c.data_nascimento
                      ? new Date(c.data_nascimento).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Counter */}
      {!loading && (
        <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--dark-500)' }}>
          Mostrando {clientesFiltrados.length} de {clientes.length} {isProfissional ? 'pacientes' : 'clientes'}
        </div>
      )}
    </div>
  );
}
