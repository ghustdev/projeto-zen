import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_MODES = {
  focus: { duration: 25, label: 'Foco', icon: BookOpen, color: 'from-purple-600 to-pink-600' },
  shortBreak: { duration: 5, label: 'Pausa Curta', icon: Coffee, color: 'from-blue-600 to-teal-600' },
  longBreak: { duration: 15, label: 'Pausa Longa', icon: Coffee, color: 'from-green-600 to-emerald-600' },
};

const FOCUS_PRESETS = [15, 25, 30, 45, 60];

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [mode, setMode] = useState<TimerMode>('focus');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [studyGoal, setStudyGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(true);
  const [customFocusTime, setCustomFocusTime] = useState(25);
  const [showTimeSelector, setShowTimeSelector] = useState(false);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            setMinutes(prevMinutes => {
              if (prevMinutes === 0) {
                setIsActive(false);
                
                // Timer completed logic
                setTimeout(() => {
                  try {
                    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                    if (AudioContextClass) {
                      const audioContext = new AudioContextClass();
                      const oscillator = audioContext.createOscillator();
                      const gainNode = audioContext.createGain();
                      
                      oscillator.connect(gainNode);
                      gainNode.connect(audioContext.destination);
                      
                      oscillator.frequency.value = 800;
                      oscillator.type = 'sine';
                      
                      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                      
                      oscillator.start(audioContext.currentTime);
                      oscillator.stop(audioContext.currentTime + 0.5);
                    }
                  } catch (error) {
                    console.error('Erro ao reproduzir som:', error);
                  }
                  
                  if (mode === 'focus') {
                    setSessionsCompleted(prev => {
                      const newCount = prev + 1;
                      try {
                        onSessionComplete();
                      } catch (error) {
                        console.error('Erro ao executar callback:', error);
                      }
                      
                      // Switch mode after updating sessions
                      setTimeout(() => {
                        if (newCount % 4 === 0) {
                          setMode('longBreak');
                          setMinutes(TIMER_MODES.longBreak.duration);
                          setSeconds(0);
                          setIsActive(false);
                        } else {
                          setMode('shortBreak');
                          setMinutes(TIMER_MODES.shortBreak.duration);
                          setSeconds(0);
                          setIsActive(false);
                        }
                      }, 100);
                      
                      return newCount;
                    });
                  } else {
                    setTimeout(() => {
                      setMode('focus');
                      setMinutes(customFocusTime);
                      setSeconds(0);
                      setIsActive(false);
                      setShowGoalInput(true);
                    }, 100);
                  }
                }, 100);
                
                return 0;
              } else {
                return prevMinutes - 1;
              }
            });
            return 59;
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, onSessionComplete]);





  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    const duration = newMode === 'focus' ? customFocusTime : TIMER_MODES[newMode].duration;
    setMinutes(duration);
    setSeconds(0);
    setIsActive(false);
  }, [customFocusTime]);

  const handleTimePreset = (time: number) => {
    setCustomFocusTime(time);
    if (mode === 'focus') {
      setMinutes(time);
      setSeconds(0);
    }
    setShowTimeSelector(false);
  };

  const toggleTimer = () => {
    if (mode === 'focus' && !currentGoal && !isActive) {
      setShowGoalInput(true);
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    const duration = mode === 'focus' ? customFocusTime : TIMER_MODES[mode].duration;
    setMinutes(duration);
    setSeconds(0);
  };

  const startWithGoal = () => {
    if (studyGoal.trim()) {
      setCurrentGoal(studyGoal);
      setShowGoalInput(false);
      setIsActive(true);
    }
  };

  const formatTime = useMemo(() => {
    return (mins: number, secs: number) => {
      const safeMinutes = Math.max(0, Math.floor(mins));
      const safeSeconds = Math.max(0, Math.floor(secs));
      return `${safeMinutes.toString().padStart(2, '0')}:${safeSeconds.toString().padStart(2, '0')}`;
    };
  }, []);

  const progress = useMemo(() => {
    const duration = mode === 'focus' ? customFocusTime : TIMER_MODES[mode].duration;
    const totalSeconds = duration * 60;
    const currentSeconds = minutes * 60 + seconds;
    return totalSeconds > 0 ? ((totalSeconds - currentSeconds) / totalSeconds) * 100 : 0;
  }, [mode, minutes, seconds, customFocusTime]);

  const ModeIcon = TIMER_MODES[mode].icon;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        {/* Timer Card */}
        <Card className="overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${TIMER_MODES[mode].color} text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ModeIcon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>Pomodoro Inteligente</CardTitle>
                <CardDescription className="text-white/80">
                  Técnica comprovada para máximo foco e produtividade
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Mode Selector */}
            <div className="space-y-4">
              <div className="flex gap-2 justify-center flex-wrap">
                {(Object.keys(TIMER_MODES) as TimerMode[]).map((m) => (
                  <Button
                    key={m}
                    onClick={() => switchMode(m)}
                    variant={mode === m ? 'default' : 'outline'}
                    className={mode === m ? `bg-gradient-to-r ${TIMER_MODES[m].color}` : ''}
                    disabled={isActive}
                  >
                    {m === 'focus' ? `${TIMER_MODES[m].label} (${customFocusTime}min)` : TIMER_MODES[m].label}
                  </Button>
                ))}
              </div>
              
              {/* Time Selector for Focus Mode */}
              {mode === 'focus' && !isActive && (
                <div className="text-center">
                  <Button
                    onClick={() => setShowTimeSelector(!showTimeSelector)}
                    variant="outline"
                    size="sm"
                    className="mb-3"
                  >
                    Alterar tempo de foco
                  </Button>
                  {showTimeSelector && (
                    <div className="flex gap-2 justify-center flex-wrap">
                      {FOCUS_PRESETS.map((time) => (
                        <Button
                          key={time}
                          onClick={() => handleTimePreset(time)}
                          variant={customFocusTime === time ? 'default' : 'outline'}
                          size="sm"
                          className={customFocusTime === time ? 'bg-purple-600' : ''}
                        >
                          {time}min
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Current Goal Display */}
            {currentGoal && mode === 'focus' && (
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Meta de estudo atual:</p>
                <p className="text-lg text-purple-800">{currentGoal}</p>
              </div>
            )}

            {/* Timer Display */}
            <div className="relative">
              <div className="w-full aspect-square max-w-sm mx-auto relative">
                {/* Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl tabular-nums">{formatTime(minutes, seconds)}</span>
                  <span className="text-gray-500 mt-2">{TIMER_MODES[mode].label}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={toggleTimer}
                size="lg"
                className={`bg-gradient-to-r ${TIMER_MODES[mode].color} min-w-32`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
              <Button onClick={resetTimer} size="lg" variant="outline">
                <RotateCcw className="w-5 h-5 mr-2" />
                Resetar
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-3xl text-purple-600">{sessionsCompleted}</p>
                <p className="text-sm text-gray-600">Sessões Completas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl text-purple-600">{sessionsCompleted * 25}</p>
                <p className="text-sm text-gray-600">Minutos de Foco</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Input Modal */}
        {showGoalInput && mode === 'focus' && !currentGoal && (
          <Card className="border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle>Defina sua meta de estudo</CardTitle>
              <CardDescription>
                O que você quer estudar nesta sessão? Estabelecer uma meta clara aumenta o foco!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && startWithGoal()}
                placeholder="Ex: Revisar capítulo 3 de Matemática"
                className="text-base"
              />
              <div className="flex gap-2">
                <Button
                  onClick={startWithGoal}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={!studyGoal.trim()}
                >
                  Começar Sessão
                </Button>
                <Button onClick={() => setShowGoalInput(false)} variant="outline">
                  Pular
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg">Como funciona o Pomodoro?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>🎯 <span>25 minutos de foco intenso</span> em uma única tarefa</p>
            <p>☕ <span>5 minutos de pausa</span> para descansar a mente</p>
            <p>🔄 Após 4 sessões, faça uma <span>pausa longa de 15 minutos</span></p>
            <p>✨ Durante as pausas: respire, alongue, hidrate - <span>não use redes sociais!</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
