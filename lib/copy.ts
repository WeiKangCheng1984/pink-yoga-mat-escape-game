/**
 * 集中管理：場景主線通關回饋、結局畫面文案與資產路徑（改字不改 JSX）
 */

/** 通關短音效：若檔案尚未放入 public，audioManager 會靜默失敗（console.warn） */
export const SCENE_CLEAR_SFX_PATH = '/audio/sfx/sfx_scene_clear.mp3';

/** 結局圖（720×720 等比例皆可；缺檔時由元件 onError 備援） */
export const ENDING_IMAGE_PATH = '/images/ending_image.webp';

export const sceneClearCopy = {
  milestone_door_701: {
    title: '701 門鎖已解',
    subtitle: '冷白光在走廊另一頭等你。',
  },
  milestone_beds: {
    title: '病床已就序',
    subtitle: '階級排成線，像有人在替你指路。',
  },
  milestone_window_702: {
    title: '邊界已跨過',
    subtitle: '陽台的風接住了你。',
  },
  milestone_descend: {
    title: '垂降完成',
    subtitle: '你用他們的束縛，替自己鋪了一條路。',
  },
  milestone_boxes: {
    title: '路線已理清',
    subtitle: '箱子順序對了，下一站才會出現。',
  },
} as const;

export type SceneClearKey = keyof typeof sceneClearCopy;

export const endingScreenCopy = {
  heading: '荒野之後',
  paragraphs: [
    '門外不是城市，是沒有路標的風。你仍握著那條粉紅的線——它提醒你：你不是貨，你是還會痛、還會選的人。',
    '地圖在墊子上，回收點在遠方；奔跑不再只是逃，是把「編號」撕回名字。',
  ],
  thanksLine: '感謝遊玩',
  creditLine: '粉紅瑜珈墊 · 互動敘事',
} as const;
