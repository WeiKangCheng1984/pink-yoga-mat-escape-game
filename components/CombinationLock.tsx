'use client';

import { Puzzle } from '@/types/game';
import { useState } from 'react';
import { X, Check, ChevronUp, ChevronDown } from 'lucide-react';

interface CombinationLockProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function CombinationLock({ puzzle, onSolve, onClose, error: externalError, onErrorClear }: CombinationLockProps) {
  // 五位數密碼鎖，每個數字 0-9
  const [digits, setDigits] = useState<number[]>([0, 0, 0, 0, 0]);
  
  // 優先使用外部錯誤，如果沒有則使用內部錯誤
  const error = externalError;

  const handleDigitChange = (index: number, delta: number) => {
    setDigits(prev => {
      const newDigits = [...prev];
      newDigits[index] = (newDigits[index] + delta + 10) % 10; // 確保在 0-9 範圍內
      return newDigits;
    });
    if (onErrorClear) onErrorClear();
  };

  const handleSubmit = () => {
    // 將數字陣列轉換為字串（例如：[1,2,0,8,0] -> "12080"）
    const code = digits.join('');
    onSolve(code);
  };

  const currentCode = digits.join('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-[min(600px,100vmin)] w-full shadow-2xl">
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <div className="w-6 h-6 border-2 border-blue-400 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">密碼鎖</h3>
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

        {/* 密碼鎖顯示 */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            {digits.map((digit, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* 數字顯示 */}
                <div className="w-16 h-20 bg-dark-surface border-2 border-dark-border rounded-lg flex items-center justify-center mb-2 relative overflow-hidden">
                  <div className="text-3xl font-bold text-gray-200 select-none">{digit}</div>
                  {/* 旋轉按鈕 */}
                  <div className="absolute inset-0 flex flex-col">
                    <button
                      onClick={() => handleDigitChange(index, 1)}
                      className="flex-1 flex items-center justify-center hover:bg-blue-600/20 transition-colors cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        // 長按功能
                        const interval = setInterval(() => {
                          handleDigitChange(index, 1);
                        }, 100);
                        const stop = () => {
                          clearInterval(interval);
                          document.removeEventListener('mouseup', stop);
                          document.removeEventListener('touchend', stop);
                        };
                        document.addEventListener('mouseup', stop);
                        document.addEventListener('touchend', stop);
                      }}
                    >
                      <ChevronUp size={16} className="text-gray-400" />
                    </button>
                    <div className="h-px bg-dark-border"></div>
                    <button
                      onClick={() => handleDigitChange(index, -1)}
                      className="flex-1 flex items-center justify-center hover:bg-blue-600/20 transition-colors cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        // 長按功能
                        const interval = setInterval(() => {
                          handleDigitChange(index, -1);
                        }, 100);
                        const stop = () => {
                          clearInterval(interval);
                          document.removeEventListener('mouseup', stop);
                          document.removeEventListener('touchend', stop);
                        };
                        document.addEventListener('mouseup', stop);
                        document.addEventListener('touchend', stop);
                      }}
                    >
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                {/* 位置標記 */}
                <div className="text-xs text-gray-500">{index + 1}</div>
              </div>
            ))}
          </div>
          
          {/* 當前密碼顯示 */}
          <div className="text-center mb-4">
            <div className="text-xs text-gray-400 mb-1">當前密碼</div>
            <div className="text-2xl font-mono font-bold text-gray-200 tracking-wider">{currentCode}</div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-950/30 border-2 border-red-700/70 rounded-lg text-sm text-red-300 flex items-center gap-2 animate-pulse">
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
            解鎖
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

