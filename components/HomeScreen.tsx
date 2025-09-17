import React, { useState } from 'react';
import { User } from '../types';
import Button from './common/Button';
import Input from './common/Input';

interface HomeScreenProps {
  user: User;
  onCreate: (name: string) => Promise<string>;
  onJoin: (code: string) => Promise<void>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onCreate, onJoin }) => {
  const [joinCode, setJoinCode] = useState('');
  const [dictionaryName, setDictionaryName] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!dictionaryName.trim()) {
      setError('단어장 이름을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const newCode = await onCreate(dictionaryName.trim());
      setCreatedCode(newCode);
    } catch (err) {
      setError('단어장 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
        setError('비밀 코드를 입력해주세요.');
        return;
    }
    setIsLoading(true);
    setError('');
    try {
      await onJoin(joinCode.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : '참여에 실패했습니다. 코드를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (createdCode) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-pink-600">단어장 생성 완료!</h2>
                <p className="text-gray-600 mt-4 mb-6">연인에게 아래 코드를 공유해서 함께 단어장을 채워나가세요.</p>
                <div className="bg-pink-100 text-pink-800 font-bold text-2xl tracking-widest p-4 rounded-lg">
                    {createdCode}
                </div>
                 <p className="text-xs text-gray-400 mt-4">
                    이 코드는 설정 화면에서 다시 확인할 수 있습니다.
                </p>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          안녕하세요, <span className="text-red-500">{user.username}</span>님!
        </h1>
        <p className="text-gray-600 mt-2 mb-8">시작할 준비가 되셨나요?</p>

        <div className="space-y-6">
          {/* Create Dictionary */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-red-700">새로운 단어장 만들기</h2>
            <p className="text-sm text-red-600 mt-1 mb-4">
              연인과 공유할 수 있는 비밀 코드가 생성됩니다.
            </p>
            <div className="space-y-3">
              <Input
                id="dictionary-name"
                placeholder="단어장 이름 (12자 이내)"
                value={dictionaryName}
                onChange={(e) => setDictionaryName(e.target.value)}
                maxLength={12}
                disabled={isLoading}
              />
              <Button onClick={handleCreate} disabled={isLoading} className="w-full">
                {isLoading ? '생성 중...' : '만들기'}
              </Button>
            </div>
          </div>

          {/* Join Dictionary */}
          <div className="bg-pink-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-pink-700">기존 단어장 참여하기</h2>
            <p className="text-sm text-pink-600 mt-1 mb-4">
              연인에게 공유받은 비밀 코드를 입력하세요.
            </p>
            <form onSubmit={handleJoin} className="flex space-x-2">
              <Input
                id="join-code"
                placeholder="비밀 코드"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" variant="secondary" disabled={isLoading}>
                참여
              </Button>
            </form>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default HomeScreen;
