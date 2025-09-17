
import React, { useState } from 'react';
import { generateLoveDialectOfTheDay } from '../services/geminiService';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

const FunFeature: React.FC = () => {
  const [generated, setGenerated] = useState<{ word: string; meaning: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGenerated(null);
    try {
      const result = await generateLoveDialectOfTheDay();
      setGenerated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">오늘의 사랑방언</h2>
      <p className="text-gray-500 mb-8">AI가 새로운 사랑방언을 추천해드려요!</p>

      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? '생성 중...' : '새로운 단어 만들기'}
      </Button>

      <div className="mt-8 min-h-[150px] flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
        {generated && (
           <div className="bg-white rounded-2xl shadow-lg p-8 w-full animate-fade-in">
             <h3 className="text-3xl font-bold text-red-500">{generated.word}</h3>
             <p className="text-gray-600 mt-3 text-lg">{generated.meaning}</p>
           </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FunFeature;
