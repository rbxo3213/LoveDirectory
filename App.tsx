// FIX: Full implementation of the main App component.
import { useState, useEffect, useCallback } from 'react';
import { User, Dictionary } from './types';
import * as authService from './services/authService';
import * as dictionaryService from './services/dictionaryService';
import * as geminiService from './services/geminiService';

import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import DictionaryView from './components/DictionaryView';
import Header from './components/Header';
import StatsView from './components/StatsView';
import FunFeature from './components/FunFeature';
import QuizView from './components/QuizView';
import SettingsView from './components/SettingsView';
import ChatImportView from './components/ChatImportView';
import BottomNavBar from './components/common/BottomNavBar';
import AnalysisProgressToast from './components/common/AnalysisProgressToast';

type View = 'dictionary' | 'stats' | 'import' | 'quiz' | 'fun' | 'settings';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [currentView, setCurrentView] = useState<View>('dictionary');
  const [statsData, setStatsData] = useState<any[]>([]);

  // Chat import state
  const [analysisResults, setAnalysisResults] = useState<{ word: string; meaning: string }[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const [page, setPage] = useState<'login' | 'signup'>('login');

  const loadDictionaryData = useCallback(async (code: string) => {
    const dict = await dictionaryService.getDictionary(code);
    setDictionary(dict);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setAuthStatus('authenticated');
        if (currentUser.dictionaryCode) {
          loadDictionaryData(currentUser.dictionaryCode);
        }
      } else {
        setAuthStatus('unauthenticated');
        setPage('login');
      }
    };
    checkUser();
  }, [loadDictionaryData]);

  const handleLogin = async (username: string, password: string) => {
    const loggedInUser = await authService.login(username, password);
    setUser(loggedInUser);
    setAuthStatus('authenticated');
    if (loggedInUser.dictionaryCode) {
      await loadDictionaryData(loggedInUser.dictionaryCode);
    }
  };
  
  const handleKakaoLogin = async () => {
    const loggedInUser = await authService.loginWithKakao();
    setUser(loggedInUser);
    setAuthStatus('authenticated');
    if (loggedInUser.dictionaryCode) {
      await loadDictionaryData(loggedInUser.dictionaryCode);
    }
  };

  const handleSignUp = async (username: string, password: string) => {
    const newUser = await authService.signUp(username, password);
    setUser(newUser);
    setAuthStatus('authenticated');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setDictionary(null);
    setAuthStatus('unauthenticated');
    setPage('login');
    setCurrentView('dictionary');
  };

  const handleCreateDictionary = async (name: string): Promise<string> => {
    if (!user) throw new Error("User not logged in");
    const secretCode = `code_${Date.now()}`;
    await dictionaryService.createDictionary(secretCode, name);
    const updatedUser = await authService.updateUserDictionaryCode(user.id, secretCode);
    setUser(updatedUser);
    await loadDictionaryData(secretCode);
    return secretCode;
  };
  
  const handleJoinDictionary = async (code: string) => {
    if (!user) throw new Error("User not logged in");
    const dict = await dictionaryService.getDictionary(code);
    if (!dict) {
      throw new Error("Invalid dictionary code.");
    }
    const updatedUser = await authService.updateUserDictionaryCode(user.id, code);
    setUser(updatedUser);
    await loadDictionaryData(code);
  };
  
  const refreshDictionary = useCallback(async () => {
      if (user?.dictionaryCode) {
          await loadDictionaryData(user.dictionaryCode);
      }
  }, [user, loadDictionaryData]);

  const handleAddWord = async (word: string, meaning: string) => {
    if (!user?.dictionaryCode) return;
    await dictionaryService.addWord(user.dictionaryCode, word, meaning);
    await refreshDictionary();
  };
  
  const handleUpdateWord = async (id: string, word: string, meaning: string) => {
    if (!user?.dictionaryCode) return;
    await dictionaryService.updateWord(user.dictionaryCode, id, { word, meaning });
    await refreshDictionary();
  };

  const handleDeleteWord = async (id: string) => {
    if (!user?.dictionaryCode) return;
    await dictionaryService.deleteWord(user.dictionaryCode, id);
    await refreshDictionary();
  };

  const handleUpdateDictionaryName = async (newName: string) => {
      if (!user?.dictionaryCode) return;
      await dictionaryService.updateDictionaryName(user.dictionaryCode, newName);
      await refreshDictionary();
  };

  const handleDeleteDictionary = async () => {
      if (!user?.dictionaryCode) return;
      const codeToDelete = user.dictionaryCode;
      await dictionaryService.deleteDictionary(codeToDelete);
      await authService.removeDictionaryCodeFromUsers(codeToDelete);
      const refreshedUser = authService.getCurrentUser();
      setUser(refreshedUser);
      setDictionary(null);
      setCurrentView('dictionary');
  }
  
  const handleNavigate = async (view: View) => {
    if (view === 'stats') {
        const data = await dictionaryService.getStats();
        setStatsData(data);
    }
    if (view === 'import') {
        setAnalysisResults(null);
        setAnalysisError(null);
    }
    setCurrentView(view);
  };

  const handleStartAnalysis = async (chatText: string) => {
    if (!dictionary) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResults(null);
    setAnalysisProgress(0);

    try {
        const stream = geminiService.findWordsInChatStream(chatText, dictionary.words);
        let results: { word: string; meaning: string }[] = [];
        for await (const chunk of stream) {
            if (chunk.progress) {
                setAnalysisProgress(chunk.progress);
            }
            if (chunk.words) {
                results = [...results, ...chunk.words];
                setAnalysisResults([...results]); 
            }
        }
        setAnalysisProgress(100);
    } catch (err) {
        setAnalysisError(err instanceof Error ? err.message : 'Analysis failed.');
    } finally {
        setIsAnalyzing(false);
        setTimeout(() => setAnalysisProgress(0), 2000);
    }
  };

  const handleAddWordsFromAnalysis = async (words: { word: string, meaning: string }[]) => {
      if (!user?.dictionaryCode) return;
      await Promise.all(words.map(w => dictionaryService.addWord(user.dictionaryCode!, w.word, w.meaning)));
      await refreshDictionary();
      alert(`${words.length}개의 단어가 추가되었습니다!`);
      setCurrentView('dictionary');
  };

  if (authStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-pink-50">Loading...</div>;
  }
  
  if (authStatus === 'unauthenticated' || !user) {
    if (page === 'signup') {
        return <SignUpScreen onSignUp={handleSignUp} onNavigateToLogin={() => setPage('login')} />;
    }
    return <LoginScreen onLogin={handleLogin} onKakaoLogin={handleKakaoLogin} onNavigateToSignUp={() => setPage('signup')} />;
  }
  
  if (!dictionary || !user.dictionaryCode) {
    return <HomeScreen user={user} onCreate={handleCreateDictionary} onJoin={handleJoinDictionary} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dictionary':
        return <DictionaryView dictionary={dictionary} onAddWord={handleAddWord} onUpdateWord={handleUpdateWord} onDeleteWord={handleDeleteWord} />;
      case 'stats':
        return <StatsView statsData={statsData} />;
      case 'import':
        return <ChatImportView 
            onStartAnalysis={handleStartAnalysis}
            analysisResults={analysisResults}
            isAnalyzing={isAnalyzing && analysisProgress < 100}
            error={analysisError}
            onAddWords={handleAddWordsFromAnalysis}
        />;
      case 'fun':
        return <FunFeature />;
      case 'quiz':
        return <QuizView words={dictionary.words} />;
      case 'settings':
        return <SettingsView user={user} dictionary={dictionary} onUpdateName={handleUpdateDictionaryName} onDelete={handleDeleteDictionary} />;
      default:
        return <DictionaryView dictionary={dictionary} onAddWord={handleAddWord} onUpdateWord={handleUpdateWord} onDeleteWord={handleDeleteWord} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-50 via-pink-50 to-white min-h-screen font-sans">
      <Header 
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        dictionaryName={dictionary.name}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {renderContent()}
      </main>
      <BottomNavBar currentView={currentView} onNavigate={handleNavigate} />
      {isAnalyzing && analysisProgress > 0 && analysisProgress < 100 && <AnalysisProgressToast progress={analysisProgress} />}
    </div>
  );
}

export default App;