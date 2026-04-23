<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-Pure-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide-Icons-F56565?style=for-the-badge&logo=feather&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-22c55e?style=for-the-badge&logo=chartdotjs&logoColor=white" />
</p>

<h1 align="center">VitalHub — Portal Clínico</h1>

<p align="center">
  <strong>Interface de alta performance para gestão de clínicas médicas</strong><br/>
  Design Minimalista · Temas Dinâmicos · Controle de Acesso Visual · Wizard de Agendamento
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versão-2.0-16a34a?style=flat-square" />
  <img src="https://img.shields.io/badge/telas-17+_páginas-8b5cf6?style=flat-square" />
  <img src="https://img.shields.io/badge/componentes-8_modulares-3b82f6?style=flat-square" />
  <img src="https://img.shields.io/badge/estilos-25_CSS_modules-f59e0b?style=flat-square" />
</p>

---

## Procedimentos de Inicialização

```bash
# 1. Instalação de pacotes
npm install

# 2. Configuração de conexão com o backend
echo "VITE_API_URL=http://localhost:3001/api" > .env

# 3. Execução em ambiente de desenvolvimento
npm run dev          # Disponível em http://localhost:5173

# 4. Geração de build para produção
npm run build        # Arquivos gerados no diretório dist/
```

---

## Diretrizes de Design

### Especificações Visuais

| Atributo | Implementação |
|:--------|:-------------|
| **Estilização** | Interface moderna utilizando técnicas de Glassmorphism. |
| **Gestão de Temas** | Suporte nativo a temas Claro e Escuro via atributos de dados. |
| **Interatividade** | Micro-animações otimizadas para melhoria da experiência do usuário. |
| **Adaptabilidade** | Layout responsivo para múltiplos dispositivos e resoluções. |
| **Tipografia** | Utilização da fonte Inter para legibilidade superior. |

### Matriz de Cores

```
Primária        ──── #16a34a → #15803d (Padrão Clínico)
Neutros Claros  ──── #f8fafc → #e2e8f0 → #94a3b8
Neutros Escuros ──── #0f172a → #1e293b → #334155
Ações           ──── #3b82f6 (Links e CTAs)
Alertas         ──── #f59e0b (Estados Pendentes)
Crítico         ──── #dc2626 (Cancelamentos e Erros)
Informativo     ──── #8b5cf6 (Estados Concluídos)
```

---

## Estrutura de Arquivos

```
src/
├── main.jsx                    # Ponto de entrada da aplicação
├── App.jsx                     # Configuração de rotas e segurança
│
├── styles/                     # Módulos de estilização CSS
│   ├── App.css                    # Design System global
│   ├── DashboardPaciente.css      # Interface do Paciente
│   ├── DashboardProfissional.css  # Interface do Médico
│   ├── DashboardStaff.css         # Interface de Operações
│   └── ... (Módulos adicionais)
│
├── components/                 # Biblioteca de componentes reutilizáveis
│   ├── Sidebar.jsx                # Navegação lateral por perfil
│   ├── FormAgendamento.jsx        # Wizard de agendamento multi-step
│   ├── AnalyticsCharts.jsx        # Visualização de dados operacionais
│   └── Loading.jsx                # Indicadores de carregamento premium
│
├── pages/                      # Interfaces de nível de página
│   ├── Home.jsx                   # Site Institucional
│   ├── DashboardPaciente.jsx      # Portal do Paciente
│   ├── DashboardProfissional.jsx  # Painel do Médico
│   ├── DashboardStaff.jsx         # Hub de Recepção
│   └── ... (Interfaces específicas)
│
├── contexts/                   # Provedores de estado global
│   └── AuthContext.jsx            # Gestão de sessão e tokens JWT
│
├── services/                   # Camada de comunicação com API
│   └── api.js                     # Configuração Axios e interceptores
│
└── utils/                      # Funções utilitárias
    └── pdfGenerator.js            # Engine de geração de documentos PDF
```

---

## Componentes Funcionais

### Wizard de Agendamento
Fluxo assistido para reserva de horários, adaptando-se dinamicamente ao perfil do usuário conectado.

**Funcionalidades:**
- Visualização de disponibilidade em tempo real.
- Bloqueio automatizado de horários ocupados.
- Diferenciação visual entre modalidades presencial e telemedicina.

### Navegação Dinâmica (Sidebar)
O menu lateral ajusta automaticamente seus itens de acordo com as permissões do perfil (RBAC).

| Recurso | Administrador | Recepção | Médico | Paciente |
|:-----|:--------:|:-----------:|:-------:|:----------:|
| Hub Operacional | Permitido | Permitido | Negado | Negado |
| Agenda Global | Permitido | Permitido | Negado | Negado |
| Atendimento | Negado | Negado | Permitido | Negado |
| Prontuários | Permitido | Negado | Permitido | Negado |
| Histórico Pessoal | Negado | Negado | Negado | Permitido |

---

## Arquitetura de Rotas

O sistema utiliza um wrapper de segurança (`ProtectedRoute`) que valida o perfil do usuário antes de permitir o acesso a rotas específicas.

| Rota | Perfis com Acesso |
|:-----|:-----------------|
| `/dashboard` | Paciente |
| `/dashboard-profissional` | Médico, Administrador |
| `/dashboard-staff` | Recepção, Administrador |
| `/atendimento` | Médico, Administrador |
| `/usuarios` | Administrador |

---

## Integração de Dados

A comunicação com o backend é centralizada na camada de serviços, garantindo que todas as requisições incluam os tokens de autenticação necessários e tratem erros de sessão de forma automatizada.

**Fluxo de Dados:**
1. Componente React solicita ação.
2. Serviço `api.js` injeta token JWT.
3. Servidor processa e retorna dados.
4. Interceptor trata respostas (ex: auto-logout em caso de token expirado).

---

## Referência de Acesso (Teste)

Senha universal: **`123456`**

| Perfil | E-mail de Teste | Escopo de Visualização |
|:-------|:-------|:---------|
| Administrador | `admin@clinica.com` | Visão panorâmica e gestão de contas. |
| Médico | `ana.silva@clinica.com` | Atendimento e gestão de pacientes. |
| Paciente | `maria.santos@email.com` | Agendamentos e histórico de saúde. |
| Recepção | `recepcao@clinica.com` | Hub operacional e agenda global. |

---

<p align="center">
  Desenvolvido para <strong>Clínica Vita</strong> — VitalHub Enterprise Platform v2.0
</p>
