# 開發指南

## 快速開始

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **準備圖片資源**
   - 在 `public/images/` 目錄放置場景背景圖
   - 圖片命名：`bg_ch1_sc1_v1.png` (720×720px, ≤ 250KB)

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **訪問遊戲**
   - 首頁：http://localhost:3000
   - 遊戲：http://localhost:3000/play/ch1/ch1_sc1
   - Debug 模式：http://localhost:3000/play/ch1/ch1_sc1?debug=1

## 遊戲資料結構

### 新增場景

在 `data/gameData.ts` 中的 `scenes` 物件新增場景：

```typescript
'ch1_sc6': {
  id: 'ch1_sc6',
  chapterId: 'ch1',
  name: '場景名稱',
  description: '場景描述',
  background: '/images/bg_ch1_sc6_v1.png',
  hotspots: [
    {
      id: 'hotspot_id',
      shape: 'rect',
      coords: [0.1, 0.2, 0.3, 0.4], // [x, y, width, height] 比例值
      description: '互動區域描述',
      hint: '提示文字',
    },
  ],
  items: [items.item_id],
  events: [
    {
      id: 'event_id',
      name: '事件名稱',
      description: '事件描述',
      requirements: [
        { type: 'hasItem', itemId: 'item_id' },
      ],
      effects: [
        { type: 'addItem', itemId: 'new_item' },
        { type: 'showDialog', dialog: { text: '對話內容', type: 'narrator' } },
      ],
      oneTime: true,
    },
  ],
  puzzles: [
    {
      id: 'puzzle_id',
      type: 'input',
      solution: '答案',
      hint: '提示',
      onSolve: [
        { type: 'changeScene', chapterId: 'ch1', sceneId: 'ch1_sc7' },
      ],
    },
  ],
  initialDialog: {
    text: '進入場景時的對話',
    type: 'narrator',
  },
},
```

### 新增道具

在 `data/gameData.ts` 中的 `items` 物件新增道具：

```typescript
'new_item': {
  id: 'new_item',
  name: '道具名稱',
  description: '道具描述',
  collectible: true,
  usable: false,
},
```

### Hotspot 座標計算

使用比例值 (0~1)：
- 左上角座標：`[x, y]`
- 右下角座標：`[x + width, y + height]`
- 例如：`[0.1, 0.2, 0.3, 0.4]` 表示從 (10%, 20%) 到 (30%, 40%)

## 遊戲引擎 API

### GameEngine 類別

```typescript
const engine = new GameEngine();

// 獲取當前場景
const scene = engine.getCurrentScene();

// 獲取遊戲狀態
const state = engine.getState();

// 檢查是否有道具
engine.hasItem('item_id');

// 檢查是否已互動
engine.hasInteracted('hotspot_id');

// 檢查標記
engine.hasFlag('flag_name');

// 與 Hotspot 互動
const result = engine.interactWithHotspot('hotspot_id');

// 觸發事件
const result = engine.triggerEvent('event_id');

// 解決謎題
const solved = engine.solvePuzzle('puzzle_id', '答案');

// 使用道具
const result = engine.useItem('item_id');
```

## 組件使用

### DialogBox

顯示對話框：

```tsx
<DialogBox
  dialog={{
    text: '對話內容',
    type: 'narrator', // 'narrator' | 'broadcast' | 'item' | 'system'
  }}
  onClose={() => setDialog(null)}
/>
```

### Inventory

顯示道具欄：

```tsx
<Inventory
  itemIds={['item1', 'item2']}
  onItemClick={(itemId) => handleItemClick(itemId)}
/>
```

### SceneView

顯示場景：

```tsx
<SceneView
  scene={sceneData}
  onHotspotClick={(hotspotId) => handleClick(hotspotId)}
  debug={true} // 顯示互動區域
/>
```

### PuzzleInput

顯示謎題輸入：

```tsx
<PuzzleInput
  puzzle={puzzleData}
  onSolve={(input) => handleSolve(input)}
  onClose={() => setPuzzle(null)}
/>
```

## 除錯技巧

1. **Debug 模式**
   - URL 加上 `?debug=1` 顯示所有 Hotspot 區域

2. **控制台檢查**
   - 檢查 `engine.getState()` 查看當前遊戲狀態
   - 檢查 `engine.getCurrentScene()` 查看當前場景

3. **常見問題**
   - Hotspot 點不到：檢查座標是否正確
   - 事件不觸發：檢查 requirements 是否滿足
   - 場景不切換：檢查 changeScene effect 是否正確設定

## 部署檢查清單

- [ ] 所有圖片資源已放置
- [ ] 圖片大小符合規範 (≤ 250KB)
- [ ] 測試所有場景切換
- [ ] 測試所有謎題
- [ ] 測試所有事件觸發
- [ ] 檢查移動端顯示
- [ ] 檢查 Debug 模式

