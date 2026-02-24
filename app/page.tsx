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
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
          粉紅瑜珈墊
        </h1>
        <button
          onClick={handleStartGame}
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-lg font-medium shadow-lg"
        >
          <Play size={24} />
          開始遊戲
        </button>
        <div className="mt-8 text-sm text-gray-600">
          <p>使用滑鼠點擊場景中的物件進行互動</p>
        </div>
        </div>
      </div>
    </div>
  );
}

