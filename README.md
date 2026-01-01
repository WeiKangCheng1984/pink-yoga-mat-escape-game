# 粉紅瑜珈墊 - 密室逃脫遊戲

一個基於 Next.js 14 的沉浸式密室逃脫遊戲，講述一個關於身份、價值與逃亡的故事。

## 技術棧

- **Next.js 14** (App Router)
- **TypeScript 5**
- **Tailwind CSS 3**
- **Lucide React** (圖示)
- **Vercel** (部署)

## 專案結構

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首頁
│   └── play/              # 遊戲頁面
│       └── [chapterId]/[sceneId]/
├── components/            # React 組件
│   ├── DialogBox.tsx     # 對話框
│   ├── Inventory.tsx     # 道具欄
│   ├── SceneView.tsx     # 場景視圖
│   └── PuzzleInput.tsx   # 謎題輸入
├── data/                 # 遊戲資料
│   └── gameData.ts       # 場景、道具、事件定義
├── lib/                  # 核心邏輯
│   └── gameEngine.ts     # 遊戲引擎
├── types/                # TypeScript 型別
│   └── game.ts           # 遊戲型別定義
└── public/               # 靜態資源
    └── images/           # 遊戲圖片
```

## 安裝與運行

### 1. 安裝依賴

```bash
npm install
```

### 2. 準備圖片資源

在 `public/images/` 目錄下放置場景背景圖：

```
public/images/
├── bg_ch1_sc1_v1.png  # 病房 701
├── bg_ch1_sc2_v1.png  # 走廊
├── bg_ch1_sc3_v1.png  # 病房 702
├── bg_ch1_sc4_v1.png  # 702 陽台
└── bg_ch1_sc5_v1.png  # 二樓露台
```

**圖片規範：**
- 尺寸：720×720px
- 格式：PNG
- 大小：≤ 250KB

### 3. 開發模式

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

### 4. 生產建置

```bash
npm run build
npm start
```

## 遊戲玩法

1. **點擊場景中的物件**進行互動
2. **收集道具**並在背包中查看
3. **解決謎題**推進劇情
4. **閱讀對話**了解故事背景

### Debug 模式

在 URL 後加上 `?debug=1` 可顯示互動區域（hotspots）

例如：`http://localhost:3000/play/ch1/ch1_sc1?debug=1`

## 遊戲場景

### 第一空間：病房 701
- 甦醒與身份
- 核心謎題：UV 燈揭示運動數據 → 密碼 12080

### 第二空間：走廊
- 混亂的指引
- 核心謎題：鏡子反射密碼、病床排列

### 第三空間：病房 702
- 恐懼與記憶殘片
- 核心謎題：日記、瑜珈幽靈、監控螢幕

### 第四空間：702 陽台
- 逃出生天
- 核心謎題：除鏽劑、工具箱、繩索垂降

### 第五空間：二樓露台
- 真相大白
- 核心謎題：器官箱排序、身份證座標

## 開發規範

### Hotspot 座標
- 使用比例值 (0~1)，不使用 px
- 形狀：矩形 (rect) 或 多邊形 (poly)
- 最小可點尺寸：手機至少等效 44×44px

### 道具命名
- 格式：`item_{id}_v{版}.webp/png`
- 尺寸：長邊 384px（特寫 512px）
- 大小：≤ 80KB

### 背景圖命名
- 格式：`bg_ch{章}_sc{場}_v{版}.png`
- 尺寸：720×720px
- 大小：≤ 250KB

## 部署

### Vercel

1. 推送代碼到 GitHub
2. 在 Vercel 中導入專案
3. 自動部署完成

或使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

## 授權

本專案為個人作品，僅供學習與展示使用。

