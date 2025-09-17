import React, { useState } from 'react';
import { User, Dictionary } from '../types';
import Button from './common/Button';
import Input from './common/Input';
import Modal from './common/Modal';

interface SettingsViewProps {
  user: User;
  dictionary: Dictionary;
  onUpdateName: (newName: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, dictionary, onUpdateName, onDelete }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(dictionary.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.dictionaryCode || '');
    alert('비밀 코드가 복사되었습니다!');
  };

  const handleNameSave = async () => {
    if (!newName.trim() || newName.trim() === dictionary.name) {
      setIsEditingName(false);
      return;
    }
    setIsSaving(true);
    try {
      await onUpdateName(newName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update name:", error);
      alert('이름 변경에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
        await onDelete();
        setIsDeleteModalOpen(false);
    } catch (error) {
        console.error("Failed to delete dictionary:", error);
        alert('삭제에 실패했습니다.');
    }
  }
  
  const formatDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-8">설정</h2>

      {/* Dictionary Info Section */}
      <div className="space-y-6 border-b border-gray-200 pb-6 mb-6">
        <h3 className="text-lg font-semibold text-pink-600">단어장 정보</h3>
        {/* Dictionary Name */}
        <div>
          <label className="text-sm font-medium text-gray-500">단어장 이름</label>
          {!isEditingName ? (
            <div className="flex items-center justify-between mt-1">
              <p className="text-lg text-gray-800">{dictionary.name}</p>
              <button onClick={() => setIsEditingName(true)} className="text-sm text-blue-500 hover:underline">
                수정
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mt-1">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={12}
                disabled={isSaving}
              />
              <Button onClick={handleNameSave} disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장'}
              </Button>
              <Button variant="secondary" onClick={() => setIsEditingName(false)}>취소</Button>
            </div>
          )}
        </div>

        {/* Secret Code */}
        <div>
          <label className="text-sm font-medium text-gray-500">비밀 코드</label>
          <div className="flex items-center justify-between mt-1 bg-gray-100 p-3 rounded-lg">
            <p className="text-lg text-gray-800 font-mono tracking-wider">{user.dictionaryCode}</p>
            <button onClick={handleCopyCode} className="text-sm text-blue-500 hover:underline">
              복사
            </button>
          </div>
        </div>
        
        {/* Creation Date */}
        <div>
            <label className="text-sm font-medium text-gray-500">생성일</label>
            <p className="text-lg text-gray-800 mt-1">{formatDate(dictionary.createdAt)}</p>
        </div>
      </div>

      {/* Dictionary Management Section */}
      <div>
        <h3 className="text-lg font-semibold text-red-600">단어장 관리</h3>
        <div className="flex items-start sm:items-center justify-between mt-2 flex-col sm:flex-row">
            <p className="text-sm text-gray-600 max-w-md">단어장을 삭제합니다. 이 작업은 되돌릴 수 없으며, 연결된 모든 사용자의 접근 권한이 사라집니다.</p>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)} className="mt-3 sm:mt-0 flex-shrink-0">
                단어장 삭제
            </Button>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="정말 삭제하시겠습니까?">
        <div className="text-gray-600">
            <p>이 단어장을 삭제하면 모든 단어 기록이 영구적으로 사라집니다.</p>
            <p className="font-semibold mt-2">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>삭제 확인</Button>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsView;