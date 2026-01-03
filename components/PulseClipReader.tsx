'use client';

import { X, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PulseClipReaderProps {
  onClose: () => void;
  onBroadcast?: () => void;
}

export default function PulseClipReader({ onClose, onBroadcast }: PulseClipReaderProps) {
  const [pulseValue, setPulseValue] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [hasTriggeredBroadcast, setHasTriggeredBroadcast] = useState(false);

  // 生成隨機脈搏數據（模擬測試碼，不是真正心率）
  const generatePulseData = () => {
    // 生成一個看起來像測試碼的數字（例如：72-85 之間，但會顯示為奇怪的格式）
    const baseValue = Math.floor(Math.random() * 14) + 72; // 72-85
    // 有時候顯示異常值（暗示這不是真正的心率）
    const anomaly = Math.random() > 0.7;
    if (anomaly) {
      return Math.floor(Math.random() * 200) + 100; // 異常高值
    }
    return baseValue;
  };

  const startMeasurement = () => {
    setIsMeasuring(true);
    setPulseValue(null);
    
    // 模擬測量過程
    setTimeout(() => {
      const value = generatePulseData();
      setPulseValue(value);
      setIsMeasuring(false);
      
      // 第一次測量時觸發廣播
      if (!hasTriggeredBroadcast && onBroadcast) {
        setTimeout(() => {
          onBroadcast();
          setHasTriggeredBroadcast(true);
        }, 1500);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <Activity size={24} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">脈搏夾</h3>
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
          <div className="text-xs text-gray-400 mb-2">塑膠外殼有乾掉的白色粉末；夾口內側黏著一根短毛。</div>
          <div className="text-sm text-gray-300 leading-relaxed">
            它不是在量你活著，是在量你值不值。
          </div>
        </div>

        {/* 顯示區域 */}
        <div className="mb-6">
          <div className="bg-dark-bg border-2 border-dark-border rounded-lg p-8 text-center">
            {isMeasuring ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-500">測量中...</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            ) : pulseValue !== null ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 mb-4">讀數</div>
                <div className="text-6xl font-bold text-red-400 font-mono">
                  {pulseValue}
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  {pulseValue > 100 ? '異常' : '正常'}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  （這不是真正的心率，像測試碼）
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                點擊下方按鈕開始測量
              </div>
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-3">
          <button
            onClick={startMeasurement}
            disabled={isMeasuring}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isMeasuring ? '測量中...' : pulseValue === null ? '開始測量' : '重新測量'}
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





