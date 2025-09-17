// FIX: Full implementation of the StatsView component.
import React from 'react';
import { StatsData } from '../types';

interface StatsViewProps {
  statsData: StatsData[];
}

const StatsView: React.FC<StatsViewProps> = ({ statsData }) => {
  const totalFrequency = statsData.reduce((sum, item) => sum + item.frequency, 0);

  const colors = [
    'bg-red-400',
    'bg-pink-400',
    'bg-red-300',
    'bg-pink-300',
    'bg-gray-400',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">우리 단어장 통계</h2>
      <p className="text-gray-500 mb-8">우리의 사랑방언은 어떤 종류가 가장 많을까요?</p>

      {statsData.length === 0 ? (
        <div className="text-center py-16 px-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">데이터가 부족해요</h3>
            <p className="mt-1 text-sm text-gray-500">단어를 더 추가하면 통계를 볼 수 있어요.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {statsData.map((item, index) => {
            const percentage = totalFrequency > 0 ? (item.frequency / totalFrequency) * 100 : 0;
            return (
              <div key={item.name} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-500">{item.frequency}개 ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`${colors[index % colors.length]} h-4 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default StatsView;
