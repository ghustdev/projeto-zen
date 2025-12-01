import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Wind, Play, Pause } from 'lucide-react';

interface BreathingExerciseProps {
  onComplete: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [counter, setCounter] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalCycles] = useState(3);

  const phaseConfig = {
    inhale: { duration: 4, next: 'hold' as Phase, label: 'Inspire', color: 'from-blue-400 to-blue-600' },
    hold: { duration: 7, next: 'exhale' as Phase, label: 'Segure', color: 'from-purple-400 to-purple-600' },
    exhale: { duration: 8, next: 'rest' as Phase, label: 'Expire', color: 'from-teal-400 to-teal-600' },
    rest: { duration: 2, next: 'inhale' as Phase, label: 'Descanse', color: 'from-gray-400 to-gray-600' },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            const currentConfig = phaseConfig[phase];
            const nextPhase = currentConfig.next;
            
            // Check if we completed a full cycle (after exhale)
            if (phase === 'rest') {
              const newCyclesCompleted = cyclesCompleted + 1;
              setCyclesCompleted(newCyclesCompleted);
              
              if (newCyclesCompleted >= totalCycles) {
                setIsActive(false);
                try {
                  onComplete();
                } catch (error) {
                  console.error('Erro ao completar exercício:', error);
                }
                return 0;
              }
            }
            
            setPhase(nextPhase);
            return phaseConfig[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, cyclesCompleted]);

  const toggleExercise = () => {
    if (!isActive) {
      setPhase('inhale');
      setCounter(4);
      setCyclesCompleted(0);
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCounter(4);
    setCyclesCompleted(0);
  };

  const circleScale = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'exhale') return 'scale-75';
    return 'scale-125';
  };

  const currentConfig = phaseConfig[phase];

  return (
    <div className="min-h-screen p-4 pb-24 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center">
                <Wind className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Respiração Guiada 4-7-8</CardTitle>
            <CardDescription>
              Técnica comprovada para reduzir ansiedade e melhorar o foco
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Breathing Circle */}
            <div className="relative h-80 flex items-center justify-center">
              <div
                className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${currentConfig.color} 
                  transition-all duration-1000 ease-in-out ${isActive ? circleScale() : 'scale-100'}`}
                style={{ opacity: 0.6 }}
              />
              <div className="relative z-10 text-center">
                <p className="text-6xl mb-2">{counter}</p>
                <p className="text-2xl text-gray-700">{currentConfig.label}</p>
              </div>
            </div>

            {/* Instructions */}
            {!isActive && cyclesCompleted === 0 && (
              <div className="bg-blue-50 p-6 rounded-lg space-y-3">
                <h4 className="text-purple-600 text-center">Como funciona:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>🌬️ <span>Inspire</span> pelo nariz por <span>4 segundos</span></p>
                  <p>⏸️ <span>Segure</span> a respiração por <span>7 segundos</span></p>
                  <p>💨 <span>Expire</span> pela boca por <span>8 segundos</span></p>
                  <p>✨ Repita o ciclo <span>3 vezes</span></p>
                </div>
                <p className="text-xs text-gray-600 text-center mt-4">
                  Esta técnica ativa seu sistema nervoso parassimpático, reduzindo ansiedade e promovendo relaxamento.
                </p>
              </div>
            )}

            {/* Progress */}
            {isActive && (
              <div className="text-center">
                <p className="text-gray-600">
                  Ciclo {cyclesCompleted + 1} de {totalCycles}
                </p>
                <div className="flex gap-2 justify-center mt-2">
                  {Array.from({ length: totalCycles }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-16 rounded-full ${
                        i < cyclesCompleted ? 'bg-green-500' : i === cyclesCompleted ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completion Message */}
            {!isActive && cyclesCompleted >= totalCycles && (
              <div className="bg-green-50 p-6 rounded-lg text-center space-y-3">
                <p className="text-3xl">🎉</p>
                <h4 className="text-green-700 text-lg">Exercício Completo!</h4>
                <p className="text-sm text-gray-700">
                  Parabéns! Você concluiu {totalCycles} ciclos de respiração. Como você está se sentindo?
                </p>
                <p className="text-xs text-green-600">+5 pontos ganhos!</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={toggleExercise}
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-blue-600 min-w-32"
                disabled={cyclesCompleted >= totalCycles}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {cyclesCompleted > 0 && cyclesCompleted < totalCycles ? 'Continuar' : 'Começar'}
                  </>
                )}
              </Button>
              {(cyclesCompleted >= totalCycles || cyclesCompleted > 0) && (
                <Button onClick={resetExercise} size="lg" variant="outline">
                  Recomeçar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-lg">Benefícios da Respiração 4-7-8</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>😌 Reduz ansiedade e estresse instantaneamente</p>
            <p>🎯 Melhora foco e concentração antes de estudar</p>
            <p>😴 Ajuda a dormir melhor quando praticada à noite</p>
            <p>❤️ Regula frequência cardíaca e pressão arterial</p>
            <p>🧠 Oxigena o cérebro, melhorando cognição</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
