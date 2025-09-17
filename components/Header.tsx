import React from 'react';
import Button from './common/Button';

type View = 'dictionary' | 'stats' | 'import' | 'quiz' | 'fun' | 'settings';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  dictionaryName: string;
}

const NavItem: React.FC<{
  view: View;
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}> = ({ view, currentView, onNavigate, children }) => {
  const isActive = view === currentView;
  const classes = isActive
    ? 'bg-pink-100 text-pink-700'
    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600';
  return (
    <button
      onClick={() => onNavigate(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${classes}`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onLogout, dictionaryName }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-red-500">{dictionaryName}</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavItem view="dictionary" currentView={currentView} onNavigate={onNavigate}>단어장</NavItem>
            <NavItem view="import" currentView={currentView} onNavigate={onNavigate}>대화 가져오기</NavItem>
            <NavItem view="quiz" currentView={currentView} onNavigate={onNavigate}>퀴즈</NavItem>
            <NavItem view="fun" currentView={currentView} onNavigate={onNavigate}>AI 추천</NavItem>
            <NavItem view="stats" currentView={currentView} onNavigate={onNavigate}>통계</NavItem>
            <NavItem view="settings" currentView={currentView} onNavigate={onNavigate}>설정</NavItem>
          </nav>
          <div className="flex items-center">
             <Button onClick={onLogout} variant="secondary" className="px-4 py-1.5 text-sm">
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;