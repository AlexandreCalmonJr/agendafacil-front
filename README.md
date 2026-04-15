# AgendaFácil - Front-End

Interface web do sistema de agendamento para clínica, desenvolvida com React + Vite.

## Tecnologias

- React 18
- React Router DOM 6
- Axios
- Vite
- CSS puro (Design System com Glassmorphism)

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (porta 3000)
npm run dev

# Build para produção
npm run build
```

## Estrutura

```
src/
├── components/
│   ├── Header.jsx          # Navbar responsiva
│   ├── AgendamentoCard.jsx  # Card de agendamento
│   ├── FormAgendamento.jsx  # Formulário multi-step
│   ├── FormCliente.jsx      # Formulário de cliente
│   └── Loading.jsx          # Spinner/skeleton
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Login.jsx           # Autenticação
│   ├── Agenda.jsx          # Visualização da agenda
│   ├── Agendar.jsx         # Novo agendamento
│   ├── Clientes.jsx        # Gestão de clientes
│   └── Profissionais.jsx   # Lista de profissionais
├── services/
│   └── api.js              # Axios + interceptors JWT
├── App.jsx                  # Rotas com React Router
├── App.css                  # Design System completo
└── main.jsx                 # Entry point
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3001/api
```

## Design

- Dark mode com glassmorphism
- Paleta: Azul (#3b82f6), Violet (#8b5cf6), Cyan (#06b6d4)
- Tipografia: Inter (Google Fonts)
- Responsivo: Mobile-first
