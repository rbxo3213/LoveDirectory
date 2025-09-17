import React from 'react';

interface AnalysisProgressToastProps {
  progress: number;
}

const AnalysisProgressToast: React.FC<AnalysisProgressToastProps> = ({ progress }) => {
  return (
    <div className="fixed bottom-5 right-5 w-full max-w-sm bg-white rounded-xl shadow-2xl p-4 z-50 border border-pink-200 animate-slide-up">
      <div className="flex items-center space-x-3 mb-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
          <h3 className="font-semibold text-pink-600">AI가 대화를 분석하고 있어요...</h3>
      </div>
      <p className="text-sm text-gray-500 mb-3">다른 화면으로 이동해도 괜찮습니다. ({progress}%)</p>
      
      <div className="w-full bg-pink-100 rounded-full h-2.5">
        <div 
          className="bg-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default AnalysisProgressToast;