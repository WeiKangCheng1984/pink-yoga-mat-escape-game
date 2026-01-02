'use client';

import { Dialog } from '@/types/game';
import { X, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DialogBoxProps {
  dialog: Dialog;
  onClose: () => void;
  autoClose?: boolean;
  typewriterSpeed?: number;
}

export default function DialogBox({ 
  dialog, 
  onClose,
  autoClose = false,
  typewriterSpeed = 30
}: DialogBoxProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // 打字機效果
    let currentIndex = 0;
    setDisplayText('');
    setIsComplete(false);
    setShowContinue(false);

    const typeInterval = setInterval(() => {
      if (currentIndex < dialog.text.length) {
        setDisplayText(dialog.text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        setShowContinue(true);
        clearInterval(typeInterval);
      }
    }, typewriterSpeed);

    return () => clearInterval(typeInterval);
  }, [dialog.text, typewriterSpeed]);

  // 自動播放音訊（如果有）
  useEffect(() => {
    if (dialog.audio) {
      const audio = new Audio(dialog.audio);
      audio.play().catch(() => {});
      return () => audio.pause();
    }
  }, [dialog.audio]);

  // 移除自動關閉功能 - 所有訊息都需要手動關閉

  const getTypeStyles = () => {
    switch (dialog.type) {
      case 'broadcast':
        return {
          container: 'bg-gradient-to-br from-red-950/90 via-red-900/80 to-red-950/90 border-red-700/60 text-red-100',
          icon: 'text-red-400',
          pulse: 'animate-pulse'
        };
      case 'item':
        return {
          container: 'bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-blue-950/90 border-blue-700/60 text-blue-100',
          icon: 'text-blue-400',
          pulse: ''
        };
      case 'system':
        return {
          container: 'bg-gradient-to-br from-yellow-950/90 via-yellow-900/80 to-yellow-950/90 border-yellow-700/60 text-yellow-100',
          icon: 'text-yellow-400',
          pulse: ''
        };
      default:
        return {
          container: 'bg-gradient-to-br from-gray-950/95 via-gray-900/90 to-gray-950/95 border-gray-700/50 text-gray-100',
          icon: 'text-gray-400',
          pulse: ''
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none md:items-center md:p-8"
    >
      <div
        className={`max-w-3xl w-full p-6 md:p-8 rounded-2xl border-2 backdrop-blur-xl ${styles.container} pointer-events-auto shadow-2xl transform transition-all duration-300 ${
          isComplete ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* 標題欄 */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
          <div className={`text-xs uppercase tracking-widest font-semibold ${styles.icon} flex items-center gap-2`}>
            {dialog.type === 'broadcast' && (
              <span className={`w-2 h-2 bg-red-400 rounded-full ${styles.pulse}`}></span>
            )}
            {dialog.type === 'broadcast' && '廣播'}
            {dialog.type === 'item' && '道具'}
            {dialog.type === 'system' && '系統'}
            {!dialog.type && '旁白'}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* 對話內容 */}
        <div className="text-lg md:text-xl leading-relaxed mb-4 min-h-[3rem] whitespace-pre-line">
          {displayText}
          {!isComplete && (
            <span className="inline-block w-0.5 h-5 bg-current ml-1 animate-pulse"></span>
          )}
        </div>

        {/* 繼續提示 - 可點擊關閉 */}
        {showContinue && (
          <button
            onClick={onClose}
            className="flex items-center justify-end gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer ml-auto"
          >
            <span>點擊繼續</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

