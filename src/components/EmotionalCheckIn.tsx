import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Heart, Smile, Meh, Frown, Battery } from 'lucide-react';

interface EmotionalCheckInProps {
  onCheckInComplete: (mood: number, energy: number) => void;
}

export function EmotionalCheckIn({ onCheckInComplete }: EmotionalCheckInProps) {
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const getMoodEmoji = (value: number) => {
    if (value <= 3) return { emoji: '😢', text: 'Difícil', color: 'text-red-500' };
    if (value <= 5) return { emoji: '😐', text: 'Ok', color: 'text-yellow-500' };
    if (value <= 7) return { emoji: '🙂', text: 'Bem', color: 'text-blue-500' };
    return { emoji: '😊', text: 'Ótimo', color: 'text-green-500' };
  };

  const getEnergyLevel = (value: number) => {
    if (value <= 3) return { text: 'Exausto', color: 'text-red-500' };
    if (value <= 5) return { text: 'Cansado', color: 'text-yellow-500' };
    if (value <= 7) return { text: 'Moderado', color: 'text-blue-500' };
    return { text: 'Energizado', color: 'text-green-500' };
  };

  const handleSubmit = () => {
    onCheckInComplete(mood, energy);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMood(5);
    setEnergy(5);
  };

  const moodData = getMoodEmoji(mood);
  const energyData = getEnergyLevel(energy);

  if (submitted) {
    return (
      <div className="min-h-screen p-4 pb-24 flex items-center justify-center">
        <Card className="max-w-2xl w-full glass shadow-2xl border-[#E07B4F]/20 fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#81B29A] to-[#6B9D84] rounded-full flex items-center justify-center breathe shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-[#3D3833]">Check-in Registrado! ✨</CardTitle>
            <CardDescription className="text-[#8B8378]">
              Obrigado por compartilhar como você está se sentindo hoje. Continue acompanhando seu bem-estar!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="glass-dark p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#8B8378]">Humor:</span>
                <span className={`text-2xl ${moodData.color}`}>{moodData.emoji} {moodData.text}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B8378]">Energia:</span>
                <span className={`${energyData.color}`}>{energyData.text}</span>
              </div>
            </div>

            <div className="bg-[#FFF5ED] p-4 rounded-2xl border border-[#E07B4F]/10">
              <p className="text-sm text-[#8B8378]">
                💡 <span className="text-[#3D3833]">Dica:</span> Continue fazendo check-ins diários para acompanhar padrões no seu humor e energia.
                Isso ajuda a identificar o que afeta seu bem-estar!
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1 border-[#E07B4F]/20 hover:bg-[#FFF5ED] rounded-full">
                Fazer Novo Check-in
              </Button>
              <Button className="flex-1 bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full">
                Ver Histórico
              </Button>
            </div>

            <div className="text-center text-sm text-[#8B8378]">
              +10 pontos ganhos! 🎉
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6 pt-8 fade-in">
        <Card className="glass shadow-2xl border-[#E07B4F]/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E07B4F] to-[#D4A373] rounded-2xl flex items-center justify-center breathe shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-[#3D3833]">Check-in Emocional Diário</CardTitle>
            <CardDescription className="text-[#8B8378]">
              Como você está se sentindo hoje? Reserve um momento para se conectar com suas emoções.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Mood Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFF5ED] rounded-2xl flex items-center justify-center">
                  <Smile className="w-6 h-6 text-[#E07B4F]" />
                </div>
                <div>
                  <h3 className="text-lg text-[#3D3833]">Como está seu humor?</h3>
                  <p className="text-sm text-[#8B8378]">De 1 (muito mal) a 10 (muito bem)</p>
                </div>
              </div>

              <div className="space-y-4 px-4">
                <div className="flex justify-center">
                  <span className={`text-6xl ${moodData.color}`}>{moodData.emoji}</span>
                </div>
                <Slider
                  value={[mood]}
                  onValueChange={(value) => setMood(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-red-500">😢 Difícil</span>
                  <span className={moodData.color}>{mood}/10 - {moodData.text}</span>
                  <span className="text-green-500">😊 Ótimo</span>
                </div>
              </div>
            </div>

            {/* Energy Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFF5ED] rounded-2xl flex items-center justify-center">
                  <Battery className="w-6 h-6 text-[#81B29A]" />
                </div>
                <div>
                  <h3 className="text-lg text-[#3D3833]">Como está sua energia?</h3>
                  <p className="text-sm text-[#8B8378]">De 1 (exausto) a 10 (muito energizado)</p>
                </div>
              </div>

              <div className="space-y-4 px-4">
                <div className="flex justify-center items-center gap-2">
                  <Battery className={`w-12 h-12 ${energyData.color}`} />
                  <span className={`text-xl ${energyData.color}`}>{energyData.text}</span>
                </div>
                <Slider
                  value={[energy]}
                  onValueChange={(value) => setEnergy(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-red-500">Exausto</span>
                  <span className={energyData.color}>{energy}/10</span>
                  <span className="text-green-500">Energizado</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-[#E07B4F] hover:bg-[#D4A373] text-white rounded-full shadow-lg"
              size="lg"
            >
              Registrar Check-in
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}