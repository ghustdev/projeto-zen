import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { InitialQuestionnaire } from './pages/InitialQuestionnaire';
import { ChatbotNeura } from './pages/ChatbotNeura';
import { PsychologistsAccess } from './pages/PsychologistsAccess';
import { MentalHealthEducation } from './pages/MentalHealthEducation';
import { StudyTechniques } from './pages/StudyTechniques';
import { PomodoroTimer } from './pages/PomodoroTimer';
import { EmotionalCheckIn } from './pages/EmotionalCheckIn';
import { BreathingExercise } from './pages/BreathingExercise';
import { Rewards } from './pages/Rewards';
import { Dashboard } from './pages/Dashboard';
import { Navigation } from './components/layout/Navigation';
import { ErrorBoundary } from './utils/errorBoundary';
import { Analytics } from '@vercel/analytics/react';

export type Page = 
  | 'questionnaire'
  | 'home'
  | 'chatbot'
  | 'psychologists'
  | 'mental-health'
  | 'study-techniques'
  | 'pomodoro'
  | 'check-in'
  | 'breathing'
  | 'rewards'
  | 'dashboard';

export interface UserData {
  hasCompletedQuestionnaire: boolean;
  stressLevel: number;
  focusLevel: number;
  sleepQuality: number;
  points: number;
  checkIns: Array<{ date: string; mood: number; energy: number }>;
  pomodoroSessions: number;
  lessonsCompleted: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('questionnaire');
  const [userData, setUserData] = useState<UserData>({
    hasCompletedQuestionnaire: false,
    stressLevel: 5,
    focusLevel: 5,
    sleepQuality: 5,
    points: 0,
    checkIns: [],
    pomodoroSessions: 0,
    lessonsCompleted: 0,
  });

  <Analytics />

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zenUserData');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setUserData(parsedData);
        if (parsedData.hasCompletedQuestionnaire) {
          setCurrentPage('home');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      // Reset to default state if data is corrupted
      localStorage.removeItem('zenUserData');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('zenUserData', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  }, [userData]);

  const handleQuestionnaireComplete = (results: {
    stressLevel: number;
    focusLevel: number;
    sleepQuality: number;
  }) => {
    setUserData({
      ...userData,
      ...results,
      hasCompletedQuestionnaire: true,
    });
    setCurrentPage('home');
  };

  const addPoints = (points: number) => {
    setUserData(prev => ({ ...prev, points: prev.points + points }));
  };

  const addCheckIn = (mood: number, energy: number) => {
    const today = new Date().toISOString().split('T')[0];
    setUserData(prev => ({
      ...prev,
      checkIns: [...prev.checkIns.filter(c => c.date !== today), { date: today, mood, energy }],
    }));
    addPoints(10);
  };

  const addPomodoroSession = () => {
    setUserData(prev => ({ ...prev, pomodoroSessions: prev.pomodoroSessions + 1 }));
    addPoints(20);
  };

  const addLessonCompleted = () => {
    setUserData(prev => ({ ...prev, lessonsCompleted: prev.lessonsCompleted + 1 }));
    addPoints(15);
  };

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'questionnaire':
          return <InitialQuestionnaire onComplete={handleQuestionnaireComplete} />;
        case 'home':
          return <Home userData={userData} onNavigate={setCurrentPage} />;
        case 'chatbot':
          return <ChatbotNeura />;
        case 'psychologists':
          return <PsychologistsAccess />;
        case 'mental-health':
          return <MentalHealthEducation onLessonComplete={addLessonCompleted} />;
        case 'study-techniques':
          return <StudyTechniques onLessonComplete={addLessonCompleted} />;
        case 'pomodoro':
          return <PomodoroTimer onSessionComplete={addPomodoroSession} />;
        case 'check-in':
          return <EmotionalCheckIn onCheckInComplete={addCheckIn} />;
        case 'breathing':
          return <BreathingExercise onComplete={() => addPoints(5)} />;
        case 'rewards':
          return <Rewards userData={userData} />;
        case 'dashboard':
          return <Dashboard userData={userData} />;
        default:
          return <Home userData={userData} onNavigate={setCurrentPage} />;
      }
    } catch (error) {
      console.error('Erro ao renderizar página:', error);
      return <Home userData={userData} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen grain-bg relative">
        {/* Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#FFF5ED] via-[#FDFAF6] to-[#F5EDE4] -z-10" />
        
        {userData.hasCompletedQuestionnaire && currentPage !== 'questionnaire' && (
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} points={userData.points} />
        )}
        <main className={userData.hasCompletedQuestionnaire && currentPage !== 'questionnaire' ? 'pb-20' : ''}>
          {renderPage()}
        </main>
      </div>
    </ErrorBoundary>
  );
}
