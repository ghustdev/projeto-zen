import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Brain, Heart, Shield, Lightbulb, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface MentalHealthEducationProps {
  onLessonComplete: () => void;
}

export function MentalHealthEducation({ onLessonComplete }: MentalHealthEducationProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const lessons = [
    {
      id: 'stress',
      icon: Brain,
      title: 'Entendendo o Estresse',
      color: 'from-red-500 to-orange-500',
      content: [
        {
          subtitle: 'O que é o estresse?',
          text: 'O estresse é uma resposta natural do corpo a situações desafiadoras. Em doses moderadas, pode até ajudar no desempenho. O problema surge quando se torna crônico.',
        },
        {
          subtitle: 'Sinais de estresse',
          text: 'Físicos: dor de cabeça, tensão muscular, cansaço. Emocionais: irritabilidade, ansiedade, dificuldade de concentração. Comportamentais: mudanças no apetite ou sono.',
        },
        {
          subtitle: 'Como lidar',
          text: '1) Identifique os gatilhos, 2) Pratique técnicas de respiração, 3) Faça pausas regulares, 4) Exercite-se regularmente, 5) Mantenha uma rotina de sono saudável.',
        },
      ],
    },
    {
      id: 'anxiety',
      icon: Heart,
      title: 'Gerenciando Ansiedade',
      color: 'from-purple-500 to-pink-500',
      content: [
        {
          subtitle: 'Ansiedade acadêmica',
          text: 'É normal sentir ansiedade antes de provas ou apresentações. Ela se torna problemática quando interfere significativamente no seu desempenho e bem-estar diário.',
        },
        {
          subtitle: 'Técnicas comprovadas',
          text: 'Respiração 4-7-8, mindfulness, exercício físico, sono adequado (7-9h), reduzir cafeína, técnica do "E se...? Então...!" para desafiar pensamentos ansiosos.',
        },
        {
          subtitle: 'Quando buscar ajuda',
          text: 'Se a ansiedade: persiste por semanas, afeta suas atividades diárias, causa ataques de pânico, ou vem acompanhada de pensamentos negativos persistentes.',
        },
      ],
    },
    {
      id: 'comparison',
      icon: Shield,
      title: 'Superando a Comparação',
      color: 'from-blue-500 to-teal-500',
      content: [
        {
          subtitle: 'A armadilha da comparação',
          text: 'Comparar-se constantemente com colegas, especialmente em redes sociais, gera insatisfação e baixa autoestima. Lembre-se: você só vê os "destaques" da vida alheia.',
        },
        {
          subtitle: 'Foque em você',
          text: 'Sua única competição real é você mesmo ontem. Celebre suas pequenas vitórias. Progredir 1% ao dia resulta em 37x mais crescimento ao final de um ano (matemática exponencial!).',
        },
        {
          subtitle: 'Pratique gratidão',
          text: 'Liste diariamente 3 coisas pelas quais é grato. Isso treina seu cérebro para focar no positivo ao invés de comparações negativas.',
        },
      ],
    },
    {
      id: 'pressure',
      icon: Lightbulb,
      title: 'Lidando com Pressão',
      color: 'from-green-500 to-emerald-500',
      content: [
        {
          subtitle: 'Tipos de pressão',
          text: 'Interna (autocrítica excessiva, perfeccionismo) e Externa (expectativas familiares, sociais, escolares). Ambas são válidas e podem ser gerenciadas.',
        },
        {
          subtitle: 'Perfeccionismo saudável vs. prejudicial',
          text: 'Saudável: busca excelência com autocompaixão. Prejudicial: medo de errar, procrastinação, burnout. A excelência não exige perfeição!',
        },
        {
          subtitle: 'Estratégias práticas',
          text: 'Divida metas grandes em micro-metas, celebre progresso (não só resultado final), pratique autocompaixão ("Errar é humano"), estabeleça limites saudáveis.',
        },
      ],
    },
  ];

  const tips = [
    {
      title: 'Durma 7-9 horas',
      description: 'O sono é fundamental para consolidação de memória e regulação emocional.',
    },
    {
      title: 'Exercite-se regularmente',
      description: '30 minutos de atividade física liberam endorfinas, reduzindo estresse e ansiedade.',
    },
    {
      title: 'Mantenha conexões sociais',
      description: 'Passar tempo com amigos e família é essencial para saúde mental.',
    },
    {
      title: 'Limite redes sociais',
      description: 'Excesso de redes sociais está associado a maior ansiedade e depressão.',
    },
    {
      title: 'Pratique mindfulness',
      description: 'Apenas 5 minutos diários de meditação podem reduzir significativamente o estresse.',
    },
    {
      title: 'Busque ajuda profissional',
      description: 'Não há vergonha em conversar com um psicólogo. É sinal de força, não fraqueza.',
    },
  ];

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.has(lessonId)) {
      setCompletedLessons(new Set([...completedLessons, lessonId]));
      onLessonComplete();
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl text-gray-800">Educação em Saúde Mental</h1>
          <p className="text-gray-600">Aprenda técnicas baseadas em ciência para cuidar da sua mente</p>
        </div>

        {/* Progress */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-2xl">
                  {completedLessons.size}/{lessons.length} aulas completas
                </p>
              </div>
              <div className="text-4xl">
                {completedLessons.size === lessons.length ? '🎓' : '📚'}
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lessons */}
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            const isCompleted = completedLessons.has(lesson.id);

            return (
              <Card key={lesson.id} className={isCompleted ? 'border-green-300 bg-green-50/30' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${lesson.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{lesson.title}</CardTitle>
                        {isCompleted && (
                          <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                            <Check className="w-4 h-4" />
                            Completo
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {lesson.content.map((section, index) => (
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
                      onClick={() => handleCompleteLesson(lesson.id)}
                      className={`w-full bg-gradient-to-r ${lesson.color}`}
                    >
                      Marcar como Completo (+15 pts)
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas Rápidas Baseadas em Ciência</CardTitle>
            <CardDescription>Pequenas ações que fazem grande diferença</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="text-purple-700 mb-1">✓ {tip.title}</h4>
                  <p className="text-sm text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
