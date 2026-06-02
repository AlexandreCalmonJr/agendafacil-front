<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square&logo=feather&logoColor=white" />
</p>

<h1 align="center">VitalHub Frontend</h1>

<p align="center">
  Interface React para gestão de clínicas médicas
</p>

---

## Setup

```bash
npm install
echo "VITE_API_URL=http://localhost:3001/api" > .env
npm run dev              # http://localhost:5173
```

### Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build |
| `npm test` | Executar testes |
| `npm run test:watch` | Testes em watch mode |

---

## Estrutura

```
src/
├── pages/              14 páginas
│   ├── Home.jsx            Landing page institucional
│   ├── Login.jsx           Login + registro + Google OAuth
│   ├── DashboardPaciente.jsx    Portal do paciente
│   ├── DashboardProfissional.jsx Painel do médico (consolidado)
│   ├── DashboardStaff.jsx       Hub operacional
│   ├── Agendar.jsx         Wizard de agendamento
│   ├── Agenda.jsx          Lista de consultas
│   ├── SalaAtendimento.jsx Atendimento + prontuário
│   ├── Pacientes.jsx       Gestão de pacientes
│   ├── Profissionais.jsx   Corpo clínico
│   ├── Especialidades.jsx  Especialidades médicas
│   ├── Usuarios.jsx        Gestão de contas
│   ├── Contato.jsx         Formulário de contato
│   └── Noticias.jsx        Notícias de saúde
│
├── components/         Componentes reutilizáveis
│   ├── Sidebar.jsx         Navegação lateral por perfil
│   ├── Header.jsx          Cabeçalho com busca
│   ├── FormAgendamento.jsx Wizard 3 etapas
│   ├── AgendamentoCard.jsx Card de consulta
│   ├── Toast.jsx           Notificações toast
│   ├── Loading.jsx         Spinner de carregamento
│   ├── AnalyticsCharts.jsx Gráficos Recharts
│   └── ProtectedRoute.jsx  Rota protegida por perfil
│
├── contexts/           Estado global
│   └── AuthContext.jsx     Sessão + JWT
│
├── hooks/              Hooks customizados
│   ├── useApi.js           Fetch com AbortController
│   └── useDarkMode.js      Tema claro/escuro
│
├── services/           Camada de API
│   └── api.js              Axios + interceptores
│
├── utils/              Utilitários
│   ├── images.js           Imagens de profissionais/especialidades
│   └── pdfGenerator.js     Geração de PDF
│
└── styles/             Estilização
    ├── App.css             Design system + CSS variables
    └── ...                 25+ módulos CSS
```

---

## Design System

| Elemento | Valor |
|----------|-------|
| Fonte | Inter |
| Border radius | `--radius-sm: 8px` · `--radius-md: 12px` · `--radius-lg: 16px` · `--radius-xl: 24px` |
| Tema | Claro/Escuro via CSS variables |
| Estilo | Glassmorphism com transparência |

### Cores

```
Primária:  #16a34a → #15803d
Neutros:   #f8fafc → #0f172a
Ações:     #3b82f6
Alertas:   #f59e0b
Erro:      #dc2626
Info:      #8b5cf6
```

---

## RBAC (Controle de Acesso)

| Rota | Admin | Recepção | Médico | Paciente |
|------|:-----:|:--------:|:------:|:--------:|
| `/dashboard-staff` | ✅ | ✅ | ❌ | ❌ |
| `/dashboard-profissional` | ✅ | ❌ | ✅ | ❌ |
| `/dashboard` | ❌ | ❌ | ❌ | ✅ |
| `/atendimento` | ✅ | ❌ | ✅ | ❌ |
| `/usuarios` | ✅ | ❌ | ❌ | ❌ |
| `/clientes` | ✅ | ✅ | ✅ | ❌ |

---

## Testes

```bash
npm test              # Executar testes
npm run test:watch    # Watch mode
npm run test:coverage # Com cobertura
```

---

## Deploy

```bash
npm run build         # Gera dist/ para deploy estático
```

Compatível com: Railway, Vercel, Netlify, GitHub Pages.

---

<p align="center">VitalHub Frontend — Clínica Vita</p>
