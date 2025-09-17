import React, { useState } from 'react';
import Button from './common/Button';
import Input from './common/Input';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onKakaoLogin: () => Promise<void>;
  onNavigateToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onKakaoLogin, onNavigateToSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onLogin(username.trim(), password.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKakao = async () => {
    setError('');
    setIsLoading(true);
    try {
      await onKakaoLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : '카카오 로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-white p-4">
      <div className="w-full max-w-sm mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-2">사랑방언 단어장</h1>
        <p className="text-gray-600 mb-6">로그인하여 우리만의 사전을 펼쳐보세요.</p>
        
        <div className="space-y-4">
          <button 
            onClick={handleKakao}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-[#FEE500] text-[#191919] hover:bg-yellow-400 disabled:opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.161c-6.627 0-12 4.418-12 9.854 0 4.133 2.652 7.74 6.438 9.222.029.289.049.529.05.718l.001.161.025.759c.063 1.892.427 2.923.427 2.923l.012.029c.218.495.594.905 1.054 1.189.516.319 1.125.433 1.761.344l.235-.031c1.841-.289 3.255-1.488 4.238-2.618 1.439.23 2.946.353 4.498.353 6.627 0 12-4.418 12-9.854S18.627 1.161 12 1.161Z"/>
              </svg>
              카카오로 시작하기
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/0 backdrop-blur-sm px-2 text-gray-500">또는</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="username"
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={isLoading}
            />
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <p className="text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <button onClick={onNavigateToSignUp} className="font-semibold text-red-500 hover:underline">
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;