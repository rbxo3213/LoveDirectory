import React, { useState } from 'react';
import { WordEntry, Dictionary } from '../types';
import WordCard from './WordCard';
import AddEditWordModal from './AddEditWordModal';
import Button from './common/Button';

interface DictionaryViewProps {
  dictionary: Dictionary;
  onAddWord: (word: string, meaning: string) => Promise<void>;
  onUpdateWord: (id: string, word: string, meaning:string) => Promise<void>;
  onDeleteWord: (id: string) => Promise<void>;
}

const DictionaryView: React.FC<DictionaryViewProps> = ({ dictionary, onAddWord, onUpdateWord, onDeleteWord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordEntry | null>(null);
  const words = dictionary.words;

  const handleOpenAddModal = () => {
    setEditingWord(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (word: WordEntry) => {
    setEditingWord(word);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWord(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">{dictionary.name}</h2>
        <Button onClick={handleOpenAddModal}>새 단어 추가</Button>
      </div>

      {words.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.747-5.747h11.494" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">단어가 없어요</h3>
            <p className="mt-1 text-sm text-gray-500">첫 번째 사랑방언을 추가해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onEdit={() => handleOpenEditModal(word)}
              onDelete={() => onDeleteWord(word.id)}
            />
          ))}
        </div>
      )}
      
      <AddEditWordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={editingWord ? (w, m) => onUpdateWord(editingWord.id, w, m) : onAddWord}
        word={editingWord}
      />
    </div>
  );
};

export default DictionaryView;
