import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Award, Trophy, Target, Star, Zap, Crown, Medal, Flame } from 'lucide-react';
import { Progress } from './ui/progress';
import type { UserData } from '../App';

interface RewardsProps {
  userData: UserData;
}

interface Achievement {
  id: string;
  icon: any;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export function Rewards({ userData }: RewardsProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-checkin',
      icon: Star,
      title: 'Primeiro Passo',
      description: 'Complete seu primeiro check-in emocional',
      points: 10,
      unlocked: userData.checkIns.length >= 1,
    },
    {
      id: 'week-streak',
      icon: Flame,
      title: 'Semana Consistente',
      description: 'Faça check-ins por 7 dias consecutivos',
      points: 50,
      unlocked: userData.checkIns.length >= 7,
      progress: userData.checkIns.length,
      total: 7,
    },
    {
      id: 'first-pomodoro',
      icon: Zap,
      title: 'Foco Inicial',
      description: 'Complete sua primeira sessão Pomodoro',
      points: 20,
      unlocked: userData.pomodoroSessions >= 1,
    },
    {
      id: 'pomodoro-master',
      icon: Target,
      title: 'Mestre do Foco',
      description: 'Complete 25 sessões Pomodoro',
      points: 100,
      unlocked: userData.pomodoroSessions >= 25,
      progress: userData.pomodoroSessions,
      total: 25,
    },
    {
      id: 'student',
      icon: Medal,
      title: 'Estudante Dedicado',
      description: 'Complete 5 aulas educativas',
      points: 75,
      unlocked: userData.lessonsCompleted >= 5,
      progress: userData.lessonsCompleted,
      total: 5,
    },
    {
      id: 'scholar',
      icon: Trophy,
      title: 'Acadêmico',
      description: 'Complete todas as aulas educativas',
      points: 150,
      unlocked: userData.lessonsCompleted >= 10,
      progress: userData.lessonsCompleted,
      total: 10,
    },
    {
      id: 'points-100',
      icon: Award,
      title: 'Centurião',
      description: 'Acumule 100 pontos',
      points: 0,
      unlocked: userData.points >= 100,
      progress: userData.points,
      total: 100,
    },
    {
      id: 'points-500',
      icon: Crown,
      title: 'Lenda',
      description: 'Acumule 500 pontos',
      points: 0,
      unlocked: userData.points >= 500,
      progress: userData.points,
      total: 500,
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const levelInfo = {
    currentLevel: Math.floor(userData.points / 100) + 1,
    pointsInLevel: userData.points % 100,
    pointsToNextLevel: 100 - (userData.points % 100),
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl text-gray-800">Recompensas e Conquistas</h1>
          <p className="text-gray-600">
            Celebre seu progresso e consistência!
          </p>
        </div>

        {/* Level Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">Nível {levelInfo.currentLevel}</CardTitle>
                <CardDescription className="text-purple-100 mt-1">
                  {levelInfo.pointsToNextLevel} pontos para o próximo nível
                </CardDescription>
              </div>
              <div className="text-5xl">
                {levelInfo.currentLevel <= 3 ? '🌱' : levelInfo.currentLevel <= 6 ? '🌿' : levelInfo.currentLevel <= 10 ? '🌳' : '🏆'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(levelInfo.pointsInLevel / 100) * 100} className="h-3 bg-purple-400" />
            <p className="text-sm text-purple-100 mt-2">
              {levelInfo.pointsInLevel}/100 pontos neste nível
            </p>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-1">{userData.points}</div>
              <div className="text-sm text-gray-600">Pontos Totais</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-1">{unlockedAchievements.length}</div>
              <div className="text-sm text-gray-600">Conquistas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-1">{userData.pomodoroSessions}</div>
              <div className="text-sm text-gray-600">Pomodoros</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-1">{userData.checkIns.length}</div>
              <div className="text-sm text-gray-600">Check-ins</div>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl">🏆 Conquistas Desbloqueadas</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id} className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {achievement.points > 0 && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <Award className="w-4 h-4" />
                              <span>+{achievement.points} pts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl">🔒 Próximas Conquistas</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {lockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-700 mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {achievement.total && achievement.progress !== undefined && (
                            <div className="space-y-1">
                              <Progress
                                value={(achievement.progress / achievement.total) * 100}
                                className="h-2"
                              />
                              <p className="text-xs text-gray-500">
                                {achievement.progress}/{achievement.total}
                              </p>
                            </div>
                          )}
                          {achievement.points > 0 && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                              <Award className="w-4 h-4" />
                              <span>+{achievement.points} pts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* How to Earn Points */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Como Ganhar Pontos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>📝 Check-in emocional diário: <span>+10 pontos</span></p>
            <p>⏰ Completar sessão Pomodoro: <span>+20 pontos</span></p>
            <p>📚 Concluir aula educativa: <span>+15 pontos</span></p>
            <p>🌬️ Exercício de respiração: <span>+5 pontos</span></p>
            <p>🏆 Desbloquear conquistas: <span>pontos extras!</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
