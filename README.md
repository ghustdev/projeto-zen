# 🧘 Zen - Plataforma de Saúde Mental e Desempenho Acadêmico

> **"Estude sem se destruir"** - Uma solução tecnológica para estudantes do ensino médio

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Latest-38B2AC.svg)](https://tailwindcss.com/)

## 📋 Sobre o Projeto

**Zen** é uma plataforma inovadora desenvolvida pela equipe **Monkeys com Aura** para o Hackathon Gemini - Google, focada em melhorar a saúde mental e o desempenho acadêmico de estudantes do ensino médio.

### 🎯 Objetivo
Reduzir a ansiedade e aumentar a performance escolar, integrando ferramentas de apoio psicológico e estudantil, com foco em gestão eficiente e fomento na participação de comunidades de apoio.

### 🔍 O Problema
Estudantes do ensino médio enfrentam:
- Sobrecarga emocional e pressão por resultados
- Ausência de educação emocional e autogestão
- Falta de acompanhamento psicológico acessível
- Maus hábitos de estudo e gestão de tempo
- Sono insuficiente e estresse contínuo

### ✨ Nossa Solução
Uma plataforma centralizada que oferece:
- **IA Terapêutica (Neura)** - Chatbot para apoio emocional
- **Ferramentas de Estudo** - Pomodoro e técnicas comprovadas
- **Monitoramento Emocional** - Check-ins diários e análises
- **Conexão Profissional** - Acesso a psicólogos voluntários
- **Educação Preventiva** - Conteúdo sobre saúde mental
- **Gamificação** - Sistema de recompensas por consistência

## 🚀 Funcionalidades Principais

### 🔹 Módulo de Bem-Estar/Saúde Mental
- **Questionário Diagnóstico** - Avaliação inicial de estresse, foco e sono
- **Chatbot Neura** - IA para apoio emocional e terapia
- **Check-in Emocional Diário** - Registro de humor e energia
- **Exercícios de Respiração** - Técnicas de regulação emocional

### 🔹 Módulo Educacional
- **Timer Pomodoro** - Sessões de estudo com pausas guiadas
- **Técnicas de Estudo** - Métodos cientificamente comprovados
- **Rotinas Inteligentes** - Planos personalizados de estudo
- **Análise de Desempenho** - Gráficos e métricas de progresso

### 🔹 Módulo de Integração Comunitária
- **Acesso a Psicólogos** - Conexão com profissionais voluntários
- **Comunidades de Apoio** - Integração com redes sociais
- **Sistema de Recompensas** - Gamificação por consistência

### 🔹 Módulo de Análise e Decisão
- **Dashboard Inteligente** - Visão geral do progresso
- **Relatórios para Escolas** - Dados agregados para tomada de decisão
- **Insights Personalizados** - Recomendações baseadas em dados

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de CSS

### UI/UX
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **Framer Motion** - Animações (implícito)

### Funcionalidades Avançadas
- **React Hook Form** - Gerenciamento de formulários
- **Local Storage** - Persistência de dados
- **PWA Ready** - Preparado para Progressive Web App

## 📁 Estrutura do Projeto

```
projeto-zen/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes base (Radix UI)
│   │   ├── BreathingExercise.tsx  # Exercícios de respiração
│   │   ├── ChatbotNeura.tsx       # IA terapêutica
│   │   ├── Dashboard.tsx          # Painel de controle
│   │   ├── EmotionalCheckIn.tsx   # Check-in diário
│   │   ├── Home.tsx               # Página inicial
│   │   ├── InitialQuestionnaire.tsx # Questionário diagnóstico
│   │   ├── MentalHealthEducation.tsx # Educação em saúde mental
│   │   ├── Navigation.tsx         # Navegação principal
│   │   ├── PomodoroTimer.tsx      # Timer de estudo
│   │   ├── PsychologistsAccess.tsx # Acesso a psicólogos
│   │   ├── Rewards.tsx            # Sistema de recompensas
│   │   └── StudyTechniques.tsx    # Técnicas de estudo
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx                    # Componente principal
│   └── main.tsx                   # Ponto de entrada
├── package.json
└── vite.config.ts
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/projeto-zen.git
cd projeto-zen
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse no navegador**
```
http://localhost:5173
```

### Build para Produção
```bash
npm run build
# ou
yarn build
```

## 🎮 Fluxo do Usuário

1. **Primeiro Acesso**
   - Questionário diagnóstico (1 minuto)
   - Identificação de níveis de estresse, foco e sono

2. **Uso Diário**
   - Check-in emocional: "Como você está hoje?"
   - Recomendações personalizadas baseadas no estado
   - Sessões de estudo com Pomodoro + pausas de regulação
   - Feedback positivo: "Parabéns, você avançou +1% hoje"

3. **Recursos Disponíveis**
   - Conversa com IA Neura para apoio emocional
   - Exercícios de respiração (2 minutos)
   - Acesso a conteúdo educativo
   - Conexão com psicólogos

## 🏆 Sistema de Gamificação

- **+10 pontos** - Check-in diário completo
- **+20 pontos** - Sessão de Pomodoro finalizada
- **+15 pontos** - Aula educativa concluída
- **+5 pontos** - Exercício de respiração

## 🎯 Público-Alvo

### Usuário Final
- **Estudantes do Ensino Médio** (15-18 anos)
- Foco em quem enfrenta dificuldades com saúde mental e desempenho acadêmico

### Cliente Pagador
- **Escolas Públicas e Particulares**
- **Redes de Ensino**
- **Governo/Secretarias de Educação**

### Stakeholders
- **Professores e Coordenadores**
- **Psicólogos Educacionais**
- **Pais e Responsáveis**

## 💼 Modelo de Negócio

### Fontes de Receita
- **SaaS (Software as a Service)** - Assinatura mensal/anual para escolas
- **Licenciamento Premium** - Direitos sobre a plataforma

### Canais de Distribuição
- App Store / Google Play
- Website institucional
- Parcerias diretas com escolas

## 🔮 Roadmap Futuro

- [ ] **Integração com Sistemas Escolares** - API para notas e frequência
- [ ] **Comunidades no Discord** - Grupos de apoio estudantil
- [ ] **IA Avançada** - Análise preditiva de burnout
- [ ] **Relatórios para Escolas** - Dashboard administrativo
- [ ] **App Mobile Nativo** - iOS e Android
- [ ] **Integração com Wearables** - Monitoramento de estresse

## 👥 Equipe - Monkeys com Aura

[Gustavo Cardoso Costa]()

- **Desenvolvimento Frontend** - Interface e experiência do usuário
- **Design UX/UI** - Experiência centrada no usuário
- **Pesquisa em Saúde Mental** - Base científica das funcionalidades
- **Estratégia de Produto** - Visão e roadmap

## 📊 Impacto Esperado

- **Redução da Ansiedade** - Ferramentas de regulação emocional
- **Melhoria no Desempenho** - Técnicas de estudo eficazes
- **Maior Acesso ao Ensino Superior** - Preparação mais eficiente
- **Prevenção de Burnout** - Identificação precoce de problemas
- **Cultura de Autocuidado** - Educação em saúde mental

## 🔗 Referências e Inspirações

- [Yana.ai](https://www.yana.ai/pt/home) - IA para saúde mental
- [Projeto Aprova](https://projeto-aprova.streamlit.app/) - Plataforma educacional
- [Forest App](https://www.forestapp.cc/) - Gamificação para foco
- [EduWell Tech](https://www.eduwelltech.org/) - Tecnologia educacional

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter pull requests.

---

<div align="center">
  <strong>🧘 Zen - Estude sem se destruir</strong><br>
  <em>Desenvolvido com ❤️ pela equipe Monkeys com Aura</em><br>
  <em>1° Edição de Hackathon Gemini - Google 2025</em>
</div>
