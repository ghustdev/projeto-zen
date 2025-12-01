import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Clock, Repeat, BookMarked, Brain, Lightbulb, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

interface StudyTechniquesProps {
  onLessonComplete: () => void;
}

export function StudyTechniques({ onLessonComplete }: StudyTechniquesProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const techniques = [
    {
      id: 'pomodoro',
      icon: Clock,
      title: 'Técnica Pomodoro',
      color: 'from-red-500 to-orange-500',
      difficulty: 'Iniciante',
      content: [
        {
          subtitle: 'Como funciona',
          text: '25 minutos de foco intenso + 5 minutos de pausa. Após 4 ciclos, faça uma pausa mais longa (15-30 min). Simples, mas extremamente eficaz.',
        },
        {
          subtitle: 'Por que funciona',
          text: 'O cérebro mantém foco máximo por ~25 min. Pausas frequentes previnem fadiga mental e mantêm a produtividade alta ao longo do dia.',
        },
        {
          subtitle: 'Dica de ouro',
          text: 'Durante as pausas: levante, alongue, beba água. NUNCA use redes sociais - elas sequestram sua atenção e prejudicam o próximo ciclo.',
        },
      ],
    },
    {
      id: 'active-recall',
      icon: Brain,
      title: 'Recordação Ativa',
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Intermediário',
      content: [
        {
          subtitle: 'O que é',
          text: 'Testar ativamente sua memória ao invés de apenas reler. Feche o livro e tente lembrar o que aprendeu. Flashcards são perfeitos para isso.',
        },
        {
          subtitle: 'Ciência por trás',
          text: 'Estudos mostram que recordação ativa é 3x mais eficaz que releitura passiva. O esforço de lembrar fortalece conexões neurais.',
        },
        {
          subtitle: 'Como aplicar',
          text: 'Após estudar um tópico: 1) Feche o material, 2) Escreva tudo que lembra, 3) Compare com o original, 4) Foque nas lacunas, 5) Repita.',
        },
      ],
    },
    {
      id: 'spaced-repetition',
      icon: Repeat,
      title: 'Repetição Espaçada',
      color: 'from-blue-500 to-teal-500',
      difficulty: 'Intermediário',
      content: [
        {
          subtitle: 'Conceito',
          text: 'Revisar conteúdo em intervalos crescentes: 1 dia, 3 dias, 1 semana, 1 mês. Combate a "curva do esquecimento" de Ebbinghaus.',
        },
        {
          subtitle: 'Por que é poderoso',
          text: 'Sem revisão, esquecemos 70% do conteúdo em 24h. Com repetição espaçada, a retenção de longo prazo aumenta dramaticamente.',
        },
        {
          subtitle: 'Ferramentas',
          text: 'Apps como Anki automatizam esse processo. Crie flashcards e o app programa revisões nos intervalos ideais para você.',
        },
      ],
    },
    {
      id: 'feynman',
      icon: Lightbulb,
      title: 'Técnica Feynman',
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Avançado',
      content: [
        {
          subtitle: 'A técnica',
          text: 'Explique o conceito em linguagem simples, como se estivesse ensinando uma criança de 10 anos. Se travar, você encontrou uma lacuna no conhecimento.',
        },
        {
          subtitle: 'Por que funciona',
          text: 'Ensinar é a melhor forma de aprender. Identificar lacunas e simplificar conceitos cria entendimento profundo, não apenas memorização.',
        },
        {
          subtitle: 'Passo a passo',
          text: '1) Escolha um conceito, 2) Escreva como explicaria para uma criança, 3) Identifique lacunas, 4) Revisite o material, 5) Simplifique ainda mais.',
        },
      ],
    },
    {
      id: 'chunking',
      icon: BookMarked,
      title: 'Chunking (Agrupamento)',
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Iniciante',
      content: [
        {
          subtitle: 'O que é',
          text: 'Dividir informações complexas em "pedaços" menores e relacionados. Exemplo: 149217761945 vs 1492-1776-1945 (datas históricas).',
        },
        {
          subtitle: 'Base científica',
          text: 'A memória de trabalho comporta 7±2 itens. Chunking permite armazenar mais informação ao agrupar dados relacionados.',
        },
        {
          subtitle: 'Aplicação prática',
          text: 'Ao estudar: agrupe conceitos por tema, crie categorias, use mapas mentais, encontre padrões. Seu cérebro adora padrões!',
        },
      ],
    },
  ];

  const commonMistakes = [
    {
      mistake: 'Reler passivamente',
      solution: 'Use recordação ativa e autoexplicação',
    },
    {
      mistake: 'Maratonas de estudo',
      solution: 'Sessões curtas e espaçadas são mais eficazes',
    },
    {
      mistake: 'Estudar deitado/na cama',
      solution: 'Mesa, cadeira, boa postura = melhor foco',
    },
    {
      mistake: 'Multitarefar',
      solution: 'Uma tarefa por vez. Multitasking é um mito.',
    },
    {
      mistake: 'Não fazer pausas',
      solution: 'Pausas são essenciais para consolidação',
    },
    {
      mistake: 'Não dormir o suficiente',
      solution: '7-9h de sono = melhor aprendizado e memória',
    },
  ];

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.has(lessonId)) {
      setCompletedLessons(new Set([...completedLessons, lessonId]));
      try {
        onLessonComplete();
      } catch (error) {
        console.error('Erro ao completar lição:', error);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl text-gray-800">Técnicas de Estudo Eficiente</h1>
          <p className="text-gray-600">Aprenda métodos comprovados cientificamente para estudar melhor</p>
        </div>

        {/* Progress */}
        <Card className="bg-gradient-to-r from-blue-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-2xl">
                  {completedLessons.size}/{techniques.length} técnicas aprendidas
                </p>
              </div>
              <div className="text-4xl">
                {completedLessons.size === techniques.length ? '🎓' : '📖'}
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-teal-600 transition-all duration-500"
                style={{ width: `${(completedLessons.size / techniques.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Techniques */}
        <div className="space-y-4">
          {techniques.map((technique) => {
            const Icon = technique.icon;
            const isCompleted = completedLessons.has(technique.id);

            return (
              <Card key={technique.id} className={isCompleted ? 'border-green-300 bg-green-50/30' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${technique.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{technique.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            technique.difficulty === 'Iniciante' ? 'bg-green-100 text-green-700' :
                            technique.difficulty === 'Intermediário' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {technique.difficulty}
                          </span>
                          {isCompleted && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <Check className="w-4 h-4" />
                              Completo
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {technique.content.map((section, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{section.subtitle}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-700">{section.text}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {!isCompleted && (
                    <Button
                      onClick={() => handleCompleteLesson(technique.id)}
                      className={`w-full bg-gradient-to-r ${technique.color}`}
                    >
                      Marcar como Completo (+15 pts)
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Common Mistakes */}
        <Card>
          <CardHeader>
            <CardTitle>❌ Erros Comuns e Como Evitá-los</CardTitle>
            <CardDescription>Aprenda com os erros mais frequentes de estudantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commonMistakes.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">❌</div>
                    <div className="flex-1">
                      <p className="text-red-700 mb-1">{item.mistake}</p>
                      <p className="text-sm text-gray-700">✅ {item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final Tips */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle>💡 Lembre-se</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>🎯 Qualidade {'>'} Quantidade. 2h focado vale mais que 8h distraído.</p>
            <p>🧠 Seu cérebro precisa de descanso para consolidar aprendizado.</p>
            <p>💪 Consistência vence intensidade. 1h por dia {'>'} 7h no fim de semana.</p>
            <p>🎓 Não existe técnica mágica. Experimente várias e veja o que funciona para VOCÊ.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}