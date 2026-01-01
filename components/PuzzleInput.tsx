'use client';

import { Puzzle } from '@/types/game';
import { useState } from 'react';
import { X, Check, HelpCircle } from 'lucide-react';

interface PuzzleInputProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function PuzzleInput({ puzzle, onSolve, onClose, error: externalError, onErrorClear }: PuzzleInputProps) {
  const [input, setInput] = useState('');
  const [internalError, setInternalError] = useState('');
  
  // 優先使用外部錯誤，如果沒有則使用內部錯誤
  const error = externalError || internalError;

  const handleSubmit = () => {
    // 清除錯誤
    setInternalError('');
    if (onErrorClear) onErrorClear();
    
    if (puzzle.type === 'input') {
      onSolve(input);
    } else if (puzzle.type === 'sequence') {
      // 處理序列輸入
      const sequence = input.split(',').map(s => s.trim());
      onSolve(sequence);
    } else if (puzzle.type === 'combination') {
      // 處理組合輸入（將輸入轉換成陣列）
      const combination = input.split(',').map(s => s.trim()).filter(s => s.length > 0);
      onSolve(combination);
    } else {
      onSolve(input);
    }
    // 不自動清空輸入，讓用戶可以修改
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <HelpCircle size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">謎題</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 提示 */}
        {puzzle.hint && (
          <div className="mb-6 p-4 bg-dark-surface/50 border border-dark-border rounded-lg">
            <div className="text-xs text-gray-400 mb-1">提示</div>
            <div className="text-sm text-gray-300 leading-relaxed">{puzzle.hint}</div>
          </div>
        )}

        {/* 輸入框 */}
        <div className="mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setInternalError('');
              if (onErrorClear) onErrorClear();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="輸入答案..."
            autoFocus
          />
          {error && (
            <div className="mt-3 p-3 bg-red-950/30 border-2 border-red-700/70 rounded-lg text-sm text-red-300 flex items-center gap-2 animate-pulse z-[60] relative">
              <X size={16} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* 按鈕組 */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
          >
            <Check size={18} />
            確認
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

