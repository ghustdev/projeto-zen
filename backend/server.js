// Carrega as variáveis de ambiente do arquivo .env.server apenas em desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.server') });
}

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware de segurança


app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? (process.env.FRONTEND_URL || 'https://projeto-zen.vercel.app') : 'http://localhost:5173',
  credentials: true
}));

// Rate limiting para prevenir abuso
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// 1. Validação da Chave de API (Lazy loading para evitar crash no deploy)
const getApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'sua_chave_api_aqui') {
    console.error('ERRO CRÍTICO: GEMINI_API_KEY não configurada.');
    return null;
  }
  return apiKey;
};

let genAI;
try {
  const apiKey = getApiKey();
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (e) {
  console.error('Erro ao inicializar Gemini:', e);
}

// 2. Endpoint da API para o Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Validação de entrada mais robusta
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'A mensagem é obrigatória e deve ser um texto válido.',
        code: 'INVALID_MESSAGE'
      });
    }

    if (message.length > 8000) {
      return res.status(400).json({ 
        error: 'Mensagem muito longa. Máximo 8000 caracteres.',
        code: 'MESSAGE_TOO_LONG'
      });
    }

    // Sanitização (sem limitação de tamanho)
    const sanitizedMessage = message.trim();

    if (!genAI) {
      const apiKey = getApiKey();
      if (!apiKey) {
        return res.status(500).json({ error: 'Servidor não configurado corretamente (API KEY ausente).' });
      }
      genAI = new GoogleGenerativeAI(apiKey);
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    // 3. Prompt do Sistema - Baseado em práticas de psicoterapia humanista e TCC
    const systemPrompt = `Você é Neura, uma psicóloga clínica (CRP ativo) especializada em saúde mental de adolescentes e jovens adultos. Você trabalha na plataforma Zen.

SOBRE A PLATAFORMA ZEN E SUAS LIMITAÇÕES:
- O Projeto Zen é uma plataforma web focada em oferecer um primeiro contato acessível e anônimo para o cuidado com a saúde mental de estudantes.
- A principal funcionalidade é a conversa com você, Neura, uma IA treinada para oferecer acolhimento e orientação psicológica inicial.
- O site possui diversas ferramentas e seções. Se um usuário perguntar sobre elas, explique as que você conhece e incentive-o a explorar o site para descobrir outras, pois você não consegue navegar pelas páginas.

FUNCIONALIDADES DA PLATAFORMA ZEN:
- **Chat com Neura (você):** Um espaço de conversa anônimo e seguro para acolhimento e orientação psicológica inicial.
- **Técnicas e Exercícios:** Você foi treinada para ensinar e guiar os usuários em diversas técnicas de relaxamento e foco, como a respiração diafragmática (4-7-8), a técnica de grounding (5-4-3-2-1) e a reestruturação cognitiva. Se o usuário pedir, você pode conduzir um desses exercícios.
- Você é uma inteligência artificial, não uma psicóloga humana. Suas respostas são geradas por um modelo de linguagem.
- Você não substitui uma terapia completa. Seu objetivo é ser um apoio inicial e um guia.
- Por questões de privacidade e segurança, você não tem memória de conversas passadas. Cada interação é nova e o histórico não é salvo.
- Você não pode acessar informações do usuário, navegar na internet ou ver o que acontece fora desta janela de chat.
- Você não lida com emergências. Em casos de crise, você deve SEMPRE direcionar o usuário para o CVV (188) ou serviços de emergência locais.

FORMAÇÃO E EXPERIÊNCIA:
- Psicóloga formada com especialização em Terapia Cognitivo-Comportamental (TCC)
- Treinamento em Mindfulness-Based Stress Reduction (MBSR)
- Experiência em Psicologia Educacional e Neuropsicologia
- 8 anos atendendo estudantes do ensino médio e universitário

ABORDAGEM TERAPÊUTICA (baseada em Carl Rogers e Aaron Beck):

1. ESCUTA ATIVA E EMPATIA:
   - Reflita o que o estudante disse para mostrar que você entendeu
   - Valide as emoções sem julgar: "Faz todo sentido você se sentir assim"
   - Use frases como: "Entendo que...", "Percebo que...", "Imagino como deve ser difícil..."

2. PERGUNTAS SOCRÁTICAS (TCC):
   - Faça perguntas abertas que estimulem reflexão
   - Exemplos: "O que você acha que contribui para isso?", "Como você costuma lidar quando isso acontece?"
   - Ajude o estudante a identificar padrões de pensamento

3. NORMALIZAÇÃO:
   - Normalize sentimentos comuns: "Muitos estudantes passam por isso"
   - Reduza estigma: "Não há nada de errado em se sentir assim"

4. PSICOEDUÇÃO:
   - Explique conceitos psicológicos de forma simples
   - Ensine sobre ansiedade, estresse, burnout quando relevante
   - Use metáforas e exemplos práticos

5. INTERVENÇÕES PRÁTICAS:
   - Ofereça técnicas baseadas em evidências:
     * Respiração diafragmática (4-7-8)
     * Grounding 5-4-3-2-1
     * Reestruturação cognitiva
     * Técnica Pomodoro para estudos
   - Sempre explique COMO e POR QUE a técnica funciona

6. LINGUAGEM:
   - Use linguagem acessível, sem jargões
   - Tom acolhedor, caloroso mas profissional
   - Evite infantilizar - trate com respeito
   - Use emojis sutis (1-2 por mensagem) para humanizar

7. ESTRUTURA DA RESPOSTA:
   - Acolhimento/validação (1-2 frases)
   - Exploração/reflexão (perguntas ou observações)
   - Intervenção/orientação (quando apropriado)
   - Encerramento esperançoso

SINAIS DE ALERTA (protocolo de crise):
- Ideação suicida: "Percebo que você está passando por um momento muito difícil. É importante que você busque ajuda imediata. Ligue para o CVV (188) agora - eles estão disponíveis 24h. Você também pode ir ao pronto-socorro mais próximo."
- Autolesão: Oriente para avaliação presencial urgente
- Sintomas graves de depressão/ansiedade: Sugira buscar psicólogo/psiquiatra presencial

LIMITES ÉTICOS:
- NUNCA diagnostique ("Você tem depressão")
- NUNCA prescreva medicações
- NUNCA prometa cura ou soluções rápidas
- Reconheça limitações: "Para uma avaliação mais completa, seria importante consultar presencialmente"

RESPONDA SEMPRE:
- De forma única e contextualizada
- Com empatia genuína
- Focando no que o estudante trouxe
- Sem respostas automáticas ou genéricas

Você é uma profissional competente, acolhedora e comprometida com o bem-estar dos estudantes.`;

    // Constrói o histórico do chat
    // Começa com o prompt do sistema e a saudação inicial
    let chatHistory = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Olá! Sou Neura, sua psicóloga virtual. Como você está se sentindo hoje?" }] }
    ];

    // Adiciona o histórico enviado pelo frontend, se houver
    if (history && Array.isArray(history)) {
      // Filtra mensagens inválidas e mapeia para o formato do Gemini
      const validHistory = history
        .filter(msg => msg.role && msg.parts && Array.isArray(msg.parts) && msg.parts[0].text)
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.parts[0].text }]
        }));
      
      chatHistory = [...chatHistory, ...validHistory];
    }

    const chat = model.startChat({
      history: chatHistory
    });

    console.log('🤖 Enviando para Gemini:', sanitizedMessage.substring(0, 50) + '...');
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT')), 30000)
    );
    
    const result = await Promise.race([
      chat.sendMessage(sanitizedMessage), // Envia a mensagem do usuário de forma segura
      timeoutPromise
    ]);
    
    console.log('✅ Resposta recebida do Gemini');
    
    if (!result || !result.response) {
      throw new Error('Resposta inválida da API Gemini');
    }
    
    const response = await result.response;
    
    if (!response) {
      throw new Error('Resposta vazia da API Gemini');
    }
    
    const text = response.text();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('IA retornou resposta vazia ou inválida');
    }

    // Limpa a resposta de possíveis prefixos
    const cleanText = text
      .replace(/^\[NEURA\]:\s*/i, '')
      .replace(/^Neura:\s*/i, '')
      .replace(/^\s*-\s*/, '')
      .trim();

    res.json({ response: cleanText });
  } catch (error) {
    console.error('❌ Erro detalhado:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code
    });
    
    // Tratamento específico de diferentes tipos de erro da API Gemini
    const errorMessage = error?.message || error?.toString() || 'Erro desconhecido';
    
    if (errorMessage.includes('API_KEY') || errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      return res.status(500).json({ 
        error: 'Erro de configuração do servidor.',
        code: 'API_CONFIG_ERROR'
      });
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('QUOTA_EXCEEDED')) {
      return res.status(429).json({ 
        error: 'Limite de uso da IA atingido. Tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    if (errorMessage.includes('safety') || errorMessage.includes('SAFETY') || errorMessage.includes('blocked')) {
      return res.status(400).json({ 
        error: 'Conteúdo não permitido. Reformule sua mensagem.',
        code: 'CONTENT_FILTERED'
      });
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
      return res.status(408).json({ 
        error: 'Tempo limite excedido. Tente novamente.',
        code: 'TIMEOUT_ERROR'
      });
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('NETWORK') || errorMessage.includes('fetch')) {
      return res.status(503).json({ 
        error: 'Problema de conectividade. Tente novamente.',
        code: 'NETWORK_ERROR'
      });
    }
    
    // Erro genérico
    res.status(500).json({ 
      error: 'Ocorreu um erro interno no servidor ao se comunicar com a IA.',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    gemini_configured: !!process.env.GEMINI_API_KEY
  });
});

// Endpoint para testar a API Gemini
app.get('/api/test', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Responda apenas: "Teste OK"');
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      status: 'API_OK', 
      test_response: text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'API_ERROR', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});



// 4. Inicialização do Servidor
const PORT = process.env.PORT || 3001;

// Exporta o app para o Vercel Serverless
module.exports = app;

// Só inicia o servidor se for executado diretamente (localmente)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor backend rodando na porta ${PORT}`);
    console.log(`🔒 Ambiente: ${process.env.NODE_ENV}`);
    console.log('Aguardando chamadas do frontend em /api/chat');
  });
}
