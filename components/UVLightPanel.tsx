'use client';

import { X, Lightbulb, LightbulbOff } from 'lucide-react';
import { useState } from 'react';

interface UVLightPanelProps {
  onClose: () => void;
  onReveal?: () => void;
}

export default function UVLightPanel({ onClose, onReveal }: UVLightPanelProps) {
  const [isOn, setIsOn] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  const toggleUV = () => {
    const newState = !isOn;
    setIsOn(newState);
    
    if (newState && !hasRevealed) {
      // 開啟時顯示數據
      setTimeout(() => {
        if (onReveal) {
          onReveal();
        }
        setHasRevealed(true);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isOn ? 'bg-yellow-600/20' : 'bg-gray-600/20'
            }`}>
              {isOn ? (
                <Lightbulb size={24} className="text-yellow-400" />
              ) : (
                <LightbulbOff size={24} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-200">緊急呼叫盒</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 說明 */}
        <div className="mb-6 p-4 bg-dark-surface/50 border border-dark-border rounded-lg">
          <div className="text-sm text-gray-300 leading-relaxed">
            沒有電話，只有 UV 燈。UV 光像一把很小的審判。
          </div>
        </div>

        {/* UV 燈顯示區域 */}
        <div className="mb-6">
          <div className={`bg-dark-bg border-2 rounded-lg p-8 text-center transition-all duration-500 ${
            isOn 
              ? 'border-yellow-500/50 bg-yellow-950/20' 
              : 'border-dark-border'
          }`}>
            {isOn ? (
              <div className="space-y-4">
                <div className="text-xs text-yellow-400 mb-4">UV 光照射中...</div>
                <div className="text-2xl font-bold text-yellow-300 font-mono mb-2">
                  Squat: 120kg
                </div>
                <div className="text-2xl font-bold text-yellow-300 font-mono">
                  Bench: 80kg
                </div>
                <div className="text-xs text-gray-400 mt-6 leading-relaxed">
                  你突然明白：有人不是在治療你，是在訓練你。
                </div>
                <div className="text-sm text-red-300 mt-2 font-medium">
                  醫院把你當健身房，健身房把你當屠宰場。
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                點擊下方按鈕開啟 UV 燈
              </div>
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-3">
          <button
            onClick={toggleUV}
            className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
              isOn
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white'
            }`}
          >
            {isOn ? (
              <span className="flex items-center justify-center gap-2">
                <LightbulbOff size={18} />
                關閉 UV 燈
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lightbulb size={18} />
                開啟 UV 燈
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}



