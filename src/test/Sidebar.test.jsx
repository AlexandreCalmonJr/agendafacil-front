import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    usuario: { id: 1, nome: 'Dr. Ana Silva', perfil: 'profissional' },
    logoutContext: vi.fn()
  })
}));

vi.mock('../hooks/useDarkMode', () => ({
  useDarkMode: () => ({
    darkMode: false,
    toggleDarkMode: vi.fn()
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard-profissional' })
  };
});

const renderSidebar = () => {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );
};

describe('Sidebar Component', () => {
  it('deve renderizar o nome do usuário', () => {
    renderSidebar();
    expect(screen.getByText('Dr. Ana Silva')).toBeInTheDocument();
  });

  it('deve renderizar o perfil do usuário', () => {
    renderSidebar();
    expect(screen.getByText('profissional')).toBeInTheDocument();
  });

  it('deve renderizar links do profissional', () => {
    renderSidebar();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Atendimento')).toBeInTheDocument();
    expect(screen.getByText('Agenda Semanal')).toBeInTheDocument();
    expect(screen.getByText('Meus Pacientes')).toBeInTheDocument();
  });

  it('deve renderizar botão de logout', () => {
    renderSidebar();
    expect(screen.getByText('Sair do Sistema')).toBeInTheDocument();
  });

  it('deve renderizar toggle de tema', () => {
    renderSidebar();
    expect(screen.getByText('Modo Escuro')).toBeInTheDocument();
  });

  it('deve renderizar logo', () => {
    renderSidebar();
    expect(screen.getByText('Clínica Vita')).toBeInTheDocument();
  });

  it('deve ter iniciais do usuário no avatar', () => {
    renderSidebar();
    expect(screen.getByText('DA')).toBeInTheDocument();
  });
});
