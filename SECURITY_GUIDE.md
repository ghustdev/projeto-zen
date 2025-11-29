# 🔒 Guia de Segurança - Projeto Zen

## ✅ Correções Implementadas

### 1. **Chave da API Protegida**
- ❌ **Antes**: Chave exposta no frontend (`VITE_GEMINI_API_KEY`)
- ✅ **Agora**: Chave segura no backend (`.env.server`)

### 2. **Arquitetura Segura**
```
Frontend (React) → Backend (Express) → Google Gemini API
     ↓                    ↓                    ↓
Sem chaves API    Chave protegida      API segura
```

### 3. **Tratamento de Erros Melhorado**
- Erros específicos por tipo (400, 429, 500)
- Mensagens user-friendly
- Logs detalhados para debug
- Não exposição de detalhes internos

### 4. **Medidas de Segurança Adicionais**
- Rate limiting (100 req/15min por IP)
- CORS configurado
- Validação de entrada robusta
- Sanitização de dados
- Safety settings do Gemini ativadas

## 🚀 Como Executar com Segurança

### 1. **Configurar Backend**
```bash
cd src/components
npm install
```

### 2. **Configurar Variáveis de Ambiente**
Crie `.env.server`:
```env
GEMINI_API_KEY=sua_chave_aqui
PORT=3001
NODE_ENV=development
```

### 3. **Iniciar Serviços**
```bash
# Terminal 1 - Backend
cd src/components
npm start

# Terminal 2 - Frontend  
npm run dev
```

## 🔐 Boas Práticas Implementadas

### ✅ **Nunca Commitar**
- `.env.server` (chaves da API)
- `.env.local` 
- `logs/` (arquivos de log)

### ✅ **Validações de Segurança**
- Limite de caracteres (2000)
- Sanitização de entrada
- Timeout de requests (30s)
- Content filtering ativo

### ✅ **Monitoramento**
- Logs estruturados
- Health check endpoint (`/health`)
- Status de conexão em tempo real

## 🚨 Alertas de Segurança

### ⚠️ **Para Produção**
1. Use HTTPS sempre
2. Configure CORS para domínio específico
3. Implemente autenticação se necessário
4. Use variáveis de ambiente do provedor
5. Configure rate limiting mais restritivo

### ⚠️ **Monitoramento**
- Monitore uso da API Gemini
- Acompanhe logs de erro
- Verifique tentativas de abuso

## 📋 Checklist de Segurança

- [x] Chave da API removida do frontend
- [x] Backend com autenticação segura
- [x] Rate limiting implementado
- [x] CORS configurado
- [x] Validação de entrada
- [x] Tratamento de erros específico
- [x] Safety settings ativadas
- [x] Logs de segurança
- [x] .gitignore atualizado
- [x] Documentação de segurança

## 🔧 Troubleshooting

### Erro: "API key not found"
```bash
# Verifique se .env.server existe
ls -la .env.server

# Verifique o conteúdo (sem mostrar a chave)
head -1 .env.server
```

### Erro: "CORS policy"
- Verifique se o backend está rodando na porta 3001
- Confirme a URL no `.env` do frontend

### Erro: "Rate limit exceeded"
- Aguarde 15 minutos ou reinicie o servidor
- Ajuste o limite em `server.js` se necessário