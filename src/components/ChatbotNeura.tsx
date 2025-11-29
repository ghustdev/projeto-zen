import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
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
      text: 'Olá! 💜 Sou a Neura, sua psicóloga aqui na plataforma Zen.\n\nEste é um espaço seguro e confidencial onde você pode falar livremente sobre o que está sentindo. Não há julgamentos aqui, apenas acolhimento.\n\nComo você está se sentindo hoje?',
      sender: 'neura',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Ajusta a altura do textarea e rola a tela para baixo ao digitar
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reseta a altura para calcular o novo scrollHeight
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // O mesmo valor do max-h-[200px]
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;

      // Rola a janela para o final para manter o input visível
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [inputValue]);

  const quickReplies = [
    '😟 Estou ansioso(a)',
    '📚 Dificuldade para focar',
    '😓 Muita pressão',
    '🌿 Preciso relaxar',
    '😔 Me sinto sobrecarregado(a)',
    '💬 Só quero conversar',
  ];

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Validação e sanitização de entrada
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .substring(0, 8000); // Limita tamanho
  };





  const getGeminiResponse = useCallback(async (userMessage: string): Promise<string> => {
    const sanitizedMessage = sanitizeInput(userMessage);

    try {
      setConnectionStatus('connecting');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduzido para 15s
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      console.log('🔗 API Base URL:', apiBaseUrl); // Debug
      

      
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({ message: sanitizedMessage })
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro API:', response.status, errorData);
        
        // Para erros de servidor, propaga o erro
        if (response.status >= 500) {
          throw new Error('Nosso servidor está com problemas. Tente novamente em alguns minutos.');
        }
        
        if (response.status === 429) {
          throw new Error('Muitas mensagens enviadas. Aguarde um momento antes de tentar novamente.');
        }
        
        // Tratamento específico de erros do cliente
        switch (response.status) {
          case 400:
            if (errorData.code === 'MESSAGE_TOO_LONG') {
              throw new Error('Sua mensagem é muito longa. Tente ser mais conciso.');
            }
            if (errorData.code === 'CONTENT_FILTERED') {
              throw new Error('Por favor, reformule sua mensagem de forma mais adequada.');
            }
            throw new Error('Mensagem inválida. Verifique o que você digitou.');
          default:
            throw new Error('Não foi possível conectar com a IA. Verifique sua conexão.');
        }
      }

      const data = await response.json();
      
      if (!data?.response || typeof data.response !== 'string' || data.response.trim().length === 0) {
        throw new Error('A IA não conseguiu gerar uma resposta. Tente reformular sua mensagem.');
      }
      
      const cleanResponse = data.response
        .replace(/^\[NEURA\]:\s*/i, '')
        .replace(/^Neura:\s*/i, '')
        .replace(/^\s*-\s*/, '')
        .trim();
      
      setConnectionStatus('connected');
      return cleanResponse;
      
    } catch (error) {
      console.error('❌ Erro na comunicação:', error);
      setConnectionStatus('error');
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('A conexão demorou muito para responder. Tente novamente.');
      }
      
      // Propaga todos os erros para o usuário
      throw error instanceof Error ? error : new Error('Erro inesperado na comunicação com a IA.');
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
      
      let errorMessage = 'Erro inesperado';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#FFF5ED] to-[#F5F5DC]">
      {/* Cabeçalho Fixo */}
      <header className="bg-gradient-to-r from-[#E07B4F] via-[#D4A373] to-[#E07B4F] text-white p-4 sm:p-6 shadow-md z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold">Neura</CardTitle>
                  <CardDescription className="text-white/90 text-sm sm:text-base">
                    Psicóloga especializada em estudantes 🎓
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
      </header>

      {/* Conteúdo Principal do Chat */}
      <main className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
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
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words">{message.text}</p>
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

        {/* Área de Input e Respostas Rápidas */}
        <div className="px-4 sm:px-6 pb-4 fade-in">
            {messages.length <= 1 && (
              <div className="space-y-3 animate-in fade-in-50 duration-500">
                <p className="text-sm text-[#8B8378] text-center font-medium">💜 Como posso te ajudar hoje?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-3xl mx-auto mb-4">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      disabled={isTyping}
                      className="text-xs sm:text-sm border-[#E07B4F]/30 hover:bg-[#E07B4F] hover:text-white hover:border-[#E07B4F] rounded-2xl disabled:opacity-50 transition-all duration-200 shadow-sm h-auto py-3 px-3"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

          <div className="relative max-w-3xl mx-auto w-full">
              <div className="flex items-end gap-2 p-3 bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isTyping ? "Neura está pensando..." : "Envie uma mensagem..."}
                  disabled={isTyping}
                  rows={1}
                  className="flex-1 resize-none border-none focus:outline-none focus:ring-0 bg-transparent text-sm sm:text-base placeholder:text-gray-400 max-h-[200px] overflow-y-auto py-3 px-2"
                />
                <Button
                  onClick={handleSend}
                  disabled={isTyping || !inputValue.trim()}
                  size="icon"
                  className="bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full h-10 w-10 flex-shrink-0 disabled:opacity-30 disabled:bg-gray-300 transition-all duration-200 mb-1"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              {inputValue.length > 0 && (
                <div className="absolute -top-6 right-2 text-xs text-gray-400">
                  {inputValue.length}/8000
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
}