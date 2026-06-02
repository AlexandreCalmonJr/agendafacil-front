import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from '../components/Loading';

describe('Loading Component', () => {
  it('deve renderizar com texto padrão', () => {
    render(<Loading />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar com texto customizado', () => {
    render(<Loading text="Salvando dados..." />);
    expect(screen.getByText('Salvando dados...')).toBeInTheDocument();
  });

  it('deve ter role="status" para acessibilidade', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('deve ter aria-live="polite"', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('deve conter o elemento spinner', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});
