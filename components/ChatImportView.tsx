import React, { useState } from 'react';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

interface FoundWord {
  word: string;
  meaning: string;
}

interface ChatImportViewProps {
  onStartAnalysis: (chatText: string) => void;
  analysisResults: FoundWord[] | null;
  isAnalyzing: boolean;
  error: string | null;
  onAddWords: (words: FoundWord[]) => Promise<void>;
}

const ChatImportView: React.FC<ChatImportViewProps> = ({ 
  onStartAnalysis, 
  analysisResults, 
  isAnalyzing, 
  error, 
  onAddWords 
}) => {
  const [selectedWords, setSelectedWords] = useState<Record<number, boolean>>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onStartAnalysis(text);
      };
      reader.readAsText(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  React.useEffect(() => {
    if (analysisResults) {
      // Pre-select all found words when results arrive
      const initialSelection: Record<number, boolean> = {};
      analysisResults.forEach((_, index) => {
        initialSelection[index] = true;
      });
      setSelectedWords(initialSelection);
    }
  }, [analysisResults]);

  const handleToggleWord = (index: number) => {
    setSelectedWords(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddSelectedWords = async () => {
    if (!analysisResults) return;
    const wordsToAdd = analysisResults.filter((_, index) => selectedWords[index]);
    if (wordsToAdd.length === 0) {
      alert('추가할 단어를 선택해주세요.');
      return;
    }
    await onAddWords(wordsToAdd);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">대화 내용에서 단어 찾기</h2>
      <p className="text-gray-500 mb-6">카카오톡 대화 내보내기(.txt) 파일을 첨부하면 AI가 자동으로 우리만의 단어를 찾아줘요.</p>
      
      {!analysisResults && !isAnalyzing && (
        <div className="text-center border-2 border-dashed border-pink-200 rounded-lg p-10">
            <label htmlFor="file-upload" className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="mt-2 block text-lg font-semibold text-pink-600">대화 파일(.txt) 첨부하기</span>
                <p className="text-sm text-gray-500">파일을 선택하거나 여기에 드래그하세요.</p>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt" onChange={handleFileChange} disabled={isAnalyzing} />
        </div>
      )}

      {isAnalyzing && <div className="mt-8 text-center"><LoadingSpinner /><p className="mt-4 text-gray-600">AI 분석이 진행 중입니다. 다른 화면으로 이동해도 괜찮아요!</p></div>}
      
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg mt-8">{error}</p>}
      
      {analysisResults && !isAnalyzing && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">분석 결과 ({analysisResults.length}개 발견)</h3>
          <p className="text-sm text-gray-500 mb-4">단어장에 추가할 단어를 선택하세요.</p>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {analysisResults.map((item, index) => (
              <div key={index} className={`flex items-start p-4 rounded-lg transition ${selectedWords[index] ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'} border cursor-pointer`} onClick={() => handleToggleWord(index)}>
                <input
                  type="checkbox"
                  checked={!!selectedWords[index]}
                  onChange={() => handleToggleWord(index)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
                <div className="ml-4">
                  <p className="font-bold text-pink-700">{item.word}</p>
                  <p className="text-gray-600">{item.meaning}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button onClick={handleAddSelectedWords}>
              선택한 단어 {Object.values(selectedWords).filter(Boolean).length}개 추가하기
            </Button>
          </div>
        </div>
      )}
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

export default ChatImportView;