import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Send, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'neura';
  timestamp: Date;
}

export function ChatbotNeura() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Oi! Sou a Neura, psicóloga especializada em ajudar estudantes como você. \n\nEste é nosso espaço para conversar sobre qualquer coisa que esteja na sua mente - estudos, ansiedade, pressão, relacionamentos, ou simplesmente como você está se sentindo.\n\nO que você gostaria de compartilhar comigo hoje? 💜',
      sender: 'neura',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 200);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Mantém scroll durante typing
  useEffect(() => {
    if (isTyping) {
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isTyping]);

  const quickReplies = [
    'Estou me sentindo ansioso(a)',
    'Preciso de dicas para focar',
    'Como lidar com pressão?',
    'Técnicas de respiração',
  ];

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Validação e sanitização de entrada
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .substring(0, 1000); // Limita tamanho
  };



  const getGeminiResponse = useCallback(async (userMessage: string): Promise<string> => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyC0eH5OQ7_qajmT10vFEgdAHa0hE98Krcg';
    
    const sanitizedMessage = sanitizeInput(userMessage);

    if (!API_KEY) {
      throw new Error('API Key não configurada');
    }

    const systemPrompt = `Você é Neura, uma psicóloga clínica especializada em saúde mental de estudantes do ensino médio. Você trabalha na plataforma Zen.

SUA PERSONALIDADE E ABORDAGEM:
- Psicóloga experiente com 8 anos trabalhando com adolescentes
- Especialista em TCC, Mindfulness e Neuropsicologia Educacional  
- Abordagem humanizada, empática e baseada em evidências científicas
- Tom acolhedor mas profissional, sempre esperançoso
- Use linguagem natural que adolescentes entendem
- Seja genuína e autêntica em cada resposta

COMO VOCÊ DEVE RESPONDER:
- Escute ativamente e valide as emoções do estudante
- Faça perguntas abertas para entender melhor a situação
- Ofereça técnicas práticas quando apropriado
- Mantenha foco na saúde mental e desempenho acadêmico
- Seja conversacional e natural, não robótica
- Use 1-2 emojis sutis quando fizer sentido
- Responda de forma personalizada para cada situação específica

IMPORTANTE:
- Se detectar risco de autolesão/suicídio, oriente para CVV (188) ou emergência
- Para sintomas graves, sugira avaliação presencial
- Nunca diagnostique, apenas observe e acolha
- Cada resposta deve ser única e contextualizada

Responda como Neura, de forma natural e conversacional:`;

    try {
      setConnectionStatus('connecting');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n[ESTUDANTE]: ${sanitizedMessage}\n\n[NEURA]:`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            candidateCount: 1
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        })
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      

      
      if (!data.candidates?.[0]?.content) {
        throw new Error('Resposta inválida da API');
      }
      
      const candidate = data.candidates[0];
      
      if (!candidate.content.parts?.[0]?.text) {
        throw new Error('IA não conseguiu gerar resposta');
      }
      
      const aiResponse = candidate.content.parts[0].text;
      
      const cleanResponse = aiResponse
        .replace(/^\[NEURA\]:\s*/i, '')
        .replace(/^Neura:\s*/i, '')
        .trim();
      
      setConnectionStatus('connected');
      return cleanResponse;
      
    } catch (error) {
      setConnectionStatus('error');
      console.error('❌ Erro Gemini:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Tempo limite excedido. Tente novamente.');
      }
      
      throw new Error('Erro de conexão com a IA. Verifique sua internet e tente novamente.');
    }
  }, []);

  const handleSend = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await getGeminiResponse(trimmedInput);
      
      const neuraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'neura',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, neuraResponse]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Ops! ${errorMessage}\n\nEnquanto isso, lembre-se: você pode sempre buscar ajuda presencial ou ligar para o CVV (188) se precisar de apoio imediato. Estou aqui quando conseguir me reconectar! 💜`,
        sender: 'neura',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, getGeminiResponse]);

  const handleQuickReply = useCallback((reply: string) => {
    if (!isTyping) {
      setInputValue(reply);
    }
  }, [isTyping]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5ED] to-[#F5F5DC] p-2 sm:p-4 pb-20">
      <div className="max-w-6xl mx-auto fade-in">
        <Card className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] flex flex-col glass shadow-2xl border-[#E07B4F]/20 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#E07B4F] via-[#D4A373] to-[#E07B4F] text-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold">Neura</CardTitle>
                  <CardDescription className="text-white/90 text-sm sm:text-base">
                    Sua psicóloga especializada 💜
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {connectionStatus === 'connected' && (
                  <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-200 text-xs font-medium hidden sm:inline">IA Ativa</span>
                  </div>
                )}
                {connectionStatus === 'connecting' && (
                  <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-spin" />
                    <span className="text-blue-200 text-xs font-medium hidden sm:inline">Conectando</span>
                  </div>
                )}
                {connectionStatus === 'error' && (
                  <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full">
                    <AlertCircle className="w-4 h-4 text-red-300" />
                    <span className="text-red-200 text-xs font-medium hidden sm:inline">Reconectando</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-3 sm:p-6 space-y-4 overflow-hidden bg-gradient-to-b from-white/50 to-white/80">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-4 py-3 sm:px-6 sm:py-4 shadow-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#E07B4F] to-[#D4A373] text-white shadow-[#E07B4F]/20'
                        : 'bg-white/90 backdrop-blur-sm text-[#3D3833] shadow-gray-200/50 border border-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.text}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-[#8B8378]'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-3 h-3 bg-[#D4A373] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-3 h-3 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-sm text-[#8B8378] ml-2 font-medium">
                        Neura está pensando...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="space-y-3 animate-in fade-in-50 duration-500">
                <p className="text-sm text-[#8B8378] text-center font-medium">💭 Temas que posso te ajudar:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      disabled={isTyping}
                      className="text-xs sm:text-sm border-[#E07B4F]/30 hover:bg-[#E07B4F] hover:text-white hover:border-[#E07B4F] rounded-full disabled:opacity-50 transition-all duration-200 shadow-sm"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-3 p-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isTyping ? "Neura está pensando..." : "Compartilhe seus sentimentos comigo... 💜"}
                className="flex-1 border-none focus:ring-0 rounded-xl px-4 py-3 bg-transparent text-sm sm:text-base placeholder:text-gray-400"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={isTyping || !inputValue.trim()}
                className="bg-gradient-to-r from-[#E07B4F] to-[#D4A373] hover:from-[#D4A373] hover:to-[#E07B4F] text-white rounded-xl px-4 py-3 disabled:opacity-50 transition-all duration-200 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}