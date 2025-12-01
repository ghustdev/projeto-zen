import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Video, MessageSquare, Calendar, Star, MapPin, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviews: number;
  availability: string;
  location: string;
  image: string;
  price: string;
}

export function PsychologistsAccess() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);

  const psychologists: Psychologist[] = [
    {
      id: '1',
      name: 'Dra. Ana Silva',
      specialty: 'Ansiedade e Estresse Acadêmico',
      bio: 'Especialista em acompanhamento de adolescentes e jovens adultos. Mais de 10 anos de experiência em saúde mental estudantil.',
      rating: 4.9,
      reviews: 127,
      availability: 'Seg-Sex, 14h-20h',
      location: 'Online',
      image: '',
      price: 'Gratuito via projeto',
    },
    {
      id: '2',
      name: 'Dr. Carlos Mendes',
      specialty: 'Depressão e Burnout',
      bio: 'Psicólogo clínico com foco em técnicas de TCC (Terapia Cognitivo-Comportamental) para estudantes do ensino médio.',
      rating: 4.8,
      reviews: 98,
      availability: 'Ter-Sáb, 10h-18h',
      location: 'Online',
      image: '',
      price: 'Gratuito via projeto',
    },
    {
      id: '3',
      name: 'Dra. Beatriz Costa',
      specialty: 'Desenvolvimento Pessoal e Autoestima',
      bio: 'Especializada em ajudar jovens a desenvolverem confiança e habilidades emocionais para enfrentar desafios acadêmicos.',
      rating: 5.0,
      reviews: 156,
      availability: 'Seg-Qui, 15h-21h',
      location: 'Online',
      image: '',
      price: 'Gratuito via projeto',
    },
    {
      id: '4',
      name: 'Dr. Pedro Santos',
      specialty: 'Gestão de Tempo e Procrastinação',
      bio: 'Psicólogo organizacional com expertise em ajudar estudantes a superarem procrastinação e desenvolverem disciplina.',
      rating: 4.7,
      reviews: 84,
      availability: 'Qua-Sáb, 13h-19h',
      location: 'Online',
      image: '',
      price: 'Gratuito via projeto',
    },
  ];

  const handleSchedule = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
  };

  if (selectedPsychologist) {
    return (
      <div className="min-h-screen p-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-6 pt-8">
          <Button variant="outline" onClick={() => setSelectedPsychologist(null)} className="mb-4">
            ← Voltar
          </Button>

          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-br from-green-600 to-teal-600 text-white text-2xl">
                    {selectedPsychologist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{selectedPsychologist.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {selectedPsychologist.specialty}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedPsychologist.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({selectedPsychologist.reviews} avaliações)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <h4 className="mb-2">Sobre</h4>
                <p className="text-gray-700">{selectedPsychologist.bio}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{selectedPsychologist.availability}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{selectedPsychologist.location}</span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700">
                  💚 <span>Atendimento gratuito</span> para alunos participantes do projeto Zen
                </p>
              </div>

              <div className="space-y-3">
                <h4>Agendar Consulta</h4>
                <div className="grid gap-3">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 justify-start" size="lg">
                    <Video className="w-5 h-5 mr-2" />
                    Consulta por Vídeo
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 justify-start" size="lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Consulta por Chat
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 justify-start" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Escolher Horário
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p className="mb-2">ℹ️ <span>Informações importantes:</span></p>
                <ul className="space-y-1 ml-4">
                  <li>• Primeira consulta: avaliação inicial (50 min)</li>
                  <li>• Consultas subsequentes: 50 minutos</li>
                  <li>• Cancelamento gratuito até 24h antes</li>
                  <li>• Total privacidade e sigilo profissional</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl text-gray-800">Conecte-se com Psicólogos</h1>
          <p className="text-gray-600">
            Profissionais voluntários prontos para ajudar você em sua jornada
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-3">Como funciona?</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                💜 Nossa rede de psicólogos parceiros oferece <span>atendimento gratuito</span> para
                alunos participantes do projeto Zen.
              </p>
              <p>
                🔒 Todas as consultas são <span>100% confidenciais</span> e seguem o código de
                ética profissional.
              </p>
              <p>
                🎯 Escolha o profissional que melhor atende suas necessidades e agende uma consulta
                online quando quiser.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Psychologists Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {psychologists.map((psychologist) => (
            <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-green-600 to-teal-600 text-white text-xl">
                      {psychologist.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{psychologist.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {psychologist.specialty}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{psychologist.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({psychologist.reviews} avaliações)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-2">{psychologist.bio}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{psychologist.availability}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{psychologist.location}</span>
                  </div>
                </div>

                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {psychologist.price}
                </Badge>

                <Button
                  onClick={() => handleSchedule(psychologist)}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600"
                >
                  Ver Perfil e Agendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">🚨 Em caso de emergência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Se você está em crise ou pensando em se machucar, procure ajuda imediatamente:
            </p>
            <div className="space-y-1 text-gray-700">
              <p>📞 CVV (Centro de Valorização da Vida): 188 (24h, gratuito)</p>
              <p>📞 CAPS (Centro de Atenção Psicossocial): procure a unidade mais próxima</p>
              <p>🏥 Em emergência: vá ao pronto-socorro mais próximo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
