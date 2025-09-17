
import React, { useState, useEffect } from 'react';
import { WordEntry } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';

interface AddEditWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (word: string, meaning: string) => Promise<void>;
  word: WordEntry | null;
}

const AddEditWordModal: React.FC<AddEditWordModalProps> = ({ isOpen, onClose, onSave, word }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [currentMeaning, setCurrentMeaning] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (word) {
      setCurrentWord(word.word);
      setCurrentMeaning(word.meaning);
    } else {
      setCurrentWord('');
      setCurrentMeaning('');
    }
  }, [word, isOpen]);

  const handleSave = async () => {
    if (!currentWord.trim() || !currentMeaning.trim()) {
      alert('단어와 의미를 모두 입력해주세요.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(currentWord, currentMeaning);
      onClose();
    } catch (error) {
      console.error("Failed to save word:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={word ? '단어 수정' : '새 단어 추가'}>
      <div className="space-y-4">
        <Input
          id="word"
          label="단어"
          placeholder="예: 찹쌀미"
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
        />
        <Input
          id="meaning"
          label="의미"
          placeholder="예: 볼이 찹쌀떡처럼 하얗고 귀여워서"
          value={currentMeaning}
          onChange={(e) => setCurrentMeaning(e.target.value)}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>취소</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditWordModal;
