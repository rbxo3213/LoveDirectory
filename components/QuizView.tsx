// FIX: Full implementation of the QuizView component.
import React, { useState, useEffect, useMemo } from 'react';
import { WordEntry } from '../types';
import Button from './common/Button';

interface QuizViewProps {
  words: WordEntry[];
}

const QUIZ_LENGTH = 5;

const QuizView: React.FC<QuizViewProps> = ({ words }) => {
  const [quizState, setQuizState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<WordEntry[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const shuffledWords = useMemo(() => [...words].sort(() => 0.5 - Math.random()), [words]);

  const generateQuestion = (questionIndex: number) => {
    if (questionIndex >= questions.length) return;
    
    const question = questions[questionIndex];
    const correctAnswer = question.word;
    
    const wrongAnswers = shuffledWords
      .filter(w => w.id !== question.id)
      .slice(0, 3)
      .map(w => w.word);

    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };
  
  const startQuiz = () => {
    const quizQuestions = shuffledWords.slice(0, Math.min(QUIZ_LENGTH, shuffledWords.length));
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizState('playing');
  };

  useEffect(() => {
    if (quizState === 'playing' && questions.length > 0) {
      generateQuestion(currentQuestionIndex);
    }
  }, [quizState, currentQuestionIndex, questions]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correctAnswer = questions[currentQuestionIndex].word;
    if (answer === correctAnswer) {
      setIsCorrect(true);
      setScore(s => s + 1);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setQuizState('finished');
      }
    }, 1500);
  };
  
  const getButtonClass = (option: string) => {
    if (!selectedAnswer) return 'bg-white hover:bg-pink-50';
    const correctAnswer = questions[currentQuestionIndex].word;
    if (option === correctAnswer) return 'bg-green-200 border-green-400';
    if (option === selectedAnswer) return 'bg-red-200 border-red-400';
    return 'bg-white opacity-60';
  }

  if (words.length < 4) {
    return (
       <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">퀴즈를 풀 준비가 안됐어요!</h2>
        <p className="text-gray-500">퀴즈를 만들려면 단어가 4개 이상 필요해요. 단어를 더 추가해주세요.</p>
      </div>
    );
  }

  if (quizState === 'idle') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">사랑방언 퀴즈</h2>
        <p className="text-gray-500 mb-6">우리만의 단어를 얼마나 잘 알고 있는지 테스트해보세요!</p>
        <Button onClick={startQuiz}>퀴즈 시작하기</Button>
      </div>
    );
  }

  if (quizState === 'finished') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">퀴즈 종료!</h2>
        <p className="text-gray-500 mb-6">총 {questions.length}문제 중 <span className="font-bold text-pink-500 text-lg">{score}</span>개를 맞췄어요!</p>
        <Button onClick={startQuiz}>다시 풀어보기</Button>
      </div>
    );
  }
  
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-pink-600">사랑방언 퀴즈</h2>
            <p className="text-gray-600 font-semibold">{currentQuestionIndex + 1} / {questions.length}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-6 my-6 text-center">
            <p className="text-sm text-pink-700 mb-2">이 설명에 해당하는 단어는?</p>
            <p className="text-lg font-semibold text-gray-800">{currentQ?.meaning}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map(option => (
                <button 
                    key={option} 
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-lg border-2 border-transparent text-center font-semibold transition-all duration-300 ${getButtonClass(option)} disabled:cursor-not-allowed`}
                >
                    {option}
                </button>
            ))}
        </div>
        {isCorrect !== null && (
            <div className={`mt-6 text-center font-bold text-lg animate-fade-in ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '정답입니다!' : '아쉬워요!'}
            </div>
        )}
        <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuizView;
