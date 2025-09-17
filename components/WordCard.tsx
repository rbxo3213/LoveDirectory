
import React from 'react';
import { WordEntry } from '../types';

interface WordCardProps {
  word: WordEntry;
  onEdit: () => void;
  onDelete: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <div>
        <h3 className="text-xl font-bold text-pink-600 break-words">{word.word}</h3>
        <p className="text-gray-600 mt-2 break-words">{word.meaning}</p>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={onEdit} className="text-sm text-gray-500 hover:text-blue-500 p-1">수정</button>
        <button onClick={onDelete} className="text-sm text-gray-500 hover:text-red-500 p-1">삭제</button>
      </div>
    </div>
  );
};

export default WordCard;
