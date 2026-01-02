'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface ArrangementPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function ArrangementPuzzle({ puzzle, onSolve, onClose, error: externalError, onErrorClear }: ArrangementPuzzleProps) {
  // 從 solution 獲取所有選項，並打亂順序
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [internalError, setInternalError] = useState('');
  
  // 優先使用外部錯誤，如果沒有則使用內部錯誤
  const error = externalError || internalError;

  useEffect(() => {
    if (Array.isArray(puzzle.solution)) {
      // 打亂順序
      const shuffled = [...puzzle.solution].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
    }
  }, [puzzle.solution]);

  const handleOptionClick = (option: string) => {
    if (selected.includes(option)) {
      // 如果已選擇，從選擇列表中移除
      setSelected(selected.filter(item => item !== option));
    } else {
      // 如果未選擇，添加到選擇列表
      setSelected([...selected, option]);
    }
    setInternalError('');
    if (onErrorClear) onErrorClear();
  };

  const handleReset = () => {
    setSelected([]);
    setInternalError('');
    if (onErrorClear) onErrorClear();
    // 重新打亂選項
    if (Array.isArray(puzzle.solution)) {
      const shuffled = [...puzzle.solution].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
    }
  };

  const handleSubmit = () => {
    // 清除錯誤
    setInternalError('');
    if (onErrorClear) onErrorClear();
    
    if (selected.length === 0) {
      setInternalError('請至少選擇一個選項');
      return;
    }
    onSolve(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Check size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">排列病床</h3>
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

        {/* 選擇說明 */}
        {puzzle.id !== 'bed_arrangement' && (
          <div className="mb-4 text-sm text-gray-400">
            按照職位高低順序，依序點選以下選項：
          </div>
        )}

        {/* 可選選項（打亂順序） */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => {
              const isSelected = selected.includes(option);
              const selectionOrder = selected.indexOf(option) + 1;
              
              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg'
                      : 'bg-dark-surface/50 border-dark-border text-gray-300 hover:bg-dark-surface hover:border-dark-border hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isSelected && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        {selectionOrder}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 已選擇的順序 */}
        {selected.length > 0 && (
          <div className="mb-6 p-4 bg-dark-surface/30 border border-dark-border rounded-lg">
            <div className="text-xs text-gray-400 mb-2">已選擇的順序：</div>
            <div className="flex flex-wrap gap-2">
              {selected.map((item, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/50 rounded-lg text-sm text-blue-300 flex items-center gap-2"
                >
                  <span className="text-xs text-blue-400">{index + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 錯誤提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/30 border-2 border-red-700/70 rounded-lg text-sm text-red-300 flex items-center gap-2 animate-pulse z-[60] relative">
            <X size={16} className="flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* 按鈕組 */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            重置
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
          >
            <Check size={18} />
            確認排列
          </button>
        </div>
      </div>
    </div>
  );
}

