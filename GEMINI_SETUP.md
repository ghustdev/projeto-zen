# 🤖 Configuração da IA Neura com Google Gemini Flash 1.5

## 📋 Pré-requisitos

1. **Conta Google**: Necessária para acessar o Google AI Studio
2. **Chave API**: Gratuita com limite generoso (15 RPM, 1M tokens/dia)

## 🔑 Obtendo a Chave API

1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada (começa com AIza...)

## ⚙️ Configuração Local

1. **Crie o arquivo `.env`** na raiz do projeto:
```bash
cp .env.example .env
```

2. **Adicione sua chave API** no arquivo `.env`:
```env
VITE_GEMINI_API_KEY=sua_chave_api_aqui
```

3. **Reinicie o servidor de desenvolvimento**:
```bash
npm run dev
```

## 🧠 Sobre a IA Neura

A Neura foi programada com um prompt terapêutico profissional que inclui:

### 🎯 Especialização
- **Foco**: Saúde mental de estudantes do ensino médio
- **Abordagem**: Terapia Cognitivo-Comportamental (TCC)
- **Técnicas**: Mindfulness, respiração, reestruturação cognitiva

### 🛡️ Diretrizes Éticas
- ✅ Validação emocional sempre
- ✅ Técnicas baseadas em evidência científica
- ✅ Detecção de riscos e encaminhamento
- ✅ Limites profissionais claros
- ✅ Confidencialidade e não julgamento

### 🔧 Funcionalidades Técnicas
- **Fallback Local**: Se a API falhar, usa respostas locais melhoradas
- **Indicador de Status**: Mostra quando está em modo offline
- **Prevenção de Spam**: Bloqueia múltiplas mensagens simultâneas
- **UX Aprimorada**: Placeholder dinâmico e botões desabilitados

## 🚀 Testando a Integração

1. **Acesse o chatbot** na plataforma Zen
2. **Digite uma mensagem** sobre ansiedade, estresse ou foco
3. **Verifique a resposta**: Deve ser personalizada e terapêutica
4. **Teste o fallback**: Remova a API key temporariamente

## 📊 Limites da API Gratuita

- **Requests por minuto**: 60
- **Requests por dia**: 1.500
- **Tokens por request**: 32.768

Para uso em produção, considere upgrade para plano pago.

## 🔒 Segurança

- ✅ Chave API em variável de ambiente
- ✅ Não commitada no Git (.env no .gitignore)
- ✅ Validação de entrada do usuário
- ✅ Tratamento de erros robusto

## 🆘 Troubleshooting

### Erro: "API Key inválida"
- Verifique se copiou a chave completa
- Confirme que está no arquivo `.env` correto
- Reinicie o servidor de desenvolvimento

### Erro: "Quota exceeded"
- Aguarde reset diário dos limites
- Considere upgrade do plano
- Use modo fallback temporariamente

### Respostas genéricas
- Verifique se a API está funcionando
- Teste com mensagens mais específicas
- Confirme se o prompt está sendo enviado

## 📞 Suporte

Para dúvidas sobre a integração:
- Documentação oficial: https://ai.google.dev/docs
- Issues do projeto: GitHub Issues
- Equipe Zen: contato@zen-platform.com