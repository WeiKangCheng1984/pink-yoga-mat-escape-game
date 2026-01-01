# 廣播觸發時機總結

## 廣播系統說明

所有廣播都會觸發以下效果：
1. **播放廣播音效**：`/audio/broadcast/broadcast_static.mp3`（音量：0.7）
2. **觸發劇烈閃爍**：2-3次強烈閃爍效果
3. **顯示廣播對話**：顯示廣播文字內容

所有廣播處理都通過統一的 `handleBroadcast` 函數執行。

---

## 第一空間：病房 701

### 廣播一：`broadcasts.first`
- **觸發時機**：使用脈搏夾（`pulse_clip`）測量數據後
- **觸發條件**：
  - 已獲得脈搏夾（`hasItem('pulse_clip')`）
  - 已使用脈搏夾（`hasFlag('pulse_clip_used', true)`）
- **觸發事件**：`use_pulse_clip`
- **廣播內容**：`「701，07號。醒了就不要浪費氧氣。」`
- **程式位置**：
  - 事件定義：`data/gameData.ts` (line 267-278)
  - 觸發邏輯：`app/play/[chapterId]/[sceneId]/page.tsx` (line 1347-1369)
  - 處理方式：`PulseClipReader` 組件的 `onBroadcast` 回調

---

## 第二空間：走廊

### 廣播二：`broadcasts.second`
- **觸發時機**：完成病床排列謎題（`bed_arrangement`）後
- **觸發條件**：
  - 已獲得鏡片碎角（`hasItem('mirror_shard')`）
  - 已揭示病床標籤（`hasFlag('beds_labels_revealed', true)`）
  - 已完成病床排列（`hasFlag('beds_arranged', true)`）
- **觸發事件**：`arrange_beds`
- **廣播內容**：`「07號，請保持心率在『漂亮』的範圍內。」`
- **程式位置**：
  - 事件定義：`data/gameData.ts` (line 532-552)
  - 觸發邏輯：`app/play/[chapterId]/[sceneId]/page.tsx` (line 1072-1097)
  - 處理方式：謎題解決後延遲2秒觸發 `arrange_beds` 事件

---

## 第三空間：病房 702

### 廣播三：`broadcasts.third`
- **觸發時機**：激活監控螢幕後
- **觸發條件**：
  - 已觸發衣櫃跳嚇（`hasFlag('jump_scare_triggered', true)`）
  - 已點擊監控螢幕（`hasInteracted('monitor')`）
- **觸發事件**：`monitor_activation`
- **廣播內容**：`「實驗體 07 體能已達標，準備收割。……請勿弄髒地面。」`
- **程式位置**：
  - 事件定義：`data/gameData.ts` (line 816-834)
  - 觸發邏輯：`app/play/[chapterId]/[sceneId]/page.tsx` (line 846-870)
  - 處理方式：點擊監控螢幕後，通過 `interactWithHotspot` 觸發事件，自動檢測廣播類型對話

---

## 第四空間：702 陽台

### 廣播四：`broadcasts.fourth`
- **觸發時機**：完成垂降謎題（`descend`）時
- **觸發條件**：
  - 已選擇固定點（`hasFlag('fixed_point_selected', true)`）
- **觸發事件**：`descend_broadcast`（在謎題 `onSolve` 中直接顯示）
- **廣播內容**：`「07號，不要摔壞。」`
- **程式位置**：
  - 事件定義：`data/gameData.ts` (line 1058-1075)
  - 謎題定義：`data/gameData.ts` (line 1078-1108)
  - 觸發邏輯：`app/play/[chapterId]/[sceneId]/page.tsx` (line 1044-1069)
  - 處理方式：謎題解決後，在 `onSolve` 效果中直接顯示廣播對話（自動檢測廣播類型）

---

## 廣播處理流程圖

```
玩家觸發條件
    ↓
檢查觸發條件（hasItem/hasFlag/hasInteracted）
    ↓
觸發事件（triggerEvent）
    ↓
事件返回對話效果（dialog.type === 'broadcast'）
    ↓
調用 handleBroadcast(dialog)
    ↓
┌─────────────────────────┐
│ 1. 播放廣播音效          │
│    broadcast_static.mp3  │
│    音量：0.7             │
├─────────────────────────┤
│ 2. 觸發劇烈閃爍          │
│    triggerIntenseFlicker │
│    2-3次強烈閃爍         │
├─────────────────────────┤
│ 3. 顯示廣播對話          │
│    setCurrentDialog      │
└─────────────────────────┘
```

---

## 技術細節

### 統一的廣播處理函數

```typescript
const handleBroadcast = useCallback((dialog: Dialog) => {
  // 播放廣播音效
  audioManager.playSFX('/audio/broadcast/broadcast_static.mp3', 0.7);
  // 觸發劇烈閃爍
  triggerIntenseFlicker();
  // 顯示廣播對話
  setCurrentDialog(dialog);
}, [triggerIntenseFlicker]);
```

### 廣播對話檢測

在所有對話顯示的地方，都會檢查 `dialog.type === 'broadcast'`：
1. `handleHotspotClick` → `interactWithHotspot` 後
2. `handlePuzzleSolve` → 謎題解決後的對話效果
3. `PulseClipReader` → 脈搏夾廣播回調

---

## 音效檔案需求

- **廣播音效**：`/audio/broadcast/broadcast_static.mp3`
  - 長度：1-2秒
  - 音量：0.7
  - 內容：電流聲、靜電聲

---

## 注意事項

1. 所有廣播都會觸發相同的音效和閃爍效果
2. 廣播對話的 `type` 必須是 `'broadcast'` 才會觸發特殊處理
3. 廣播對話會覆蓋當前顯示的對話
4. 廣播後的旁白對話會延遲3秒顯示（如果有）

