'use client';

import { Puzzle } from '@/types/game';
import { useState } from 'react';
import { X, Check, HelpCircle, Anchor, AlertCircle } from 'lucide-react';

interface VisualSelectionPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function VisualSelectionPuzzle({ 
  puzzle, 
  onSolve, 
  onClose, 
  error: externalError, 
  onErrorClear 
}: VisualSelectionPuzzleProps) {
  // 判斷是否為多選模式（答案為陣列且長度大於1）
  const isMultiSelect = Array.isArray(puzzle.solution) && puzzle.solution.length > 1;
  const requiredCount = isMultiSelect ? puzzle.solution.length : 1;
  
  const [selected, setSelected] = useState<string[]>([]);
  const [internalError, setInternalError] = useState('');
  
  // 優先使用外部錯誤，如果沒有則使用內部錯誤
  const error = externalError || internalError;

  const handleSelect = (optionId: string) => {
    if (isMultiSelect) {
      // 多選模式
      if (selected.includes(optionId)) {
        // 取消選擇
        setSelected(selected.filter(id => id !== optionId));
      } else {
        // 添加選擇（限制最大數量）
        if (selected.length < requiredCount) {
          setSelected([...selected, optionId]);
        } else {
          setInternalError(`你最多只能選擇 ${requiredCount} 個固定點。`);
          return;
        }
      }
    } else {
      // 單選模式
      setSelected([optionId]);
    }
    setInternalError('');
    if (onErrorClear) onErrorClear();
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setInternalError(isMultiSelect ? `請選擇 ${requiredCount} 個固定點。` : '請選擇一個固定點。');
      return;
    }
    
    if (isMultiSelect && selected.length !== requiredCount) {
      setInternalError(`你需要選擇恰好 ${requiredCount} 個固定點，形成三角支撐系統。`);
      return;
    }
    
    // 檢查答案是否正確
    let isCorrect = false;
    if (isMultiSelect) {
      // 多選模式：檢查選中的選項是否完全匹配答案（順序不重要）
      const solutionArray = puzzle.solution as string[];
      isCorrect = solutionArray.length === selected.length && 
                   solutionArray.every(id => selected.includes(id)) &&
                   selected.every(id => solutionArray.includes(id));
    } else {
      // 單選模式
      isCorrect = puzzle.solution === selected[0] || 
                  (Array.isArray(puzzle.solution) && puzzle.solution.includes(selected[0]));
    }
    
    if (!isCorrect) {
      // 選擇錯誤，顯示模糊的錯誤提示
      if (isMultiSelect) {
        setInternalError('這個組合無法形成穩定的支撐系統。');
      } else {
        setInternalError('這個固定點無法提供足夠的支撐。');
      }
      return;
    }
    
    // 清除錯誤
    setInternalError('');
    if (onErrorClear) onErrorClear();
    
    // 傳遞選中的選項ID（陣列或單個值）
    onSolve(isMultiSelect ? selected : selected[0]);
  };

  // 固定點選項（如果謎題沒有定義選項，使用默認選項）
  const options = puzzle.options || [
    { id: 'fixed_point_1', label: '固定點 1', description: '名牌上沒有標記' },
    { id: 'fixed_point_2', label: '固定點 2', description: '名牌上標記了「加固扣」' },
    { id: 'fixed_point_3', label: '固定點 3', description: '名牌上沒有標記' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl max-w-[min(600px,100vmin)] w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* 標題欄 - 固定 */}
        <div className="flex items-center justify-between p-6 md:p-8 pb-4 border-b border-dark-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Anchor size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200">
                {isMultiSelect ? '選擇固定點（三角支撐系統）' : '選擇固定點'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {isMultiSelect 
                  ? `選擇 ${requiredCount} 個固定點形成穩定的三角支撐系統`
                  : '選擇有加固扣的固定點進行垂降'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 內容區域 - 可滾動 */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4">
          {/* 提示 */}
          {puzzle.hint && (
            <div className="mb-6 p-4 bg-yellow-950/20 border border-yellow-700/50 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-yellow-400 mb-1 font-medium">提示</div>
                  <div className="text-sm text-yellow-300 leading-relaxed">{puzzle.hint}</div>
                </div>
              </div>
            </div>
          )}

          {/* 固定點選擇區域 */}
          <div className="mb-6">
            {isMultiSelect && (
              <div className="mb-4 p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
                <div className="text-sm text-blue-300 font-medium">
                  已選擇：{selected.length} / {requiredCount}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {options.map((option) => {
                const isSelected = isMultiSelect 
                  ? selected.includes(option.id)
                  : selected[0] === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg'
                        : 'bg-dark-surface/50 border-dark-border text-gray-300 hover:bg-dark-surface hover:border-purple-500/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            isSelected
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                          }`} />
                          <div className="font-medium text-sm">{option.label}</div>
                        </div>
                        {option.description && (
                          <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 錯誤提示 */}
          {error && (
            <div className="mb-6 p-3 bg-red-950/30 border-2 border-red-700/70 rounded-lg text-sm text-red-300 flex items-center gap-2 animate-pulse">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* 按鈕組 - 固定 */}
        <div className="flex gap-3 p-6 md:p-8 pt-4 border-t border-dark-border flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0 || (isMultiSelect && selected.length !== requiredCount)}
            className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg ${
              selected.length > 0 && (!isMultiSelect || selected.length === requiredCount)
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-xl'
                : 'bg-dark-surface border-2 border-dark-border text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check size={18} />
            {isMultiSelect ? `確認選擇 (${selected.length}/${requiredCount})` : '確認選擇'}
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

