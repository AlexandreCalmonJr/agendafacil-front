import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const login = (email, senha) =>
  api.post('/login', { email, senha });

export const registro = (dados) =>
  api.post('/registro', dados);

// ========== PROFISSIONAIS ==========
export const listarProfissionais = () =>
  api.get('/profissionais');

export const buscarProfissional = (id) =>
  api.get(`/profissionais/${id}`);

export const criarProfissional = (dados) =>
  api.post('/profissionais', dados);

// ========== SERVIÇOS ==========
export const listarServicos = (profissionalId) =>
  api.get('/servicos', { params: profissionalId ? { profissional_id: profissionalId } : {} });

export const criarServico = (dados) =>
  api.post('/servicos', dados);

// ========== CLIENTES ==========
export const listarClientes = () =>
  api.get('/clientes');

export const buscarCliente = (id) =>
  api.get(`/clientes/${id}`);

export const criarCliente = (dados) =>
  api.post('/clientes', dados);

// ========== AGENDAMENTOS ==========
export const listarAgendamentos = (filtros = {}) =>
  api.get('/agendamentos', { params: filtros });

export const buscarAgendamento = (id) =>
  api.get(`/agendamentos/${id}`);

export const criarAgendamento = (dados) =>
  api.post('/agendamentos', dados);

export const atualizarAgendamento = (id, dados) =>
  api.put(`/agendamentos/${id}`, dados);

export const cancelarAgendamento = (id) =>
  api.delete(`/agendamentos/${id}`);

// ========== PRONTUARIOS ===========
export const buscarProntuario = (agendamentoId) =>
  api.get(`/agendamentos/${agendamentoId}/prontuario`);

export const salvarProntuario = (agendamentoId, dados) =>
  api.put(`/agendamentos/${agendamentoId}/prontuario`, dados);

export default api;
