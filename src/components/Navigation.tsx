import { Home, MessageCircle, Users, BookOpen, Timer, Heart, Award, BarChart3 } from 'lucide-react';
import type { Page } from '../App';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  points: number;
}

export function Navigation({ currentPage, onNavigate, points }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Início' },
    { id: 'chatbot' as Page, icon: MessageCircle, label: 'Neura' },
    { id: 'check-in' as Page, icon: Heart, label: 'Check-in' },
    { id: 'pomodoro' as Page, icon: Timer, label: 'Estudo' },
    { id: 'dashboard' as Page, icon: BarChart3, label: 'Análise' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="glass rounded-3xl shadow-2xl px-2 py-3">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#E07B4F] text-white scale-105' 
                      : 'text-[#8B8378] hover:text-[#E07B4F] hover:bg-[#FFF5ED]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform duration-300`} />
                  <span className="text-xs whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Floating Points Badge */}
        <div className="absolute -top-6 right-4 bg-gradient-to-r from-[#E07B4F] to-[#D4A373] text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span className="font-medium">{points}</span>
        </div>
      </div>
    </nav>
  );
}
