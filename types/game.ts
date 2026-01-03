// 遊戲核心型別定義

export type HotspotShape = 'rect' | 'poly';

export interface Hotspot {
  id: string;
  shape: HotspotShape;
  coords: number[]; // 比例座標 (0-1)
  description?: string;
  hint?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  collectible: boolean;
  usable?: boolean;
}

export interface Requirement {
  type: 'hasItem' | 'hasUsedItem' | 'hasInteracted' | 'hasFlag' | 'custom';
  itemId?: string;
  hotspotId?: string;
  flag?: string;
  value?: any;
  customCheck?: (state: GameState) => boolean;
}

export interface Effect {
  type: 'addItem' | 'removeItem' | 'setFlag' | 'showDialog' | 'playAudio' | 'triggerEvent' | 'changeScene';
  itemId?: string;
  flag?: string;
  value?: any;
  dialog?: Dialog;
  audio?: string;
  eventId?: string;
  sceneId?: string;
  chapterId?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  requirements: Requirement[];
  effects: Effect[];
  oneTime?: boolean;
}

export interface Dialog {
  text: string;
  type?: 'narrator' | 'broadcast' | 'item' | 'system';
  audio?: string;
}

export interface Puzzle {
  id: string;
  type: 'input' | 'sequence' | 'arrangement' | 'combination' | 'visual_selection' | 'combination_lock';
  solution: string | string[];
  hint?: string;
  requirements?: Requirement[];
  onSolve?: Effect[];
  options?: Array<{ id: string; label: string; description?: string; visual?: string }>; // 視覺化選擇謎題的選項
}

export interface Scene {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  background: string; // 背景圖路徑
  hotspots: Hotspot[];
  items: Item[];
  events: Event[];
  puzzles: Puzzle[];
  initialDialog?: Dialog;
  ambientAudio?: string;
  hotspotEventMap?: Record<string, string>; // hotspot ID -> event ID 映射表
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  scenes: string[]; // scene IDs
}

export interface GameState {
  currentChapter: string;
  currentScene: string;
  inventory: string[]; // item IDs
  flags: Record<string, any>;
  interactions: string[]; // 已互動的 hotspot/event IDs
  visitedScenes: string[];
}

