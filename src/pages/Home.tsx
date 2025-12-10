import { useMemo, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MessageCircle, Users, BookOpen, GraduationCap, Timer, Heart, Wind, Award, Sparkles, ArrowRight } from 'lucide-react';
import type { Page, UserData } from '../App';

interface HomeProps {
  userData: UserData;
  onNavigate: (page: Page) => void;
}



export function Home({ userData, onNavigate }: HomeProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const hasCheckedInToday = useMemo(() => 
    userData.checkIns?.some(c => c.date === today) || false, 
    [userData.checkIns, today]
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const quickActions = useMemo(() => [
    {
      id: 'chatbot' as Page,
      icon: MessageCircle,
      title: 'Conversar com Neura',
      description: 'IA terapêutica para apoio emocional',
      gradient: 'from-[#E07B4F] to-[#D4A373]',
    },
    {
      id: 'check-in' as Page,
      icon: Heart,
      title: 'Check-in Diário',
      description: 'Como você está se sentindo?',
      gradient: 'from-[#D4A373] to-[#F2CC8F]',
    },
    {
      id: 'pomodoro' as Page,
      icon: Timer,
      title: 'Começar Estudo',
      description: 'Pomodoro com pausas guiadas',
      gradient: 'from-[#81B29A] to-[#6B9D84]',
    },
    {
      id: 'breathing' as Page,
      icon: Wind,
      title: 'Respirar',
      description: 'Exercício de 2 minutos',
      gradient: 'from-[#F2CC8F] to-[#E8DFD5]',
    },
  ], []);

  const resources = useMemo(() => [
    {
      id: 'mental-health' as Page,
      icon: BookOpen,
      title: 'Saúde Mental',
      description: 'Aprenda sobre autocuidado',
      color: 'bg-[#FFF5ED]',
    },
    {
      id: 'study-techniques' as Page,
      icon: GraduationCap,
      title: 'Técnicas de Estudo',
      description: 'Métodos comprovados',
      color: 'bg-[#F5EDE4]',
    },
    {
      id: 'psychologists' as Page,
      icon: Users,
      title: 'Psicólogos',
      description: 'Conecte-se com profissionais',
      color: 'bg-[#FDFAF6]',
    },
    {
      id: 'rewards' as Page,
      icon: Award,
      title: 'Recompensas',
      description: 'Suas conquistas',
      color: 'bg-[#FFF5ED]',
    },
  ], []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {/* Hero Section */}
        <div className="relative mb-12 fade-in">
          <div className="glass rounded-3xl p-8 md:p-12 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E07B4F]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A373]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src="/Logo-principal.png" alt="Zen Logo" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                    <h1 className="text-6xl font-bold text-[#E07B4F] font-display">
                      Zen
                    </h1>
                  </div>
                  <p className="text-lg text-[#8B8378]">{getGreeting()}, bem-vindo de volta</p>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl text-[#3D3833] mb-4 max-w-3xl">
                Seu espaço seguro para crescer sem se destruir
              </h2>
              
              <p className="text-lg text-[#8B8378] max-w-2xl mb-8">
                Cuidamos da sua saúde mental e desempenho acadêmico com ferramentas inteligentes, 
                apoio profissional e uma comunidade que entende você.
              </p>

              <div className="flex flex-wrap gap-4">
                {!hasCheckedInToday && (
                  <Button 
                    onClick={() => onNavigate('check-in')}
                    size="lg"
                    className="bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full px-8 shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Fazer Check-in
                  </Button>
                )}
                <Button 
                  onClick={() => onNavigate('dashboard')}
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-[#E07B4F]/20 hover:bg-[#FFF5ED] cursor-pointer hover:scale-105 transition-transform"
                >
                  Ver Meu Progresso
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 stagger-children">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-[#E07B4F]" />
            <h3 className="text-2xl text-[#3D3833]">Ações Rápidas</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="glass-dark rounded-2xl p-6 text-left hover-lift group cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg text-[#3D3833] mb-2">{action.title}</h4>
                  <p className="text-sm text-[#8B8378]">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personalized Insight */}
        {(userData.stressLevel || 0) >= 7 && (
          <div className="mb-12 fade-in">
            <div className="glass-dark rounded-2xl p-6 border-l-4 border-[#E07B4F]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E07B4F]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#E07B4F]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg text-[#3D3833] mb-2">Percebemos que você está estressado</h4>
                  <p className="text-[#8B8378] mb-4">
                    Que tal começar com uma respiração guiada de 2 minutos? Isso vai te ajudar a acalmar a mente antes de estudar.
                  </p>
                  <Button 
                    onClick={() => onNavigate('breathing')}
                    className="bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full cursor-pointer hover:scale-105 transition-transform"
                  >
                    Começar Agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Section - Banner Style */}
        <div className="mb-12 stagger-children">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="glass rounded-2xl p-8 relative overflow-hidden group hover-lift">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E07B4F]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <img src="/Avatar-meditando-sem-fundo.png" alt="Avatar Challenge" className="mb-4" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                <h3 className="text-2xl text-[#3D3833] mb-3">O Desafio</h3>
                <p className="text-[#8B8378] leading-relaxed">
                  Ansiedade, pressão por notas e expectativas criam um ambiente estressante que afeta diretamente 
                  seu desempenho. Quando você vive sob estresse contínuo, seu cérebro perde capacidade de foco e memória.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="glass rounded-2xl p-8 relative overflow-hidden group hover-lift">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#81B29A]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <img src="/Avatar-estudando-sem-fundo.png" alt="Avatar Studying" className="mb-4" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                <h3 className="text-2xl text-[#3D3833] mb-3">Nossa Solução</h3>
                <p className="text-[#8B8378] leading-relaxed">
                  Integramos apoio psicológico, técnicas de estudo comprovadas e ferramentas de gestão emocional 
                  em uma plataforma acolhedora. Porque saúde mental estável significa desempenho acadêmico consistente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="stagger-children">
          <h3 className="text-2xl text-[#3D3833] mb-6">Explore Nossos Recursos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card
                  key={resource.id}
                  className={`${resource.color} border-[#E07B4F]/10 hover-lift cursor-pointer group overflow-hidden relative hover:scale-105 transition-transform`}
                  onClick={() => onNavigate(resource.id)}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#E07B4F]/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-[#E07B4F]" />
                    </div>
                    <CardTitle className="text-lg text-[#3D3833]">{resource.title}</CardTitle>
                    <CardDescription className="text-[#8B8378]">{resource.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mt-12 glass-dark rounded-2xl p-8">
          <h3 className="text-xl text-[#3D3833] mb-6 text-center">Seu Progresso</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#E07B4F]">{userData.points || 0}</div>
              <div className="text-sm text-[#8B8378]">Pontos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#D4A373]">{userData.pomodoroSessions || 0}</div>
              <div className="text-sm text-[#8B8378]">Sessões de Estudo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#81B29A]">{userData.checkIns?.length || 0}</div>
              <div className="text-sm text-[#8B8378]">Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#F2CC8F]">{userData.lessonsCompleted || 0}</div>
              <div className="text-sm text-[#8B8378]">Aulas Completas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
