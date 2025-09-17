import React, { useState } from 'react';
import Button from './common/Button';
import Input from './common/Input';

interface SignUpScreenProps {
  onSignUp: (username: string, password: string) => Promise<void>;
  onNavigateToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onSignUp(username.trim(), password.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-white p-4">
      <div className="w-full max-w-sm mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-2">회원가입</h1>
        <p className="text-gray-600 mb-6">우리만의 공간을 만들어보세요.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="new-username"
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            id="new-password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            id="confirm-password"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '가입 중...' : '가입하기'}
          </Button>
        </form>
        <p className="text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <button onClick={onNavigateToLogin} className="font-semibold text-red-500 hover:underline">
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;
