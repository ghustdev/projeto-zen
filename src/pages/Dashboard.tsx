import { useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { UserData } from '../App';

interface DashboardProps {
  userData: UserData;
}

export function Dashboard({ userData }: DashboardProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate data for the last 7 days with memoization
  const moodData = useMemo(() => {
    try {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
      }

      return days.map(date => {
        const checkIn = userData.checkIns?.find(c => c.date === date);
        return {
          date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
          mood: checkIn?.mood || 0,
          energy: checkIn?.energy || 0,
        };
      });
    } catch (error) {
      console.error('Erro ao gerar dados de humor:', error);
      return [];
    }
  }, [userData.checkIns]);

  const studyData = [
    { day: 'Seg', sessions: 3 },
    { day: 'Ter', sessions: 2 },
    { day: 'Qua', sessions: 4 },
    { day: 'Qui', sessions: userData.pomodoroSessions >= 5 ? 5 : userData.pomodoroSessions },
    { day: 'Sex', sessions: 3 },
    { day: 'Sáb', sessions: 2 },
    { day: 'Dom', sessions: 1 },
  ];

  const stats = [
    {
      icon: BarChart3,
      label: 'Check-ins Realizados',
      value: userData.checkIns?.length || 0,
      color: 'from-purple-500 to-purple-700',
    },
    {
      icon: Calendar,
      label: 'Sessões de Pomodoro',
      value: userData.pomodoroSessions || 0,
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: Award,
      label: 'Aulas Concluídas',
      value: userData.lessonsCompleted || 0,
      color: 'from-pink-500 to-pink-700',
    },
    {
      icon: TrendingUp,
      label: 'Pontos Totais',
      value: userData.points || 0,
      color: 'from-green-500 to-green-700',
    },
  ];

  const { avgMood, avgEnergy } = useMemo(() => {
    if (!userData.checkIns || userData.checkIns.length === 0) {
      return { avgMood: 'N/A', avgEnergy: 'N/A' };
    }
    
    try {
      const totalMood = userData.checkIns.reduce((sum, c) => sum + (c.mood || 0), 0);
      const totalEnergy = userData.checkIns.reduce((sum, c) => sum + (c.energy || 0), 0);
      
      return {
        avgMood: (totalMood / userData.checkIns.length).toFixed(1),
        avgEnergy: (totalEnergy / userData.checkIns.length).toFixed(1),
      };
    } catch (error) {
      console.error('Erro ao calcular médias:', error);
      return { avgMood: 'N/A', avgEnergy: 'N/A' };
    }
  }, [userData.checkIns]);

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl text-gray-800">Análise de Desempenho</h1>
          <p className="text-gray-600">Acompanhe seu progresso e bem-estar</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mood & Energy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Humor e Energia - Últimos 7 dias</CardTitle>
            <CardDescription>
              Acompanhe como seu humor e energia variam ao longo da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="mood" stackId="1" stroke="#9333ea" fill="#9333ea" fillOpacity={0.6} name="Humor" />
                <Area type="monotone" dataKey="energy" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Energia" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl text-purple-600">{avgMood}</p>
                <p className="text-sm text-gray-600">Humor Médio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-blue-600">{avgEnergy}</p>
                <p className="text-sm text-gray-600">Energia Média</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Sessions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sessões de Estudo - Esta semana</CardTitle>
            <CardDescription>
              Visualize sua consistência de estudo ao longo da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle>💡 Insights e Recomendações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            {(userData.checkIns?.length || 0) >= 3 && avgMood !== 'N/A' && parseFloat(avgMood) < 5 && (
              <div className="bg-white p-3 rounded-lg">
                <p className="text-purple-600">📊 Seu humor médio está abaixo de 5/10</p>
                <p>Considere conversar com a Neura ou conectar-se com um psicólogo da nossa rede.</p>
              </div>
            )}
            {(userData.pomodoroSessions || 0) < 3 && (
              <div className="bg-white p-3 rounded-lg">
                <p className="text-blue-600">⏰ Poucas sessões de estudo registradas</p>
                <p>Tente completar pelo menos 3 sessões de Pomodoro por dia para melhores resultados.</p>
              </div>
            )}
            {(userData.checkIns?.length || 0) < 3 && (
              <div className="bg-white p-3 rounded-lg">
                <p className="text-pink-600">❤️ Faça mais check-ins emocionais</p>
                <p>Registre seu humor diariamente para obter insights mais precisos sobre seu bem-estar.</p>
              </div>
            )}
            {(userData.points || 0) >= 100 && (
              <div className="bg-white p-3 rounded-lg">
                <p className="text-green-600">🎉 Parabéns! Você está muito consistente!</p>
                <p>Continue assim! Sua dedicação ao autocuidado e estudos está gerando ótimos resultados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
