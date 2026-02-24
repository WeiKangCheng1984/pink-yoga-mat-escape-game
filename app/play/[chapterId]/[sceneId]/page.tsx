'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameEngine } from '@/lib/gameEngine';
import { Dialog } from '@/types/game';
import SceneView, { SceneViewRef } from '@/components/SceneView';
import DialogBox from '@/components/DialogBox';
import Inventory from '@/components/Inventory';
import PuzzleInput from '@/components/PuzzleInput';
import ArrangementPuzzle from '@/components/ArrangementPuzzle';
import VisualSelectionPuzzle from '@/components/VisualSelectionPuzzle';
import CombinationLock from '@/components/CombinationLock';
import PulseClipReader from '@/components/PulseClipReader';
import UVLightPanel from '@/components/UVLightPanel';
import { ArrowLeft, Package, X, MapPin, ChevronDown, Code } from 'lucide-react';
import Link from 'next/link';
import { audioManager } from '@/lib/audioManager';
import { scenes, chapters, items } from '@/data/gameData';
import DeveloperPanel from '@/components/DeveloperPanel';

export default function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const sceneId = params.sceneId as string;
  const debug = searchParams.get('debug') === '1';
  const devMode = searchParams.get('dev') === '1';

  // 使用 useRef 保持 GameEngine 實例，避免重新掛載時重置狀態
  const engineRef = useRef<GameEngine | null>(null);
  if (!engineRef.current) {
    // 嘗試從 localStorage 恢復狀態
    let savedState = null;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gameState');
        if (saved) {
          savedState = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('無法從 localStorage 恢復遊戲狀態:', e);
      }
    }
    engineRef.current = new GameEngine(savedState || undefined);
  }
  const engine = engineRef.current;

  // 定義所有 state，確保在 useEffect 之前
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [dialogQueue, setDialogQueue] = useState<Dialog[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [puzzleError, setPuzzleError] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showInventory, setShowInventory] = useState(false);
  const [showPulseClip, setShowPulseClip] = useState(false);
  const [showUVLight, setShowUVLight] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [showSceneSelector, setShowSceneSelector] = useState(false);
  const [showDoor702Confirm, setShowDoor702Confirm] = useState(false);
  const [showDoor701Confirm, setShowDoor701Confirm] = useState(false);
  const [showWindow702Confirm, setShowWindow702Confirm] = useState(false);
  const [showDescendConfirm, setShowDescendConfirm] = useState(false);
  const gameEndShownRef = useRef(false);
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);
  const sceneViewRef = useRef<SceneViewRef>(null);
  const isDescendPuzzleCompleteRef = useRef(false);

  // 添加對話到隊列（需要在 handleItemCollection 之前定義）
  const addDialogsToQueue = useCallback((dialogs: Dialog[]) => {
    if (dialogs.length === 0) return;
    
    // 使用函數式更新來避免閉包問題
    setCurrentDialog(current => {
      if (!current) {
        // 如果當前沒有對話，直接顯示第一個，其餘加入隊列
        const firstDialog = dialogs[0];
        // 檢查是否為廣播類型，需要特殊處理
        if (firstDialog.type === 'broadcast') {
          // 播放廣播音效
          audioManager.playSFX('/audio/broadcast/broadcast_static.mp3', 0.7);
          // 觸發劇烈閃爍
          if (sceneViewRef.current) {
            sceneViewRef.current.triggerFlicker('intense');
            setTimeout(() => {
              sceneViewRef.current?.triggerFlicker('strong');
            }, 200);
            setTimeout(() => {
              sceneViewRef.current?.triggerFlicker('intense');
            }, 400);
          }
          // 廣播對話需要特殊處理，先返回 null，然後在 setTimeout 中設置
          setTimeout(() => {
            setCurrentDialog(firstDialog);
            if (dialogs.length > 1) {
              setDialogQueue(dialogs.slice(1));
            }
          }, 0);
          return null;
        } else {
          // 使用 setTimeout 確保狀態更新順序正確
          setTimeout(() => {
            if (dialogs.length > 1) {
              setDialogQueue(dialogs.slice(1));
            }
          }, 0);
          return firstDialog;
        }
      } else {
        // 如果當前有對話，將所有新對話加入隊列
        setDialogQueue(prev => [...prev, ...dialogs]);
        return current;
      }
    });
  }, []);

  // 統一道具獲取處理函數
  const handleItemCollection = useCallback((hotspotId: string): boolean => {
    if (!engineRef.current) return false;
    const engine = engineRef.current;
    const scene = engine.getCurrentScene();
    if (!scene) return false;
    const state = engine.getState();
    
    // 步驟1：檢查是否有對應的事件映射
    const eventId = scene.hotspotEventMap?.[hotspotId];
    if (!eventId) return false; // 沒有對應事件，返回 false 繼續通用處理
    
    // 步驟2：檢查事件是否存在
    const event = scene.events.find(e => e.id === eventId);
    if (!event) {
      console.warn(`事件 ${eventId} 不存在於場景 ${scene.id}`);
      return false;
    }
    
    // 步驟3：檢查事件是否會添加道具（通過檢查 effects 中是否有 addItem）
    const addItemEffects = event.effects.filter((e: any) => e.type === 'addItem');
    if (addItemEffects.length === 0) {
      // 這個事件不會添加道具，可能不是道具獲取事件，返回 false
      return false;
    }
    
    // 步驟4：檢查是否已收集所有相關道具（快速檢查，避免不必要的處理）
    const collectedItems = addItemEffects
      .map((e: any) => e.itemId)
      .filter((itemId: string) => state.inventory.includes(itemId));
    
    if (collectedItems.length > 0) {
      // 已經收集了部分或全部道具，顯示友好提示
      const itemNames = collectedItems.map((itemId: string) => {
        const item = items[itemId];
        return item?.name || itemId;
      }).join('、');
      setCurrentDialog({
        text: `你已經收集了${itemNames}。`,
        type: 'system',
      });
      setRefreshKey(prev => prev + 1);
      return true; // 已處理，不需要繼續
    }
    
    // 步驟5：先記錄互動（確保 hasInteracted 檢查能通過）
    engine.addInteraction(hotspotId);
    
    // 步驟6：檢查事件前置條件（現在 hasInteracted 檢查應該能通過）
    const requirementsMet = engine.checkEventRequirements(event);
    if (!requirementsMet) {
      // 前置條件不滿足，顯示提示
      const hotspot = scene.hotspots.find(h => h.id === hotspotId);
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
      } else {
        setCurrentDialog({
          text: '這裡似乎需要滿足某些條件才能互動。',
          type: 'narrator',
        });
      }
      setRefreshKey(prev => prev + 1);
      return true; // 已處理，不需要繼續
    }
    
    // 步驟7：處理特殊效果（閃爍、音效等）
    if (hotspotId === 'pulse_clip_spot') {
      // 脈搏夾使用時短暫閃爍
      if (sceneViewRef.current) {
        sceneViewRef.current.triggerFlicker('light');
      }
    } else if (hotspotId === 'recorder_spot') {
      // 錄音筆播放音效
      audioManager.playSFX('/audio/sfx/sfx_recorder_click.mp3', 0.6);
    } else if (hotspotId === 'mirror_shard_spot') {
      // 鏡片碎角玻璃破碎音效
      audioManager.playSFX('/audio/sfx/sfx_glass_break.mp3', 0.6);
    } else if (hotspotId === 'duty_schedule') {
      // 值班表紙張翻動音效
      audioManager.playSFX('/audio/sfx/sfx_paper_rustle.mp3', 0.5);
    } else if (hotspotId === 'plant') {
      // 除鏽劑音效
      audioManager.playSFX('/audio/sfx/sfx_rust_remover.mp3', 0.6);
    }
    
    // 步驟8：觸發事件
    const result = engine.triggerEvent(eventId);
    if (result) {
      // 步驟9：統一處理對話顯示
      // 注意：事件中已經定義了所有對話（包括道具描述），直接使用即可
      const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
      
      // 構建對話隊列：直接使用事件中定義的對話（保持原有順序）
      const dialogs: Dialog[] = [];
      
      // 添加所有事件對話（包括道具描述、旁白、系統、廣播等）
      dialogEffects.forEach((effect: any) => {
        if (effect.dialog) {
          dialogs.push(effect.dialog);
        }
      });
      
      // 使用對話隊列顯示
      if (dialogs.length > 0) {
        addDialogsToQueue(dialogs);
      }
      
      // 觸發重新渲染，確保背包更新
      setRefreshKey(prev => prev + 1);
      return true; // 已處理，不需要繼續
    } else {
      // 事件觸發失敗，可能是條件不滿足或已觸發過
      console.warn(`事件 ${eventId} 觸發失敗`);
    }
    
    // 事件觸發失敗，顯示 hotspot 提示
    const hotspot = scene.hotspots.find(h => h.id === hotspotId);
    if (hotspot?.hint) {
      setCurrentDialog({
        text: hotspot.hint,
        type: 'narrator',
      });
      setRefreshKey(prev => prev + 1);
    }
    return true; // 已處理，不需要繼續
  }, [engineRef, setCurrentDialog, setRefreshKey, addDialogsToQueue, items]);

  // 處理對話關閉：如果有隊列，顯示下一個對話
  const handleDialogClose = useCallback(() => {
    setCurrentDialog(null);
    // 檢查是否有待顯示的對話
    setDialogQueue(prev => {
      if (prev.length > 0) {
        const nextDialog = prev[0];
        // 使用 setTimeout 確保當前對話完全關閉後再顯示下一個
        setTimeout(() => {
          // 檢查是否為廣播類型，需要特殊處理
          if (nextDialog.type === 'broadcast') {
            // 播放廣播音效
            audioManager.playSFX('/audio/broadcast/broadcast_static.mp3', 0.7);
            // 觸發劇烈閃爍
            if (sceneViewRef.current) {
              sceneViewRef.current.triggerFlicker('intense');
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('strong');
              }, 200);
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('intense');
              }, 400);
            }
            // 顯示廣播對話
            setCurrentDialog(nextDialog);
          } else {
            setCurrentDialog(nextDialog);
          }
        }, 100);
        return prev.slice(1);
      } else {
        // 對話隊列為空，檢查是否需要顯示確認對話框或遊戲結束畫面
        // 檢查遊戲是否完成（且尚未顯示過結束畫面）
        if (engineRef.current && !gameEndShownRef.current) {
          const state = engineRef.current.getState();
          if (state.flags.game_completed) {
            // 標記已顯示，防止重複觸發
            gameEndShownRef.current = true;
            // 使用一個短暫延遲確保對話完全關閉
            setTimeout(() => {
              setShowGameEnd(true);
            }, 300);
            return prev;
          }
        }
        // 檢查是否正在處理垂降謎題的對話隊列
        if (isDescendPuzzleCompleteRef.current) {
          isDescendPuzzleCompleteRef.current = false;
          // 使用一個短暫延遲確保對話完全關閉
          setTimeout(() => {
            setShowDescendConfirm(true);
          }, 300);
        }
        return prev;
      }
    });
  }, []);

  // 開發者模式快捷鍵已移除（隱藏功能）

  // 開發者模式按鈕默認隱藏，只能通過 URL 參數 ?dev=1 啟用
  const [hideDevMode] = useState(true); // 默認隱藏

  // 如果 URL 中有 dev=1 參數，自動顯示開發者面板
  useEffect(() => {
    if (devMode) {
      setShowDeveloperPanel(true);
    }
  }, [devMode]);

  // 根據 URL 初始化狀態（如果狀態與 URL 不一致）
  useEffect(() => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const state = engine.getState();
    
    // 場景切換時清空對話隊列
    setCurrentDialog(null);
    setDialogQueue([]);
    
    // 確保當前場景被添加到 visitedScenes
    if (!state.visitedScenes.includes(sceneId)) {
      engine.applyEffect({
        type: 'changeScene',
        chapterId: chapterId,
        sceneId: sceneId,
      });
    } else if (state.currentChapter !== chapterId || state.currentScene !== sceneId) {
      // 如果場景已在 visitedScenes 中，但狀態不一致，只更新當前場景
      engine.applyEffect({
        type: 'changeScene',
        chapterId: chapterId,
        sceneId: sceneId,
      });
    }
    
    // 保存狀態到 localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gameState', JSON.stringify(engine.getState()));
      } catch (e) {
        console.warn('無法保存遊戲狀態到 localStorage:', e);
      }
    }
  }, [chapterId, sceneId]);

  // 保存狀態到 localStorage（當狀態改變時）
  useEffect(() => {
    if (typeof window !== 'undefined' && engineRef.current) {
      try {
        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
      } catch (e) {
        console.warn('無法保存遊戲狀態到 localStorage:', e);
      }
    }
  }, [refreshKey]); // engine 來自 useRef，不需要在依賴中


  // 監聽場景變化並導航（只在 engine 主動改變場景時導航）
  // 這個 useEffect 作為備用機制，主要場景切換在 handlePuzzleSolve 中處理
  useEffect(() => {
    if (!engineRef.current) return;
    
    // 延遲執行，確保第一個 useEffect（URL 同步）先完成
    const timer = setTimeout(() => {
      if (!engineRef.current) return;
      const state = engineRef.current.getState();
      const targetChapter = state.currentChapter;
      const targetScene = state.currentScene;
      
      // 只有在 engine 的狀態與 URL 不一致時才導航
      // 這表示 engine 的狀態被主動改變了（例如解決謎題），而不是 URL 改變
      if (targetChapter !== chapterId || targetScene !== sceneId) {
        const currentState = engineRef.current.getState();
        // 再次檢查，確保狀態確實改變了，且與當前 URL 不一致
        if (currentState.currentChapter !== chapterId || currentState.currentScene !== sceneId) {
          router.push(`/play/${currentState.currentChapter}/${currentState.currentScene}`);
        }
      }
    }, 500); // 延遲更長，確保 URL 同步完成
    
    return () => clearTimeout(timer);
  }, [refreshKey, router, chapterId, sceneId]); // engine 來自 useRef，不需要在依賴中

  const scene = engineRef.current?.getCurrentScene() || null;
  let state = engineRef.current?.getState() || {
    currentChapter: chapterId,
    currentScene: sceneId,
    inventory: [],
    flags: {},
    interactions: [],
    visitedScenes: [],
  };
  
  // 確保當前場景在 visitedScenes 中（額外檢查，防止遺漏）
  if (scene && engineRef.current && !state.visitedScenes.includes(scene.id)) {
    engineRef.current.applyEffect({
      type: 'changeScene',
      chapterId: scene.chapterId,
      sceneId: scene.id,
    });
    // 重新獲取狀態
    state = engineRef.current.getState();
  }

  // 進入場景時播放環境音
  useEffect(() => {
    if (scene?.id === 'ch1_sc1') {
      // 第一空間：播放醫院環境音（循環）
      audioManager.playAmbient('/audio/ambient/ambient_hospital.mp3', 0.25);
      
      return () => {
        // 離開場景時停止環境音
        audioManager.stopAmbient();
      };
    } else if (scene?.id === 'ch1_sc2') {
      // 第二空間：播放醫院環境音（循環）
      audioManager.playAmbient('/audio/ambient/ambient_hospital.mp3', 0.25);
      
      return () => {
        // 離開場景時停止環境音
        audioManager.stopAmbient();
      };
    } else if (scene?.id === 'ch1_sc3') {
      // 第三空間：播放702病房環境音（循環）
      audioManager.playAmbient('/audio/ambient/ambient_room702.mp3', 0.2);
      
      return () => {
        // 離開場景時停止環境音
        audioManager.stopAmbient();
      };
    } else if (scene?.id === 'ch1_sc4') {
      // 第四空間：播放陽台環境音（循環）
      audioManager.playAmbient('/audio/ambient/ambient_balcony.mp3', 0.25);
      
      return () => {
        // 離開場景時停止環境音
        audioManager.stopAmbient();
      };
    } else if (scene?.id === 'ch1_sc5') {
      // 第五空間：播放露台環境音（循環）
      audioManager.playAmbient('/audio/ambient/ambient_terrace.mp3', 0.2);
      
      return () => {
        // 離開場景時停止環境音
        audioManager.stopAmbient();
      };
    }
  }, [scene?.id]);

  // 恐怖元素：隨機閃光和訊息
  useEffect(() => {
    if (!scene) return;
    
    // 根據場景設置不同的恐怖元素觸發間隔
    const horrorIntervals: Record<string, number> = {
      'ch1_sc1': 12000, // 第一空間：12秒
      'ch1_sc2': 15000, // 第二空間：15秒
      'ch1_sc3': 10000, // 第三空間：10秒（更頻繁）
      'ch1_sc4': 18000, // 第四空間：18秒
      'ch1_sc5': 20000, // 第五空間：20秒
    };
    
    const interval = horrorIntervals[scene.id];
    if (!interval) return;
    
    // 隨機觸發恐怖元素
    const horrorTimer = setInterval(() => {
      // 30% 機率觸發
      if (Math.random() < 0.3) {
        // 觸發閃光
        if (sceneViewRef.current) {
          sceneViewRef.current.triggerFlicker('light');
        }
        
        // 根據場景播放不同的恐怖音效
        const horrorSounds: Record<string, string> = {
          'ch1_sc1': '/audio/horror/horror_whisper.mp3',
          'ch1_sc2': '/audio/horror/horror_heartbeat.mp3',
          'ch1_sc3': '/audio/horror/horror_breathing.mp3',
          'ch1_sc4': '/audio/horror/horror_wind.mp3',
          'ch1_sc5': '/audio/horror/horror_ambient.mp3',
        };
        
        const soundPath = horrorSounds[scene.id];
        if (soundPath) {
          audioManager.playSFX(soundPath, 0.3);
        }
      }
    }, interval);
    
    return () => clearInterval(horrorTimer);
  }, [scene?.id]);

  // 初始化場景對話
  useEffect(() => {
    if (scene?.initialDialog) {
      // 延遲顯示初始對話，給場景切換一點時間
      const timer = setTimeout(() => {
        setCurrentDialog(scene.initialDialog ?? null);
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

  // 統一的廣播處理函數（音效+閃光+對話）
  const handleBroadcast = useCallback((dialog: Dialog) => {
    // 播放廣播音效
    audioManager.playSFX('/audio/broadcast/broadcast_static.mp3', 0.7);
    // 觸發劇烈閃爍
    triggerIntenseFlicker();
    // 顯示廣播對話
    setCurrentDialog(dialog);
  }, [triggerIntenseFlicker]);

  const handleHotspotClick = useCallback((hotspotId: string) => {
    if (!scene || !engineRef.current) return;
    const engine = engineRef.current;
    
    // 增加互動次數（用於閃爍頻率調整）
    setInteractionCount(prev => prev + 1);

    // 步驟1：嘗試統一道具獲取處理
    if (handleItemCollection(hotspotId)) {
      return; // 已處理，不需要繼續
    }

    // 純提示型 hotspot 處理（只顯示旁白對話，不觸發事件或獲得道具）
    const narrativeHotspots: Record<string, string> = {
      // 第一空間
      'iv_drip_wheel': '你不是第一次被搬運。',
      'pillow_label': '你被當成可清洗的東西。',
      // 第二空間
      'rubber_glove': '你以為是保護，其實是限制你觸碰真相。',
      'cleaning_cart_nameplate': '連擦地的人也被排進表格內。',
      // 第三空間
      'size_tag': '人類的尺碼，最後只剩用途。',
      'carpet_fray': '有人把希望磨成了纖維。',
      // 第四空間
      'railing_knots': '你不是第一個版本。',
      // 第五空間
      'foam_code': '你被分級，不是被救治。',
      'tape_label': '他們在乎的是貨況，不是你。',
    };

    if (narrativeHotspots[hotspotId]) {
      setCurrentDialog({
        text: narrativeHotspots[hotspotId],
        type: 'narrator',
      });
      setRefreshKey(prev => prev + 1);
      return;
    }

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


    // 第二空間：病床排列（病床輪子音效）
    if (hotspotId === 'beds' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      if (state.flags.beds_labels_revealed && state.inventory.includes('mirror_shard')) {
        audioManager.playSFX('/audio/sfx/sfx_bed_wheel.mp3', 0.5);
      }
    }

    // 第二空間：702門打開（門吱呀聲）
    if (hotspotId === 'door_702' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      if (state.flags.door_702_open) {
        audioManager.playSFX('/audio/sfx/sfx_door_creak.mp3', 0.6);
      }
    }

    // 第三空間音效觸發（在特殊處理邏輯中整合）

    // 第四空間：除鏽劑使用（除鏽劑音效）
    if (hotspotId === 'plant' && scene?.id === 'ch1_sc4') {
      audioManager.playSFX('/audio/sfx/sfx_rust_remover.mp3', 0.6);
    }

    // 第四空間：工具箱打開（工具箱打開音效）
    if (hotspotId === 'toolbox' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (state.inventory.includes('rust_remover')) {
        audioManager.playSFX('/audio/sfx/sfx_toolbox_open.mp3', 0.7);
      }
    }

    // 第四空間：固定點選擇（繩索固定音效）
    if (hotspotId === 'fixed_point_2' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (state.inventory.includes('blank_nameplate') && state.flags.restraints_collected) {
        audioManager.playSFX('/audio/sfx/sfx_rope_tension.mp3', 0.5);
      }
    }

    // 第四空間：垂降（垂降音效）
    if (hotspotId === 'descend_point' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (state.flags.fixed_point_selected) {
        audioManager.playSFX('/audio/sfx/sfx_descend.mp3', 0.6);
      }
    }

    // 第五空間：箱子排列（箱子拖動音效）
    if (hotspotId === 'boxes_area' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (state.flags.label_read && state.flags.pain_patch_found) {
        audioManager.playSFX('/audio/sfx/sfx_box_drag.mp3', 0.5);
      }
    }

    // 第五空間：心臟箱打開（箱子打開音效）
    if (hotspotId === 'heart_box' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (state.flags.boxes_arranged) {
        audioManager.playSFX('/audio/sfx/sfx_box_open.mp3', 0.6);
      }
    }

    // 第五空間：最終出口（門解鎖音效）
    if (hotspotId === 'exit' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (state.flags.final_password_revealed || state.flags.coordinates_revealed) {
        audioManager.playSFX('/audio/sfx/sfx_door_unlock.mp3', 0.7);
      }
    }

    // 第一空間特殊處理：門的互動
    if (hotspotId === 'door' && scene?.id === 'ch1_sc1') {
      const state = engine.getState();
      if (!state.flags.door_701_open) {
        // 門未打開，觸發謎題
        // 點下大門時播放尖銳金屬聲
        audioManager.playSFX('/audio/sfx/sfx_metal.mp3', 0.6);
        const doorPuzzle = scene.puzzles.find(p => p.id === 'door_code');
        if (doorPuzzle) {
          setCurrentPuzzle(doorPuzzle);
          setRefreshKey(prev => prev + 1);
          return;
        }
      } else {
        // 門已打開，顯示確認對話
        setShowDoor701Confirm(true);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第二空間特殊處理：病床（需要先取得鏡片碎角並揭示標籤才能解謎）
    if (hotspotId === 'beds' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      
      // 檢查1：是否有鏡片碎角
      if (!state.inventory.includes('mirror_shard')) {
        setCurrentDialog({
          text: '每張病床上都有標籤，但字跡模糊不清。你需要工具才能看清上面的內容。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      
      // 檢查2：是否已揭示標籤
      if (!state.flags.beds_labels_revealed) {
        engine.addInteraction('beds');
        setCurrentDialog({
          text: '病床上的標籤很模糊，看不清楚。你手中的鏡片碎角或許可以反射光線，讓你看清標籤上的字。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      
      // 已滿足所有需求，檢查謎題需求並觸發謎題
      const bedPuzzle = scene.puzzles.find(p => p.id === 'bed_arrangement');
      if (bedPuzzle) {
        // 再次驗證謎題需求（確保邏輯完整）
        const requirementsMet = engine.checkPuzzleRequirements(bedPuzzle);
        if (requirementsMet) {
          setCurrentPuzzle(bedPuzzle);
          setRefreshKey(prev => prev + 1);
          return;
        } else {
          // 如果需求未滿足，顯示提示
          setCurrentDialog({
            text: '你需要先使用鏡片碎角看清病床上的標籤。',
            type: 'narrator',
          });
          setRefreshKey(prev => prev + 1);
          return;
        }
      }
    }

    // 第二空間特殊處理：破碎的鏡子（純提示，增強沉浸感）
    if (hotspotId === 'mirror' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      // 如果已經收集了鏡片碎角，顯示不同的提示
      if (state.inventory.includes('mirror_shard')) {
        setCurrentDialog({
          text: '破碎的鏡面映出你支離破碎的倒影。你已經撿起了地上的碎片，但鏡子本身依然破碎。',
          type: 'narrator',
        });
      } else {
        const hotspot = scene.hotspots.find(h => h.id === 'mirror');
        if (hotspot?.hint) {
          setCurrentDialog({
            text: hotspot.hint,
            type: 'narrator',
          });
        }
      }
      setRefreshKey(prev => prev + 1);
      return;
    }

    // 第二空間特殊處理：702號病房的門
    if (hotspotId === 'door_702' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      if (!state.flags.door_702_open) {
        // 門未打開，顯示關閉提示
        setCurrentDialog({
          text: '702號病房的門緊閉著，無法進入。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 門已打開，顯示確認對話
        setShowDoor702Confirm(true);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第二空間特殊處理：密碼盤（觸發可選謎題）
    if (hotspotId === 'password_panel' && scene?.id === 'ch1_sc2') {
      const mirrorPuzzle = scene.puzzles.find(p => p.id === 'mirror_password');
      if (mirrorPuzzle) {
        setCurrentPuzzle(mirrorPuzzle);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第二空間特殊處理：值班表（如果已經有便條，觸發重新閱讀事件）
    if (hotspotId === 'duty_schedule' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      // 如果已經有便條，直接顯示內容（重新閱讀）
      if (state.inventory.includes('note')) {
        const result = engine.triggerEvent('read_note');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
          setRefreshKey(prev => prev + 1);
          return;
        }
      }
      // 如果沒有便條，會由 handleItemCollection 處理
    }


    // 第三空間特殊處理：衣櫃
    if (hotspotId === 'wardrobe' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已閱讀日記（觸發跳嚇的前置條件）
      if (!state.flags.diary_read) {
        setCurrentDialog({
          text: '衣櫃門緊閉。也許你應該先探索房間的其他地方。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果已經觸發過跳嚇，顯示提示
      if (state.flags.jump_scare_triggered) {
        setCurrentDialog({
          text: '衣櫃已經被打開了。假人還在那裡，但你不會再被嚇到。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 播放音效和閃爍效果
      audioManager.playSFX('/audio/sfx/sfx_wardrobe_open.mp3', 0.8);
      if (sceneViewRef.current) {
        sceneViewRef.current.triggerFlicker('intense');
      }
      // 記錄互動，然後觸發跳嚇事件
      engine.addInteraction('wardrobe');
      const result = engine.triggerEvent('wardrobe_jump_scare');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果事件觸發失敗，顯示 hotspot 提示
      const hotspot = scene.hotspots.find(h => h.id === 'wardrobe');
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
      }
      return;
    }

    // 第三空間特殊處理：監控螢幕
    if (hotspotId === 'monitor' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已觸發跳嚇（激活監控的前置條件）
      if (!state.flags.jump_scare_triggered) {
        setCurrentDialog({
          text: '監控螢幕突然亮起。也許你應該先探索房間的其他地方。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果已經激活過監控，顯示提示
      if (state.flags.monitor_activated) {
        setCurrentDialog({
          text: '監控螢幕還在顯示你在 701 病房訓練的畫面。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 播放音效
      audioManager.playSFX('/audio/sfx/sfx_monitor_on.mp3', 0.5);
      // 記錄互動，然後觸發激活事件
      engine.addInteraction('monitor');
      const result = engine.triggerEvent('monitor_activation');
      if (result) {
        // 找出所有對話效果
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        // 檢查是否有廣播對話
        const broadcastDialog = dialogEffects.find((e: any) => e.dialog?.type === 'broadcast');
        if (broadcastDialog?.dialog) {
          handleBroadcast(broadcastDialog.dialog);
        } else if (dialogEffects[0]?.dialog) {
          setCurrentDialog(dialogEffects[0].dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果事件觸發失敗，顯示 hotspot 提示
      const hotspot = scene.hotspots.find(h => h.id === 'monitor');
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
      }
      return;
    }

    // 第三空間特殊處理：沙發縫隙
    if (hotspotId === 'sofa_gap' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已獲得線索（獲得手把的前置條件）
      if (!state.flags.handle_location_revealed) {
        setCurrentDialog({
          text: '沙發的縫隙裡似乎有什麼東西，但你看不清楚。也許你應該先查看其他線索。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果已經獲得手把，顯示提示
      if (state.inventory.includes('door_handle')) {
        setCurrentDialog({
          text: '你已經從沙發縫隙中找到了手把。',
          type: 'system',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 記錄互動，然後觸發獲得手把事件
      engine.addInteraction('sofa_gap');
      const result = engine.triggerEvent('find_handle');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果事件觸發失敗，顯示 hotspot 提示
      const hotspot = scene.hotspots.find(h => h.id === 'sofa_gap');
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
      }
      return;
    }

    // 第三空間特殊處理：落地窗（檢查是否需要手把）
    if (hotspotId === 'window' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已有手把
      if (!state.inventory.includes('door_handle')) {
        // 沒有手把，顯示提示
        setCurrentDialog({
          text: '落地窗被鎖住了，需要手把才能打開。\n\n手把可能在房間的某個角落，或者被藏在某個地方。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 有手把，播放音效並顯示文案
        audioManager.playSFX('/audio/sfx/sfx_window_open.mp3', 0.6);
        // 顯示文案
        setCurrentDialog({
          text: '你把手把插入落地窗的鎖孔，轉動。窗戶緩緩打開，外面的風吹進來，帶著鐵鏽和消毒水的味道。\n\n你終於可以離開這個「展示用的」房間了。',
          type: 'narrator',
        });
        // 延遲顯示確認對話框
        setTimeout(() => {
          setShowWindow702Confirm(true);
        }, 2000);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第四空間特殊處理：固定點（純提示，引導玩家去垂降點）
    if ((hotspotId === 'fixed_point_1' || hotspotId === 'fixed_point_2') && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      const hasRequiredItems = state.inventory.includes('blank_nameplate') && 
                               state.inventory.includes('ceramic_shard') && 
                               state.inventory.includes('rust_remover');
      if (hasRequiredItems) {
        setCurrentDialog({
          text: '欄杆上有許多固定點，但單一固定點無法承受你的體重。你需要選擇多個固定點形成支撐系統。前往垂降點，根據你收集的線索選擇正確的固定點組合。',
          type: 'narrator',
        });
      } else {
        setCurrentDialog({
          text: '欄杆上有固定點，但你需要收集更多線索才能判斷哪些是安全的。檢查你收集的道具。',
          type: 'narrator',
        });
      }
      setRefreshKey(prev => prev + 1);
      return;
    }

    // 第四空間特殊處理：垂降點（觸發垂降謎題或顯示確認對話框）
    if (hotspotId === 'descend_point' && scene?.id === 'ch1_sc4') {
      // 檢查謎題是否已經解決過
      if (engine.hasFlag('puzzle_descend_solved')) {
        // 謎題已解決，直接顯示確認對話框
        setShowDescendConfirm(true);
        setRefreshKey(prev => prev + 1);
        return;
      }
      
      const state = engine.getState();
      
      // 檢查是否有必要的道具
      const hasRequiredItems = state.inventory.includes('blank_nameplate') && 
                               state.inventory.includes('ceramic_shard') && 
                               state.inventory.includes('rust_remover');
      if (!hasRequiredItems) {
        setCurrentDialog({
          text: '固定點需要線索才能判斷。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      const descendPuzzle = scene.puzzles.find(p => p.id === 'descend');
      if (descendPuzzle) {
        setCurrentPuzzle(descendPuzzle);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第五空間特殊處理：箱子區域（觸發拼箱排序謎題）
    if (hotspotId === 'boxes_area' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      // 如果謎題已經解決，顯示提示
      if (state.flags.boxes_arranged) {
        setCurrentDialog({
          text: '箱子已經按照優先級排列好了。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 先記錄互動，這樣後續檢查才能通過
      engine.addInteraction('boxes_area');
      const boxPuzzle = scene.puzzles.find(p => p.id === 'box_arrangement');
      if (boxPuzzle) {
        // 檢查謎題需求
        const requirementsMet = engine.checkPuzzleRequirements(boxPuzzle);
        if (requirementsMet) {
          setCurrentPuzzle(boxPuzzle);
          setRefreshKey(prev => prev + 1);
          return;
        } else {
          // 提供更詳細的提示
          const missingRequirements: string[] = [];
          if (!state.flags.label_read) {
            missingRequirements.push('查看冷鏈運輸標籤');
          }
          if (!state.flags.pain_patch_found) {
            missingRequirements.push('查看止痛貼片盒');
          }
          setCurrentDialog({
            text: missingRequirements.length > 0 
              ? `你需要先${missingRequirements.join('和')}，才能了解這些箱子的用途和排序規則。`
              : '你需要先了解這些箱子的用途和排序規則。',
            type: 'narrator',
          });
          setRefreshKey(prev => prev + 1);
          return;
        }
      }
    }

    // 第五空間特殊處理：心臟箱（需要先完成排序）
    if (hotspotId === 'heart_box' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      // 如果已經獲得身份證，顯示提示
      if (state.inventory.includes('id_card')) {
        setCurrentDialog({
          text: '心臟箱已經被打開，身份證已經被你取走了。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      if (!state.flags.boxes_arranged) {
        setCurrentDialog({
          text: '你需要先按照優先級排列這些箱子。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 已排序，觸發獲得身份證事件
      engine.addInteraction('heart_box');
      const result = engine.triggerEvent('find_id_card');
      if (result) {
        // 找出所有對話效果
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        if (dialogEffects[0]?.dialog) {
          setCurrentDialog(dialogEffects[0].dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第五空間特殊處理：出口（觸發最終謎題）
    if (hotspotId === 'exit' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (!state.flags.final_password_revealed && !state.flags.coordinates_revealed) {
        setCurrentDialog({
          text: '逃生口需要座標密碼才能打開。請輸入座標密碼。你需要先完成拼箱排序或查看身份證背面。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      const exitPuzzle = scene.puzzles.find(p => p.id === 'final_exit');
      if (exitPuzzle) {
        setCurrentPuzzle(exitPuzzle);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第五空間特殊處理：腎箱、肝箱、肺箱（純提示型，不觸發事件）
    if ((hotspotId === 'kidney_box' || hotspotId === 'liver_box' || hotspotId === 'lung_box') && scene?.id === 'ch1_sc5') {
      const hotspot = scene.hotspots.find(h => h.id === hotspotId);
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 特殊處理：第四空間工具箱（分離道具獲得提示，使用對話隊列）
    if (hotspotId === 'toolbox' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (!state.inventory.includes('rust_remover')) {
        setCurrentDialog({
          text: '工具箱的鎖扣鏽蝕嚴重，需要除鏽劑才能打開。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 播放音效
      audioManager.playSFX('/audio/sfx/sfx_toolbox_open.mp3', 0.7);
      // 記錄互動，然後觸發打開事件
      engine.addInteraction('toolbox');
      const result = engine.triggerEvent('open_toolbox');
      if (result) {
        // 獲取所有對話效果
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        const addItemEffects = result.effects.filter((e: any) => e.type === 'addItem');
        
        // 構建對話隊列：先顯示道具描述，再顯示事件對話
        const dialogs: Dialog[] = [];
        
        // 添加道具描述對話（藍色框）
        addItemEffects.forEach((effect: any) => {
          const item = items[effect.itemId];
          if (item) {
            dialogs.push({
              text: `獲得：${item.name}\n\n${item.description}`,
              type: 'item',
            });
          }
        });
        
        // 添加事件對話（旁白/系統）
        dialogEffects.forEach((effect: any) => {
          if (effect.dialog) {
            dialogs.push(effect.dialog);
          }
        });
        
        // 使用對話隊列顯示
        if (dialogs.length > 0) {
          addDialogsToQueue(dialogs);
        }
        
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 如果沒有特殊處理，顯示 hotspot 提示
    const hotspot = scene.hotspots.find(h => h.id === hotspotId);
    if (hotspot?.hint) {
      setCurrentDialog({
        text: hotspot.hint || hotspot.description || '',
        type: 'narrator',
      });
      setRefreshKey(prev => prev + 1);
    }
  }, [scene, handleItemCollection]); // engine 來自 useRef，不需要在依賴中

  const handleItemClick = useCallback((itemId: string) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    
    // 第二空間特殊處理：便條（觸發閱讀事件）
    if (itemId === 'note' && scene?.id === 'ch1_sc2') {
      const result = engine.triggerEvent('read_note');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第二空間特殊處理：鏡片碎角（用於病床）
    if (itemId === 'mirror_shard' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      // 檢查是否已經使用過（已觀察病床）
      if (state.flags.beds_labels_revealed) {
        // 已經使用過，顯示包含觀察結果的道具描述
        const item = scene?.items.find(i => i.id === itemId);
        setCurrentDialog({
          text: `${item?.name || '鏡片碎角'}\n\n${item?.description || ''}\n\n透過鏡片碎角的反射，你看到每張病床上都有模糊的標籤：「護理師」、「住院」、「主治」、「主任」。\n\n這些標籤有什麼意義嗎?`,
          type: 'item',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 檢查是否已與病床互動
      if (state.interactions.includes('beds')) {
        // 已與病床互動，觸發使用事件
        const result = engine.triggerEvent('use_mirror_shard_on_beds');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
          setRefreshKey(prev => prev + 1);
          return;
        }
      } else {
        // 未與病床互動，提示先觀察病床
        setCurrentDialog({
          text: '你需要在病床附近使用這個道具。先點擊病床觀察一下。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第三空間特殊處理：同意書（查看背面線索）
    if (itemId === 'consent_form' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已閱讀日記
      if (state.flags.diary_read) {
        // 已閱讀日記，觸發查看背面事件
        const result = engine.triggerEvent('examine_consent_form');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
          setRefreshKey(prev => prev + 1);
          return;
        }
      } else {
        // 未閱讀日記，顯示普通描述
        const item = scene?.items.find(i => i.id === itemId);
        if (item) {
          setCurrentDialog({
            text: item.description,
            type: 'item',
          });
          setRefreshKey(prev => prev + 1);
          return;
        }
      }
    }
    
    // 第三空間特殊處理：錄音筆（播放錄音）
    if (itemId === 'recorder' && scene?.id === 'ch1_sc3') {
      const result = engine.triggerEvent('play_recorder');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第三空間特殊處理：日記本（閱讀日記）
    if (itemId === 'diary' && scene?.id === 'ch1_sc3') {
      const result = engine.triggerEvent('read_diary');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第五空間特殊處理：身份證（查看背面座標）
    if (itemId === 'id_card' && scene?.id === 'ch1_sc5') {
      const result = engine.triggerEvent('read_id_back');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第五空間特殊處理：座標（顯示座標位置）
    if (itemId === 'coordinates') {
      const item = items[itemId];
      if (item) {
        setCurrentDialog({
          text: `**座標**\n\n**${item.description}**\n\n這是從拼箱排序中獲得的座標。`,
          type: 'item',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第五空間特殊處理：止痛貼片盒（查看背面線索）
    if (itemId === 'pain_patch' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (!state.flags.pain_patch_found) {
        setCurrentDialog({
          text: '你翻轉其中一片，背面藏著小字：\n\n**「二樓露台，箱子先肺後肝。」**',
          type: 'narrator',
        });
        engine.applyEffect({ type: 'setFlag', flag: 'pain_patch_found', value: true });
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        setCurrentDialog({
          text: '你已經看過止痛貼片盒背面的線索了。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
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
  }, [scene]); // engine 來自 useRef，不需要在依賴中

  const handlePuzzleSolve = useCallback((input: string | string[]) => {
    if (!currentPuzzle || !engineRef.current) return;
    const engine = engineRef.current;
    
    // 檢查謎題是否已經解決過
    const solvedFlag = `puzzle_${currentPuzzle.id}_solved`;
    if (engine.hasFlag(solvedFlag)) {
      // 謎題已經解決過，顯示友好提示並關閉謎題界面
      setCurrentPuzzle(null);
      setCurrentDialog({
        text: '這個謎題已經解決過了。',
        type: 'narrator',
      });
      setRefreshKey(prev => prev + 1);
      return;
    }
    
    const solved = engine.solvePuzzle(currentPuzzle.id, input);
    if (solved) {
      setPuzzleError(''); // 清除錯誤提示
      setCurrentPuzzle(null);
      
      // 獲取解決後的狀態（engine.solvePuzzle 已經應用了效果）
      const newState = engine.getState();
      
      // 檢查是否有對話效果
      const puzzle = scene?.puzzles.find(p => p.id === currentPuzzle.id);
      if (puzzle?.onSolve) {
        const dialogEffects = puzzle.onSolve.filter(e => e.type === 'showDialog');
        const sceneChange = puzzle.onSolve.find(e => e.type === 'changeScene');
        
        // 檢查場景是否已改變（使用更新後的 state）
        const sceneChanged = newState.currentChapter !== chapterId || newState.currentScene !== sceneId;
        
        // 處理多個對話效果（使用對話隊列，讓玩家自行點選依序閱讀）
        if (dialogEffects.length > 0) {
          // 第四空間特殊處理：垂降謎題完成後，使用對話隊列顯示所有對話
          if (currentPuzzle.id === 'descend' && scene?.id === 'ch1_sc4') {
            // 設置標記，表示正在處理垂降謎題的對話隊列
            isDescendPuzzleCompleteRef.current = true;
            
            // 將所有對話（包括廣播）加入隊列
            const dialogs: Dialog[] = [];
            dialogEffects.forEach((effect: any) => {
              if (effect.dialog) {
                dialogs.push(effect.dialog);
              }
            });
            
            // 使用對話隊列機制顯示所有對話
            addDialogsToQueue(dialogs);
          } else if (currentPuzzle.id === 'final_exit' && scene?.id === 'ch1_sc5') {
            // 結局特殊處理：使用對話隊列顯示所有對話，確保依序顯示
            const dialogs: Dialog[] = [];
            dialogEffects.forEach((effect: any) => {
              if (effect.dialog) {
                dialogs.push(effect.dialog);
              }
            });
            // 使用對話隊列機制顯示所有對話
            addDialogsToQueue(dialogs);
          } else {
            // 其他謎題：使用原有邏輯（第一個對話立即顯示，後續使用對話隊列）
            // 顯示第一個對話（檢查是否為廣播類型）
            if (dialogEffects[0]?.dialog) {
              if (dialogEffects[0].dialog.type === 'broadcast') {
                handleBroadcast(dialogEffects[0].dialog);
              } else {
                setCurrentDialog(dialogEffects[0].dialog);
              }
            }
            
            // 如果有多個對話，將後續對話加入隊列
            if (dialogEffects.length > 1) {
              const remainingDialogs: Dialog[] = [];
              for (let i = 1; i < dialogEffects.length; i++) {
                const dialogEffect = dialogEffects[i];
                if (dialogEffect?.dialog) {
                  remainingDialogs.push(dialogEffect.dialog);
                }
              }
              // 使用對話隊列機制顯示後續對話
              addDialogsToQueue(remainingDialogs);
            }
          }
        }
        
        // 第二空間特殊處理：病床排列完成後觸發廣播事件
        if (currentPuzzle.id === 'bed_arrangement' && scene?.id === 'ch1_sc2') {
          // 等待謎題解決對話顯示完後，觸發廣播事件
          setTimeout(() => {
            // 觸發 arrange_beds 事件（標記已設置，事件需求滿足）
            const result = engine.triggerEvent('arrange_beds');
            if (result) {
              // 找出所有對話效果
              const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
              
              // 先顯示廣播對話（使用統一的廣播處理）
              const broadcastDialog = dialogEffects.find((e: any) => e.dialog?.type === 'broadcast');
              if (broadcastDialog?.dialog) {
                handleBroadcast(broadcastDialog.dialog);
                
                // 再顯示旁白對話
                setTimeout(() => {
                  const narratorDialog = dialogEffects.find((e: any) => e.dialog?.type === 'narrator');
                  if (narratorDialog?.dialog) {
                    setCurrentDialog(narratorDialog.dialog);
                  }
                }, 3000);
              }
            }
          }, 2000); // 等待謎題解決對話顯示完
        }
        
        // 第四空間特殊處理：垂降謎題完成後顯示確認對話框
        // 注意：確認對話框的顯示邏輯已經移到 handleDialogClose 中處理
        
        // 如果有場景切換，直接使用 router.push 切換場景
        // 注意：病床排列謎題和垂降謎題不再自動切換場景，改為讓玩家選擇
        if (sceneChanged && currentPuzzle.id !== 'bed_arrangement' && currentPuzzle.id !== 'descend') {
          // 計算所有對話的總顯示時間
          const totalDialogTime = dialogEffects.length * 3000;
          if (dialogEffects.length > 0) {
            // 有對話時，延遲切換場景（讓用戶看完所有對話）
            setTimeout(() => {
              router.push(`/play/${newState.currentChapter}/${newState.currentScene}`);
            }, totalDialogTime);
          } else {
            // 沒有對話，立即切換場景
            router.push(`/play/${newState.currentChapter}/${newState.currentScene}`);
          }
        }
        
        // 結局特殊處理：最終出口謎題
        // 注意：game_completed flag 已經在 onSolve 的最後設置，不需要重複設置
        // 所有對話會通過對話隊列機制依序顯示，最後一個對話關閉後會自動顯示結束畫面
        
        // 更新 refreshKey
        setRefreshKey(prev => prev + 1);
      } else {
        // 如果 puzzle.onSolve 不存在，檢查 state 是否顯示場景已改變
        const sceneChanged = newState.currentChapter !== chapterId || newState.currentScene !== sceneId;
        if (sceneChanged) {
          router.push(`/play/${newState.currentChapter}/${newState.currentScene}`);
        }
        setRefreshKey(prev => prev + 1);
      }
    } else {
      // 錯誤提示 - 在謎題組件內部顯示
      setPuzzleError('答案不正確，再試試看。');
    }
  }, [currentPuzzle, scene, chapterId, sceneId, router]); // engine 來自 useRef，不需要在依賴中


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
        <button
          onClick={() => setShowQuitConfirm(true)}
          className="group flex items-center gap-2 px-4 py-2.5 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg"
        >
          <ArrowLeft size={18} className="group-hover:translate-x-[-2px] transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">放棄遊戲</span>
        </button>

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
          {/* 開發者模式按鈕 - 僅在 URL 參數 ?dev=1 時顯示 */}
          {devMode && (
            <button
              onClick={() => setShowDeveloperPanel(!showDeveloperPanel)}
              className={`group flex items-center justify-center w-12 h-12 backdrop-blur-md border rounded-lg transition-all duration-200 shadow-lg ${
                showDeveloperPanel
                  ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                  : 'bg-purple-600/10 border-purple-500/30 text-purple-400/50 hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-purple-300'
              }`}
              title="開發者模式 (僅在 ?dev=1 時可用)"
            >
              <Code size={22} className="transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* 場景名稱和切換按鈕 - 左上角浮動 */}
      <div className="absolute top-4 left-4 z-30 flex gap-2">
        <div className="px-4 py-2 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg shadow-lg">
          <div className="text-sm font-medium text-gray-300">{scene.name}</div>
        </div>
        {/* 場景切換按鈕 */}
        {state.visitedScenes.length > 1 && (
          <button
            onClick={() => setShowSceneSelector(!showSceneSelector)}
            className="group flex items-center gap-2 px-4 py-2 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg"
            title="切換場景"
          >
            <MapPin size={18} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            <ChevronDown size={16} className={`transition-transform ${showSceneSelector ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* 場景選擇器 */}
      {showSceneSelector && state.visitedScenes.length > 1 && (
        <>
          {/* 背景遮罩，點擊關閉 */}
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowSceneSelector(false)}
          />
          <div className="absolute top-20 left-4 z-30 w-64 bg-dark-surface/95 backdrop-blur-xl border border-dark-border rounded-lg shadow-2xl p-4">
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">已訪問的場景</div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {state.visitedScenes.map((visitedSceneId) => {
              const visitedScene = scenes[visitedSceneId];
              if (!visitedScene) return null;
              const isCurrentScene = visitedSceneId === sceneId;
              
              return (
                <button
                  key={visitedSceneId}
                  onClick={() => {
                    if (!engineRef.current) return;
                    const engine = engineRef.current;
                    // 切換場景，但保留所有狀態
                    engine.applyEffect({
                      type: 'changeScene',
                      chapterId: visitedScene.chapterId,
                      sceneId: visitedSceneId,
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engine.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                    // 導航到新場景
                    router.push(`/play/${visitedScene.chapterId}/${visitedSceneId}`);
                    setShowSceneSelector(false);
                    setRefreshKey(prev => prev + 1);
                  }}
                  disabled={isCurrentScene}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    isCurrentScene
                      ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300 cursor-not-allowed'
                      : 'bg-dark-surface/50 border border-dark-border/50 text-gray-300 hover:bg-dark-surface hover:border-dark-border hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{visitedScene.name}</div>
                      {visitedScene.description && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {visitedScene.description}
                        </div>
                      )}
                    </div>
                    {isCurrentScene && (
                      <div className="text-xs text-blue-400 font-medium">當前</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        </>
      )}

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
          onClose={handleDialogClose}
          autoClose={false}
        />
      )}

      {/* 謎題輸入 */}
      {currentPuzzle && (
        currentPuzzle.type === 'arrangement' ? (
          <ArrangementPuzzle
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'visual_selection' ? (
          <VisualSelectionPuzzle
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'combination_lock' ? (
          <CombinationLock
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : (
          <PuzzleInput
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        )
      )}

      {/* 脈搏夾量測面板 */}
      {showPulseClip && (
        <PulseClipReader
          onClose={() => setShowPulseClip(false)}
          onBroadcast={() => {
            if (!engineRef.current) return;
            const engine = engineRef.current;
            engine.triggerPulseClipBroadcast();
            const state = engine.getState();
            const scene = engine.getCurrentScene();
            if (scene) {
              const event = scene.events.find(e => e.id === 'use_pulse_clip');
              if (event) {
                const result = engine.triggerEvent('use_pulse_clip');
                // 使用統一的廣播處理
                if (result?.dialog) {
                  handleBroadcast(result.dialog);
                }
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
            if (!engineRef.current) return;
            const engine = engineRef.current;
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

      {/* 開發者面板 */}
      {showDeveloperPanel && (
        <DeveloperPanel
          onClose={() => setShowDeveloperPanel(false)}
          currentChapterId={chapterId}
          currentSceneId={sceneId}
        />
      )}

      {/* 遊戲結束畫面 */}
      {showGameEnd && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 結束圖片 */}
            <div className="w-full h-full flex items-center justify-center bg-black">
              <img 
                src="/images/ending_image.webp" 
                alt="遊戲結束" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // 如果圖片載入失敗，顯示備用文字
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="text-gray-300 text-center"><p class="text-lg mb-4">遊戲結束</p><p class="text-sm text-gray-400">感謝你的遊玩</p></div>';
                  }
                }}
              />
            </div>
            {/* 關閉按鈕 */}
            <button
              onClick={() => {
                // 清除遊戲狀態
                if (engineRef.current) {
                  const engine = engineRef.current;
                  // 清除 localStorage 中的遊戲狀態
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('gameState');
                  }
                }
                setShowGameEnd(false);
                gameEndShownRef.current = false;
                router.push('/');
              }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg z-[10000]"
            >
              返回首頁
            </button>
          </div>
        </div>
      )}

      {/* 放棄遊戲確認對話框 */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">確認放棄遊戲</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                放棄遊戲後，所有遊玩進度將會被清除，包括：
              </p>
              <ul className="mt-3 text-sm text-gray-400 space-y-1 list-disc list-inside">
                <li>當前遊戲進度</li>
                <li>已收集的道具</li>
                <li>已解決的謎題</li>
                <li>所有遊戲記錄</li>
              </ul>
              <p className="mt-4 text-sm text-red-400 font-medium">
                此操作無法復原，確定要放棄嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // 清除 localStorage
                  if (typeof window !== 'undefined') {
                    try {
                      localStorage.removeItem('gameState');
                    } catch (e) {
                      console.warn('無法清除遊戲狀態:', e);
                    }
                  }
                  // 導航到首頁
                  router.push('/');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                確認放棄
              </button>
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 第一空間門確認對話框 */}
      {showDoor701Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">離開病房 701</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                門已經打開。走廊的冷白色燈光從門縫中透進來，你聽到遠處傳來微弱的聲音。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                你要離開病房 701，前往走廊嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDoor701Confirm(false);
                  // 切換到第二空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc2',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc2');
                  setRefreshKey(prev => prev + 1);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                前往走廊
              </button>
              <button
                onClick={() => setShowDoor701Confirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 702號病房門確認對話框 */}
      {showDoor702Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">702號病房</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                門已經打開。你聽到裡面傳來微弱的聲音，像是有人在低語。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                你要進入702號病房嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDoor702Confirm(false);
                  // 切換到第三空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc3',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc3');
                  setRefreshKey(prev => prev + 1);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                進入
              </button>
              <button
                onClick={() => setShowDoor702Confirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 第四空間垂降確認對話框 */}
      {showDescendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">垂降到二樓露台</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                你已經成功垂降到二樓露台。風很大，吹得你眼睛發乾。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                要進入下一段嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDescendConfirm(false);
                  // 切換到第五空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc5',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc5');
                  setRefreshKey(prev => prev + 1);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                進入二樓露台
              </button>
              <button
                onClick={() => setShowDescendConfirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 第三空間落地窗確認對話框 */}
      {showWindow702Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">離開病房 702</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                窗戶已經打開。外面的風吹進來，帶著鐵鏽和消毒水的味道。陽台在下方等待著你。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                你要離開病房 702，前往陽台嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWindow702Confirm(false);
                  // 切換到第四空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc4',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc4');
                  setRefreshKey(prev => prev + 1);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                離開
              </button>
              <button
                onClick={() => setShowWindow702Confirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

