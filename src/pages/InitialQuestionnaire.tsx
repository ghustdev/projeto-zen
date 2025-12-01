import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Brain, Moon, Target } from 'lucide-react';

interface InitialQuestionnaireProps {
  onComplete: (results: { stressLevel: number; focusLevel: number; sleepQuality: number }) => void;
}

export function InitialQuestionnaire({ onComplete }: InitialQuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [stressLevel, setStressLevel] = useState(5);
  const [focusLevel, setFocusLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);

  const questions = [
    {
      icon: Brain,
      title: 'Nível de Estresse',
      description: 'Como você avalia seu nível de estresse atualmente?',
      value: stressLevel,
      onChange: setStressLevel,
      labels: ['Muito baixo', 'Muito alto'],
    },
    {
      icon: Target,
      title: 'Capacidade de Foco',
      description: 'Como está sua capacidade de concentração nos estudos?',
      value: focusLevel,
      onChange: setFocusLevel,
      labels: ['Muito difícil', 'Excelente'],
    },
    {
      icon: Moon,
      title: 'Qualidade do Sono',
      description: 'Como você avalia a qualidade do seu sono?',
      value: sleepQuality,
      onChange: setSleepQuality,
      labels: ['Muito ruim', 'Excelente'],
    },
  ];

  const currentQuestion = questions[step];
  const Icon = currentQuestion.icon;

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ stressLevel, focusLevel, sleepQuality });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass shadow-2xl border-[#E07B4F]/20 fade-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E07B4F] to-[#D4A373] rounded-full flex items-center justify-center breathe shadow-lg">
              <span className="text-4xl">🧘</span>
            </div>
          </div>
          <CardTitle className="text-4xl text-[#3D3833]">Bem-vindo ao Zen</CardTitle>
          <CardDescription className="text-base text-[#8B8378]">
            {step === 0
              ? 'Vamos conhecer você melhor. Este questionário rápido nos ajudará a personalizar sua experiência.'
              : `Pergunta ${step + 1} de ${questions.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-8">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-[#FFF5ED] rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-[#E07B4F]" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-2xl text-[#3D3833]">{currentQuestion.title}</h3>
            <p className="text-[#8B8378]">{currentQuestion.description}</p>
          </div>

          <div className="space-y-4 px-4">
            <Slider
              value={[currentQuestion.value]}
              onValueChange={(value) => currentQuestion.onChange(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-[#8B8378]">
              <span>{currentQuestion.labels[0]}</span>
              <span className="text-[#E07B4F] font-medium">{currentQuestion.value}/10</span>
              <span>{currentQuestion.labels[1]}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-12 rounded-full transition-all duration-300 ${
                    index <= step ? 'bg-[#E07B4F]' : 'bg-[#E8DFD5]'
                  }`}
                />
              ))}
            </div>
            <Button 
              onClick={handleNext} 
              size="lg" 
              className="bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full px-8 shadow-lg"
            >
              {step < questions.length - 1 ? 'Próximo' : 'Começar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}