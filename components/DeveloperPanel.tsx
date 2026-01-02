'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Code, MapPin } from 'lucide-react';
import { scenes, chapters } from '@/data/gameData';

interface DeveloperPanelProps {
  onClose: () => void;
  currentChapterId: string;
  currentSceneId: string;
}

export default function DeveloperPanel({ onClose, currentChapterId, currentSceneId }: DeveloperPanelProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  // 獲取所有場景
  const allScenes = Object.values(scenes);

  const handleSceneJump = (chapterId: string, sceneId: string) => {
    router.push(`/play/${chapterId}/${sceneId}`);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-purple-500/50 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Code size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200">開發者模式</h3>
              <p className="text-xs text-gray-400 mt-1">快速跳轉到任何場景</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 場景列表 */}
        <div className="space-y-4">
          {Object.values(chapters).map((chapter) => {
            const chapterScenes = allScenes.filter(s => s.chapterId === chapter.id);
            
            return (
              <div key={chapter.id} className="border border-dark-border rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  {chapter.name}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {chapterScenes.map((scene) => {
                    const isCurrentScene = currentChapterId === scene.chapterId && currentSceneId === scene.id;
                    
                    return (
                      <button
                        key={scene.id}
                        onClick={() => handleSceneJump(scene.chapterId, scene.id)}
                        className={`text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          isCurrentScene
                            ? 'bg-purple-600/20 border-2 border-purple-500 text-purple-300'
                            : 'bg-dark-surface/50 border border-dark-border text-gray-300 hover:bg-dark-surface hover:border-purple-500/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{scene.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{scene.id}</div>
                          </div>
                          {isCurrentScene && (
                            <div className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                              當前
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 提示和設置 */}
        <div className="mt-6 space-y-3">
          <div className="p-3 bg-yellow-950/20 border border-yellow-700/50 rounded-lg">
            <p className="text-xs text-yellow-300">
              💡 提示：按 <kbd className="px-2 py-1 bg-dark-surface rounded text-xs">Ctrl+D</kbd> 或 <kbd className="px-2 py-1 bg-dark-surface rounded text-xs">Cmd+D</kbd> 快速開啟/關閉開發者模式
            </p>
          </div>
          <div className="p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
            <p className="text-xs text-blue-300 mb-2">
              ⚙️ 設置：隱藏開發者模式按鈕（可在 URL 中添加 ?dev=1 重新啟用）
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('hideDevMode', 'true');
                  alert('開發者模式按鈕已隱藏。要重新顯示，請在 URL 中添加 ?dev=1 參數。');
                  onClose();
                }
              }}
              className="w-full px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-300 text-xs transition-colors"
            >
              隱藏開發者模式按鈕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

