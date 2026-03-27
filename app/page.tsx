'use client';

import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import HomeBackground from '@/components/HomeBackground';

export default function Home() {
  const router = useRouter();

  const handleStartGame = () => {
    // 清除所有遊戲記憶
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('gameState');
        console.log('遊戲記憶已清除');
      } catch (e) {
        console.warn('無法清除遊戲記憶:', e);
      }
    }
    
    // 導航到遊戲頁面
    router.push('/play/ch1/ch1_sc1');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg to-dark-surface" aria-hidden />
      <HomeBackground />
      {/* 極輕 vignette，避免畫面過平 */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_0_100px_rgba(0,0,0,0.55)]"
        aria-hidden
      />
      <div className="relative z-[2] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1
            className="animate-home-hero-in text-5xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"
            style={{ animationDelay: '0ms' }}
          >
            粉紅瑜珈墊
          </h1>
          <p
            className="animate-home-hero-in text-sm tracking-widest text-gray-500 mb-8"
            style={{ animationDelay: '120ms' }}
          >
            第一章 · 甦醒
          </p>
          <button
            type="button"
            onClick={handleStartGame}
            className="animate-home-hero-in inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 hover:shadow-lg active:scale-[0.98] text-white rounded-lg transition-all duration-200 text-lg font-medium shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            style={{ animationDelay: '240ms' }}
          >
            <Play size={24} aria-hidden />
            開始遊戲
          </button>
          <div
            className="animate-home-hero-in mt-10 text-sm text-gray-600"
            style={{ animationDelay: '380ms' }}
          >
            <p>白牆會記住你的手指。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

