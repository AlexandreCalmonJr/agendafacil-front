import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Toast from '../components/Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('deve renderizar null quando message está vazia', () => {
    const { container } = render(<Toast message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar mensagem de sucesso', () => {
    render(<Toast message="Operação realizada" type="success" />);
    expect(screen.getByText('Operação realizada')).toBeInTheDocument();
  });

  it('deve renderizar mensagem de erro', () => {
    render(<Toast message="Erro ao salvar" type="error" />);
    expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('toast-error');
  });

  it('deve renderizar mensagem de info', () => {
    render(<Toast message="Aviso importante" type="info" />);
    expect(screen.getByText('Aviso importante')).toBeInTheDocument();
  });

  it('deve chamar onClose após duração padrão', () => {
    const onClose = vi.fn();
    render(<Toast message="Teste" onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose com duração customizada', () => {
    const onClose = vi.fn();
    render(<Toast message="Teste" onClose={onClose} duration={2000} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no botão fechar', () => {
    const onClose = vi.fn();
    render(<Toast message="Teste" onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve ter ícone de check para tipo success', () => {
    render(<Toast message="Sucesso" type="success" />);
    const icon = screen.getByRole('alert').querySelector('.toast-icon');
    expect(icon).toBeInTheDocument();
  });
});
