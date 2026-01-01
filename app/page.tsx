'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg to-dark-surface">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
          粉紅瑜珈墊
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          你越強壯，越接近被收割。
        </p>
        <p className="text-gray-500 mb-12 leading-relaxed">
          701號房沒有病人，只有被編號的價值。<br />
          你以為你在逃院，其實你在逃離一條供應鏈。
        </p>
        <Link
          href="/play/ch1/ch1_sc1"
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-lg font-medium shadow-lg"
        >
          <Play size={24} />
          開始遊戲
        </Link>
        <div className="mt-8 text-sm text-gray-600">
          <p>使用滑鼠點擊場景中的物件進行互動</p>
          <p className="mt-2">?debug=1 可顯示互動區域</p>
        </div>
      </div>
    </div>
  );
}

