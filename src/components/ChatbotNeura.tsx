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
      text: 'Olá! Eu sou a Neura, psicóloga especializada em apoio a estudantes. Este é um espaço seguro e confidencial onde você pode compartilhar seus sentimentos, preocupações e desafios.\n\nEstou aqui para te ouvir sem julgamentos e oferecer técnicas baseadas em evidência científica. Como você está se sentindo hoje? 💜',
      sender: 'neura',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const quickReplies = [
    'Estou me sentindo ansioso(a)',
    'Preciso de dicas para focar',
    'Como lidar com pressão?',
    'Técnicas de respiração',
  ];

  const [apiError, setApiError] = useState<string | null>(null);

  const getGeminiResponse = useCallback(async (userMessage: string): Promise<string> => {
    // Fallback para garantir que a IA funcione
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyC0eH5OQ7_qajmT10vFEgdAHa0hE98Krcg';
    
    console.log('🔑 Verificando API Key:', API_KEY ? 'PRESENTE' : 'AUSENTE');
    console.log('🔑 Fonte da API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'ENV FILE' : 'FALLBACK');
    
    if (!API_KEY || API_KEY.trim() === '') {
      console.warn('❌ API Key não configurada. Usando respostas locais.');
      setApiError('Configure a API key para usar IA real');
      return getLocalResponse(userMessage);
    }
    
    console.log('✅ Tentando conectar com Gemini 2.5 Flash...');

    const systemPrompt = `Você é Neura, uma psicóloga clínica especializada em saúde mental de estudantes do ensino médio. Você trabalha na plataforma Zen.

🧠 SUA IDENTIDADE PROFISSIONAL:
- CRP ativo, 8 anos de experiência com adolescentes
- Especialização: TCC, Mindfulness, Neuropsicologia Educacional
- Abordagem: Humanizada, baseada em evidências, focada em soluções
- Tom: Empático mas profissional, acolhedor, esperançoso

🎯 DIRETRIZES TERAPÊUTICAS RIGOROSAS:
1. SEMPRE valide emoções antes de qualquer intervenção
2. Use reformulação e escuta ativa ("Entendo que você sente...")
3. Faça perguntas abertas para explorar ("Como isso afeta você?")
4. Ofereça técnicas práticas imediatas
5. Mantenha foco: saúde mental + desempenho acadêmico
6. Seja concisa: máximo 120 palavras por resposta
7. Use linguagem adolescente apropriada
8. Inclua 1-2 emojis sutis para conexão

🛠️ SEU ARSENAL TERAPÊUTICO:
- Respiração 4-7-8 (ansiedade aguda)
- Grounding 5-4-3-2-1 (ataques de pânico)
- Reestruturação cognitiva ("E se...? Então...")
- Técnica Pomodoro + pausas mindful
- Higiene do sono para estudantes
- Autocompaixão vs autocrítica
- Técnicas de motivação intrínseca

🚨 PROTOCOLOS DE SEGURANÇA:
- Risco de autolesão/suicídio → Encaminhe IMEDIATAMENTE para CVV (188) ou emergência
- Sintomas de transtornos → Sugira avaliação presencial
- Abuso/violência → Oriente sobre canais de denúncia
- Nunca diagnostique, apenas observe padrões

💡 ESTILO DE RESPOSTA:
- Inicie validando a emoção
- Normalize a experiência ("É muito comum...")
- Ofereça técnica prática
- Faça pergunta exploratória
- Termine com esperança/encorajamento

RESPONDA COMO NEURA, A PSICÓLOGA:`;

    try {
      console.log('🚀 Enviando requisição para Gemini...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n[MENSAGEM DO ESTUDANTE]: ${userMessage}\n\n[SUA RESPOSTA TERAPÊUTICA]:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro da API Gemini:', response.status, errorData);
        
        if (response.status === 400) {
          setApiError('Chave API inválida - verifique sua configuração');
        } else if (response.status === 403) {
          setApiError('API key sem permissão - verifique as configurações');
        } else {
          setApiError(`Erro da API: ${response.status}`);
        }
        
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Resposta inválida da API:', data);
        throw new Error('Resposta inválida da API');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      
      console.log('✅ Resposta recebida da IA:', aiResponse.substring(0, 100) + '...');
      
      // Limpa a resposta removendo prefixos desnecessários
      const cleanResponse = aiResponse
        .replace(/^\[SUA RESPOSTA TERAPÊUTICA\]:\s*/i, '')
        .replace(/^Neura:\s*/i, '')
        .trim();
      
      setApiError(null);
      console.log('🎉 IA funcionando perfeitamente!');
      return cleanResponse;
      
    } catch (error) {
      console.error('❌ Erro ao conectar com Gemini:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setApiError('Sem conexão com internet - usando modo local');
      } else {
        setApiError('IA temporariamente indisponível - usando modo local');
      }
      
      return getLocalResponse(userMessage);
    }
  }, []);

  const getLocalResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('ansio') || lowerMessage.includes('ansied')) {
      return 'Percebo que você está enfrentando ansiedade. Isso é muito comum entre estudantes e é uma resposta natural do seu corpo a situações desafiadoras. Vamos trabalhar isso juntos.\n\nPrimeiro, me conte: quando você sente mais ansiedade? Durante provas, ao estudar, ou em outros momentos? Enquanto isso, que tal praticarmos a respiração 4-7-8? Inspire por 4 segundos, segure por 7, expire por 8. Isso ativa seu sistema parassimpático e reduz a ansiedade imediatamente. 🌸';
    } else if (lowerMessage.includes('foco') || lowerMessage.includes('concentr')) {
      return 'Dificuldade de concentração é uma das queixas mais frequentes que recebo. Seu cérebro não está "quebrado" - ele só precisa das condições certas para funcionar.\n\nMe conte: o que mais te distrai quando tenta estudar? Pensamentos, barulhos, celular? Baseado na neurociência, posso te ensinar técnicas específicas como Pomodoro, técnicas de grounding, e como criar um ambiente ideal para foco. O importante é entender que concentração é uma habilidade que se treina! 📚';
    } else if (lowerMessage.includes('pressão') || lowerMessage.includes('stress') || lowerMessage.includes('estresse')) {
      return 'Sinto que você está carregando um peso grande nos ombros. A pressão acadêmica é real e seus sentimentos são completamente válidos. Muitos jovens passam por isso.\n\nVamos explorar: essa pressão vem mais de você mesmo, da família, ou da escola? Lembre-se: você é muito mais do que suas notas. Vou te ensinar técnicas para transformar essa pressão em motivação saudável, como dividir metas grandes em micro-objetivos e praticar autocompaixão. Você não precisa ser perfeito para ser valioso. 💪';
    } else if (lowerMessage.includes('triste') || lowerMessage.includes('deprimi')) {
      return 'Obrigada por compartilhar algo tão íntimo comigo. Sentir tristeza é parte da experiência humana, mas quando ela persiste, precisamos cuidar dela com carinho.\n\nMe conte: há quanto tempo você se sente assim? Algo específico aconteceu ou é uma sensação mais geral? Enquanto conversamos, lembre-se que buscar ajuda é um ato de coragem. Se esses sentimentos forem muito intensos, recomendo também conversar com um psicólogo presencial. Você não está sozinho(a) nessa jornada. 🌻';
    } else if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
      return 'O sono é fundamental para sua saúde mental e desempenho acadêmico! Durante o sono, seu cérebro consolida memórias e processa emoções.\n\nComo está sua rotina de sono? Você tem dificuldade para adormecer, acorda durante a noite, ou acorda cansado? Posso te ensinar técnicas de higiene do sono: evitar telas 1h antes de dormir, criar um ritual relaxante, manter horários regulares. Dormir bem não é luxo, é necessidade básica para seu bem-estar. 😴';
    } else {
      return 'Estou aqui para te ouvir com atenção total. Percebo que você quer compartilhar algo importante comigo.\n\nSinta-se à vontade para falar sobre qualquer coisa que esteja em sua mente - seus medos, preocupações, sonhos, ou simplesmente como foi seu dia. Não há julgamento aqui, apenas um espaço seguro para você se expressar. Como você está se sentindo neste exato momento? 💜';
    }
  };

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
    setApiError(null);

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
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, estou com dificuldades técnicas no momento. Mas estou aqui para você! Pode tentar novamente ou me contar como posso ajudar de outra forma? 💜',
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

  const isAiActive = !apiError && import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto fade-in">
        <Card className="h-[calc(100vh-8rem)] flex flex-col glass shadow-2xl border-[#E07B4F]/20">
          <CardHeader className="bg-gradient-to-r from-[#E07B4F] to-[#D4A373] text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Neura</CardTitle>
                  <CardDescription className="text-white/80">
                    Psicóloga especializada em estudantes
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAiActive ? (
                  <div className="flex items-center gap-1 text-green-200 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>IA Ativa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-200 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Modo Local</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#E07B4F] to-[#D4A373] text-white'
                        : 'glass-dark text-[#3D3833]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
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
                <div className="flex justify-start">
                  <div className="glass-dark rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-xs text-[#8B8378] ml-2">
                        {isAiActive ? 'Neura está analisando...' : 'Processando...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="space-y-2">
                <p className="text-sm text-[#8B8378] text-center">Temas que posso te ajudar:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      disabled={isTyping}
                      className="text-xs border-[#E07B4F]/20 hover:bg-[#FFF5ED] hover:border-[#E07B4F]/40 rounded-full disabled:opacity-50"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isTyping ? "Neura está digitando..." : "Compartilhe seus sentimentos..."}
                className="flex-1 border-[#E07B4F]/20 focus:border-[#E07B4F] rounded-full px-4 bg-white"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={isTyping || !inputValue.trim()}
                className="bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full disabled:opacity-50"
                size="icon"
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