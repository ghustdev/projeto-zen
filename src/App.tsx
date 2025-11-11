import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { InitialQuestionnaire } from './components/InitialQuestionnaire';
import { ChatbotNeura } from './components/ChatbotNeura';
import { PsychologistsAccess } from './components/PsychologistsAccess';
import { MentalHealthEducation } from './components/MentalHealthEducation';
import { StudyTechniques } from './components/StudyTechniques';
import { PomodoroTimer } from './components/PomodoroTimer';
import { EmotionalCheckIn } from './components/EmotionalCheckIn';
import { BreathingExercise } from './components/BreathingExercise';
import { Rewards } from './components/Rewards';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';

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

  useEffect(() => {
    const saved = localStorage.getItem('zenUserData');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setUserData(parsedData);
      if (parsedData.hasCompletedQuestionnaire) {
        setCurrentPage('home');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zenUserData', JSON.stringify(userData));
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
  };

  return (
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
  );
}
