import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'neura';
  timestamp: Date;
}

export function ChatbotNeura() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Eu sou a Neura, sua assistente de apoio emocional. Como posso ajudar você hoje? 💜',
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
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'Estou me sentindo ansioso(a)',
    'Preciso de dicas para focar',
    'Como lidar com pressão?',
    'Técnicas de respiração',
  ];

  const getNeuraResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('ansio') || lowerMessage.includes('ansied')) {
      return 'Entendo que você está se sentindo ansioso(a). A ansiedade é uma resposta natural, mas podemos trabalhar isso juntos. Que tal começarmos com uma técnica de respiração 4-7-8? Inspire por 4 segundos, segure por 7, expire por 8. Repita 3 vezes. Quer que eu te guie? 🌸';
    } else if (lowerMessage.includes('foco') || lowerMessage.includes('concentr')) {
      return 'Dificuldade de foco é super comum! Algumas dicas: 1) Use a técnica Pomodoro (25 min foco + 5 min pausa), 2) Elimine distrações (celular em outro cômodo), 3) Estude no mesmo horário sempre, 4) Durma bem. Qual dessas você gostaria de explorar mais? 📚';
    } else if (lowerMessage.includes('pressão') || lowerMessage.includes('stress') || lowerMessage.includes('estresse')) {
      return 'A pressão acadêmica é real e válida. Lembre-se: você é mais do que suas notas. Vamos trabalhar em estratégias: dividir grandes tarefas em micro-metas, celebrar pequenas vitórias, e praticar auto-compaixão. O que te estressa mais especificamente? 💪';
    } else if (lowerMessage.includes('respiração') || lowerMessage.includes('respir')) {
      return 'Ótima escolha! A respiração consciente é uma ferramenta poderosa. Experimente a técnica 4-7-8: inspire pelo nariz por 4 segundos, segure por 7, expire pela boca por 8. Isso ativa seu sistema nervoso parassimpático e reduz ansiedade. Pratique 3 vezes agora! 🌬️';
    } else if (lowerMessage.includes('triste') || lowerMessage.includes('deprimi')) {
      return 'Sinto muito que você esteja passando por isso. Seus sentimentos são válidos. É importante conversar com alguém de confiança - um amigo, familiar ou profissional. Posso te conectar com nossos psicólogos parceiros. Enquanto isso, pequenas ações ajudam: sair ao sol, mover o corpo, ouvir música. Vamos juntos? 🌻';
    } else if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu')) {
      return 'Por nada! Estou aqui sempre que precisar. Lembre-se: cuidar da sua saúde mental é tão importante quanto estudar. Você está no caminho certo! 💜✨';
    } else if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
      return 'O sono é fundamental para memória e aprendizado! Dicas: durma 7-9h, evite telas 1h antes de dormir, mantenha o quarto escuro e fresco, tenha uma rotina regular. Dormir bem = estudar melhor. Qual é seu maior desafio com o sono? 😴';
    } else {
      return 'Entendo. Conte-me mais sobre isso. Como você está se sentindo agora? Estou aqui para ouvir e ajudar no que precisar. 💜';
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const neuraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getNeuraResponse(inputValue),
        sender: 'neura',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, neuraResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto fade-in">
        <Card className="h-[calc(100vh-8rem)] flex flex-col glass shadow-2xl border-[#E07B4F]/20">
          <CardHeader className="bg-gradient-to-r from-[#E07B4F] to-[#D4A373] text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Neura</CardTitle>
                <CardDescription className="text-white/80">
                  Sua assistente de apoio emocional
                </CardDescription>
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
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#E07B4F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <Button
                  key={reply}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs border-[#E07B4F]/20 hover:bg-[#FFF5ED] hover:border-[#E07B4F]/40 rounded-full"
                >
                  {reply}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 border-[#E07B4F]/20 focus:border-[#E07B4F] rounded-full px-4 bg-white"
              />
              <Button
                onClick={handleSend}
                className="bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full"
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