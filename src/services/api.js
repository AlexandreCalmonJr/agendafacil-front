import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const login = (email, senha) =>
  api.post('/login', { email, senha });

export const loginGoogle = (googleToken) =>
  api.post('/login-google', { token: googleToken });

export const registro = (dados) =>
  api.post('/registro', dados);

export const logoutApi = () =>
  api.post('/logout');

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

export const buscarHistoricoSaude = (clienteId) =>
  api.get('/clientes/meu-historico', { params: clienteId ? { cliente_id: clienteId } : {} });

// ========== AGENDAMENTOS ==========
export const listarAgendamentos = (filtros = {}) =>
  api.get('/agendamentos', { params: filtros }).then(res => {
    if (res.data && res.data.dados) {
      return {
        ...res,
        data: res.data.dados,
        paginacao: res.data.paginacao
      };
    }
    return res;
  });

export const adicionarParticipante = (id, dados) =>
  api.post(`/agendamentos/${id}/participantes`, dados);

export const buscarDisponibilidade = (params) =>
  api.get('/agendamentos/disponibilidade', { params });

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

// ========== NOTÍCIAS & NOVIDADES ==========
export const listarNoticiasSaude = () =>
  api.get('/noticias/saude');

export const listarNovidadesClinica = () =>
  api.get('/noticias/clinica');

export default api;
