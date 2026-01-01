'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameEngine } from '@/lib/gameEngine';
import { Dialog } from '@/types/game';
import SceneView, { SceneViewRef } from '@/components/SceneView';
import DialogBox from '@/components/DialogBox';
import Inventory from '@/components/Inventory';
import PuzzleInput from '@/components/PuzzleInput';
import PulseClipReader from '@/components/PulseClipReader';
import UVLightPanel from '@/components/UVLightPanel';
import { ArrowLeft, HelpCircle, Package, X } from 'lucide-react';
import Link from 'next/link';
import { audioManager } from '@/lib/audioManager';

export default function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const sceneId = params.sceneId as string;
  const debug = searchParams.get('debug') === '1';

  const [engine] = useState(() => new GameEngine());
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showInventory, setShowInventory] = useState(false);
  const [showPulseClip, setShowPulseClip] = useState(false);
  const [showUVLight, setShowUVLight] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const sceneViewRef = useRef<SceneViewRef>(null);

  // 監聽場景變化並導航（作為備用機制）
  useEffect(() => {
    const state = engine.getState();
    if (state.currentChapter !== chapterId || state.currentScene !== sceneId) {
      // 延遲一點確保所有效果都已應用
      const timer = setTimeout(() => {
        router.push(`/play/${state.currentChapter}/${state.currentScene}`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [refreshKey, chapterId, sceneId, router]);

  const scene = engine.getCurrentScene();
  const state = engine.getState();

  // 進入場景時播放環境音
  useEffect(() => {
    if (scene?.id === 'ch1_sc1') {
      // 第一空間：播放醫院環境音（循環）
      audioManager.playAmbient('/audio/ambient/ambient_hospital.mp3', 0.25);
      
      return () => {
        // 離開場景時停止環境音
        audioManager.stopAmbient();
      };
    }
  }, [scene?.id]);

  // 初始化場景對話
  useEffect(() => {
    if (scene?.initialDialog) {
      // 延遲顯示初始對話，給場景切換一點時間
      const timer = setTimeout(() => {
        setCurrentDialog(scene.initialDialog);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scene?.id]);

  // 觸發劇烈閃爍（廣播時使用）
  const triggerIntenseFlicker = useCallback(() => {
    if (sceneViewRef.current) {
      // 劇烈閃爍 2-3 次
      sceneViewRef.current.triggerFlicker('intense');
      setTimeout(() => {
        sceneViewRef.current?.triggerFlicker('strong');
      }, 200);
      setTimeout(() => {
        sceneViewRef.current?.triggerFlicker('intense');
      }, 400);
    }
  }, []);

  const handleHotspotClick = useCallback((hotspotId: string) => {
    if (!scene) return;
    
    // 增加互動次數（用於閃爍頻率調整）
    setInteractionCount(prev => prev + 1);

    // 特殊處理：緊急呼叫盒打開 UV 燈面板
    if (hotspotId === 'emergency_box') {
      engine.addInteraction('emergency_box');
      // UV 燈使用時短暫閃爍
      if (sceneViewRef.current) {
        sceneViewRef.current.triggerFlicker('light');
      }
      setShowUVLight(true);
      setRefreshKey(prev => prev + 1);
      return;
    }

    // 特殊處理：脈搏夾收集
    if (hotspotId === 'pulse_clip_spot') {
      const state = engine.getState();
      if (!state.inventory.includes('pulse_clip')) {
        // 脈搏夾使用時短暫閃爍
        if (sceneViewRef.current) {
          sceneViewRef.current.triggerFlicker('light');
        }
        // 收集脈搏夾
        engine.applyEffect({ type: 'addItem', itemId: 'pulse_clip' });
        setCurrentDialog({
          text: '獲得：一次性指尖脈搏夾\n\n塑膠外殼有乾掉的白色粉末；夾口內側黏著一根短毛。',
          type: 'item',
        });
        // 觸發拿起事件（延遲顯示）
        setTimeout(() => {
          const result = engine.triggerEvent('pickup_pulse_clip');
          if (result?.dialog) {
            setCurrentDialog(result.dialog);
          }
        }, 2000);
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 已經收集，顯示提示
        setCurrentDialog({
          text: '你已經收集了脈搏夾。可以在背包中使用它來測量數據。',
          type: 'system',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 特殊處理：瑜珈墊收集
    if (hotspotId === 'yoga_mat_spot') {
      const state = engine.getState();
      if (!state.inventory.includes('yoga_mat')) {
        // 收集瑜珈墊
        engine.applyEffect({ type: 'addItem', itemId: 'yoga_mat' });
        setCurrentDialog({
          text: '獲得：粉紅瑜珈墊\n\n太乾淨了，乾淨得像被反覆擦拭。',
          type: 'item',
        });
        // 觸發檢查事件（延遲顯示）
        setTimeout(() => {
          const result = engine.triggerEvent('examine_yoga_mat');
          if (result?.dialog) {
            setCurrentDialog(result.dialog);
          }
        }, 2000);
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 已經收集，顯示提示
        setCurrentDialog({
          text: '你已經收集了瑜珈墊。',
          type: 'system',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 特殊處理：抽屜互動
    if (hotspotId === 'drawer') {
      engine.addInteraction('drawer');
      const state = engine.getState();
      // 檢查是否有髮夾
      if (state.inventory.includes('rusty_hairpin')) {
        // 有髮夾，播放打開音效
        audioManager.playSFX('/audio/sfx/sfx_drawer_open.mp3', 0.7);
        // 有髮夾，觸發打開事件
        const result = engine.triggerEvent('open_drawer');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 沒有髮夾，顯示提示
        const result = engine.triggerEvent('try_open_drawer');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 特殊處理：門的互動（觸發謎題）
    if (hotspotId === 'door') {
      // 點下大門時播放尖銳金屬聲
      audioManager.playSFX('/audio/sfx/sfx_metal.mp3', 0.6);
      const doorPuzzle = scene.puzzles.find(p => p.id === 'door_code');
      if (doorPuzzle) {
        setCurrentPuzzle(doorPuzzle);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    const result = engine.interactWithHotspot(hotspotId);
    
    if (result) {
      // 檢查是否有觸發的事件對話
      const dialogEvent = result.events.find((e: any) => e.dialog);
      if (dialogEvent?.dialog) {
        setCurrentDialog(dialogEvent.dialog);
      } else if (result.item) {
        // 如果獲得道具，顯示提示
        setCurrentDialog({
          text: `獲得：${result.item.name}\n\n${result.item.description}`,
          type: 'item',
        });
      } else {
        // 顯示 hotspot 的提示
        const hotspot = scene.hotspots.find(h => h.id === hotspotId);
        if (hotspot?.hint) {
          setCurrentDialog({
            text: hotspot.hint,
            type: 'narrator',
          });
        }
      }
      
      setRefreshKey(prev => prev + 1);
    } else {
      // 沒有觸發事件，顯示 hotspot 描述
      const hotspot = scene.hotspots.find(h => h.id === hotspotId);
      if (hotspot?.description || hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint || hotspot.description || '',
          type: 'narrator',
        });
      }
    }
  }, [scene, engine]);

  const handleItemClick = useCallback((itemId: string) => {
    const result = engine.useItem(itemId);
    if (result.success) {
      if (result.openPanel === 'pulse_clip') {
        // 打開脈搏夾面板
        setShowPulseClip(true);
      } else if (result.dialog) {
        setCurrentDialog(result.dialog);
      } else {
        const item = scene?.items.find(i => i.id === itemId);
        if (item) {
          setCurrentDialog({
            text: item.description,
            type: 'item',
          });
        }
      }
    } else {
      const item = scene?.items.find(i => i.id === itemId);
      if (item) {
        setCurrentDialog({
          text: item.description,
          type: 'item',
        });
      }
    }
    setRefreshKey(prev => prev + 1);
  }, [scene, engine]);

  const handlePuzzleSolve = useCallback((input: string | string[]) => {
    if (!currentPuzzle) return;
    
    const solved = engine.solvePuzzle(currentPuzzle.id, input);
    if (solved) {
      setCurrentPuzzle(null);
      
      // 獲取解決後的狀態（engine.solvePuzzle 已經應用了效果）
      const newState = engine.getState();
      
      // 檢查是否有對話效果
      const puzzle = scene?.puzzles.find(p => p.id === currentPuzzle.id);
      if (puzzle?.onSolve) {
        const dialogEffect = puzzle.onSolve.find(e => e.type === 'showDialog');
        const sceneChange = puzzle.onSolve.find(e => e.type === 'changeScene');
        
        // 檢查場景是否已改變（使用更新後的 state）
        const sceneChanged = newState.currentChapter !== chapterId || newState.currentScene !== sceneId;
        
        // 如果有對話，先顯示對話
        if (dialogEffect?.dialog) {
          setCurrentDialog(dialogEffect.dialog);
        }
        
        // 如果有場景切換，更新 refreshKey 讓 useEffect 處理場景切換
        // 如果有對話，延遲更新 refreshKey，讓對話先顯示
        if (sceneChanged) {
          if (dialogEffect?.dialog) {
            // 有對話時，延遲切換場景（讓用戶看完對話）
            setTimeout(() => {
              setRefreshKey(prev => prev + 1);
            }, 3000);
          } else {
            // 沒有對話，立即觸發場景切換
            setRefreshKey(prev => prev + 1);
          }
        } else {
          // 沒有場景切換，只更新 refreshKey
          setRefreshKey(prev => prev + 1);
        }
      } else {
        // 如果 puzzle.onSolve 不存在，檢查 state 是否顯示場景已改變
        const sceneChanged = newState.currentChapter !== chapterId || newState.currentScene !== sceneId;
        if (sceneChanged) {
          setRefreshKey(prev => prev + 1);
        } else {
          setRefreshKey(prev => prev + 1);
        }
      }
    } else {
      // 錯誤提示
      setCurrentDialog({
        text: '答案不正確，再試試看。',
        type: 'system',
      });
    }
  }, [currentPuzzle, scene, engine, chapterId, sceneId]);

  const handlePuzzleTrigger = useCallback((puzzleId: string) => {
    const puzzle = scene?.puzzles.find(p => p.id === puzzleId);
    if (puzzle) {
      setCurrentPuzzle(puzzle);
    }
  }, [scene]);

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">場景不存在</div>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark-bg overflow-hidden">
      {/* 場景視圖 - 全屏沉浸式 */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        showInventory ? 'md:translate-x-[-320px]' : ''
      }`}>
        <div className="h-full w-full flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-4xl aspect-square bg-dark-surface/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-dark-border/50 shadow-2xl">
            <SceneView
              ref={sceneViewRef}
              scene={scene}
              onHotspotClick={handleHotspotClick}
              debug={debug}
              interactionCount={interactionCount}
            />
          </div>
        </div>
      </div>

      {/* 浮動控制按鈕組 - 右上角 */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        {/* 返回按鈕 */}
        <Link
          href="/"
          className="group flex items-center gap-2 px-4 py-2.5 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg"
        >
          <ArrowLeft size={18} className="group-hover:translate-x-[-2px] transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">返回</span>
        </Link>

        {/* 菜單按鈕組 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="group flex items-center justify-center w-12 h-12 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg relative"
            title="背包"
          >
            <Package size={22} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            {state.inventory.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-dark-bg shadow-lg animate-pulse">
                {state.inventory.length}
              </span>
            )}
          </button>
          
          {/* 謎題按鈕已隱藏 */}
          {false && scene.puzzles.length > 0 && (
            <button
              onClick={() => {
                if (scene.puzzles.length === 1) {
                  handlePuzzleTrigger(scene.puzzles[0].id);
                } else {
                  // 多個謎題時顯示選擇
                  const firstPuzzle = scene.puzzles[0];
                  handlePuzzleTrigger(firstPuzzle.id);
                }
              }}
              className="flex items-center justify-center w-12 h-12 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg"
              title="謎題"
            >
              <HelpCircle size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 場景名稱 - 左上角浮動 */}
      <div className="absolute top-4 left-4 z-30">
        <div className="px-4 py-2 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg shadow-lg">
          <div className="text-sm font-medium text-gray-300">{scene.name}</div>
        </div>
      </div>

      {/* 側邊道具欄 - 從右側滑入 */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-dark-surface/95 backdrop-blur-xl border-l border-dark-border z-40 transform transition-transform duration-300 ease-out ${
        showInventory ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* 道具欄標題 */}
          <div className="flex items-center justify-between p-4 border-b border-dark-border">
            <h2 className="text-lg font-semibold text-gray-200">背包</h2>
            <button
              onClick={() => setShowInventory(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-card rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* 道具列表 */}
          <div className="flex-1 overflow-y-auto p-4">
            <Inventory
              itemIds={state.inventory}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>

      {/* 對話框 - 底部浮動 */}
      {currentDialog && (
        <DialogBox
          dialog={currentDialog}
          onClose={() => setCurrentDialog(null)}
          autoClose={currentDialog.type === 'narrator'}
        />
      )}

      {/* 謎題輸入 */}
      {currentPuzzle && (
        <PuzzleInput
          puzzle={currentPuzzle}
          onSolve={handlePuzzleSolve}
          onClose={() => setCurrentPuzzle(null)}
        />
      )}

      {/* 脈搏夾量測面板 */}
      {showPulseClip && (
        <PulseClipReader
          onClose={() => setShowPulseClip(false)}
          onBroadcast={() => {
            // 廣播觸發：播放電流聲 → 劇烈閃爍 → 顯示文字
            audioManager.playSFX('/audio/broadcast/broadcast_static.mp3', 0.7);
            triggerIntenseFlicker();
            
            engine.triggerPulseClipBroadcast();
            const state = engine.getState();
            const scene = engine.getCurrentScene();
            if (scene) {
              const event = scene.events.find(e => e.id === 'use_pulse_clip');
              if (event) {
                const result = engine.triggerEvent('use_pulse_clip');
                // 延遲顯示對話，讓閃爍效果先出現
                setTimeout(() => {
                  if (result?.dialog) {
                    setCurrentDialog(result.dialog);
                  }
                }, 600);
              }
            }
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}

      {/* UV 燈面板 */}
      {showUVLight && (
        <UVLightPanel
          onClose={() => setShowUVLight(false)}
          onReveal={() => {
            engine.setUVLightState(true);
            const state = engine.getState();
            const scene = engine.getCurrentScene();
            if (scene) {
              const event = scene.events.find(e => e.id === 'use_uv_light');
              if (event) {
                const result = engine.triggerEvent('use_uv_light');
                if (result?.dialog) {
                  setCurrentDialog(result.dialog);
                }
              }
            }
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}

