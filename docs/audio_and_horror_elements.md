# 音效與恐怖元素實作總結

## 修改內容

### 1. 廣播觸發時機確認

所有廣播觸發時機已確認並統一處理：

- **第一空間**：使用脈搏夾後觸發 `broadcasts.first`
- **第二空間**：完成病床排列後觸發 `broadcasts.second`
- **第三空間**：激活監控螢幕後觸發 `broadcasts.third`
- **第四空間**：完成垂降謎題時觸發 `broadcasts.fourth`

詳細說明請參考：`docs/broadcast_triggers.md`

---

### 2. 恐怖元素添加

為每個空間添加了隨機恐怖元素（閃光+音效）：

#### 第一空間：病房 701
- **觸發間隔**：12秒
- **觸發機率**：30%
- **恐怖音效**：`horror_whisper.mp3`（低語聲）
- **效果**：輕微閃光 + 低語聲

#### 第二空間：走廊
- **觸發間隔**：15秒
- **觸發機率**：30%
- **恐怖音效**：`horror_heartbeat.mp3`（心跳聲）
- **效果**：輕微閃光 + 心跳聲

#### 第三空間：病房 702
- **觸發間隔**：10秒（更頻繁）
- **觸發機率**：30%
- **恐怖音效**：`horror_breathing.mp3`（呼吸聲）
- **效果**：輕微閃光 + 呼吸聲

#### 第四空間：702 陽台
- **觸發間隔**：18秒
- **觸發機率**：30%
- **恐怖音效**：`horror_wind.mp3`（風聲）
- **效果**：輕微閃光 + 風聲

#### 第五空間：二樓露台
- **觸發間隔**：20秒
- **觸發機率**：30%
- **恐怖音效**：`horror_ambient.mp3`（恐怖環境音）
- **效果**：輕微閃光 + 恐怖環境音

---

### 3. 音效系統實作

#### 環境音效（循環播放）

每個空間都有專屬的環境音效：

- **第一空間**：`ambient_hospital.mp3`（音量：0.25）
- **第二空間**：`ambient_hospital.mp3`（音量：0.25）
- **第三空間**：`ambient_room702.mp3`（音量：0.2）
- **第四空間**：`ambient_balcony.mp3`（音量：0.25）
- **第五空間**：`ambient_terrace.mp3`（音量：0.2）

#### 互動音效（一次性）

為每個空間的關鍵互動點添加了音效：

**第一空間：**
- `sfx_drawer_open.mp3` - 抽屜打開
- `sfx_metal.mp3` - 門點擊

**第二空間：**
- `sfx_paper_rustle.mp3` - 值班表翻動
- `sfx_glass_break.mp3` - 鏡片碎角收集
- `sfx_bed_wheel.mp3` - 病床排列
- `sfx_door_creak.mp3` - 702門打開

**第三空間：**
- `sfx_recorder_click.mp3` - 錄音筆按鍵
- `sfx_wardrobe_open.mp3` - 衣櫃打開（跳嚇）
- `sfx_monitor_on.mp3` - 監控螢幕開啟
- `sfx_window_open.mp3` - 窗戶打開

**第四空間：**
- `sfx_rust_remover.mp3` - 除鏽劑使用
- `sfx_toolbox_open.mp3` - 工具箱打開
- `sfx_rope_tension.mp3` - 繩索固定
- `sfx_descend.mp3` - 垂降

**第五空間：**
- `sfx_box_drag.mp3` - 箱子拖動
- `sfx_box_open.mp3` - 箱子打開
- `sfx_door_unlock.mp3` - 門解鎖

#### 廣播音效

- `broadcast_static.mp3` - 所有廣播觸發時播放（音量：0.7）

---

## 音效檔案結構

```
public/audio/
├── ambient/              # 環境音效（循環播放）
│   ├── ambient_hospital.mp3
│   ├── ambient_room702.mp3
│   ├── ambient_balcony.mp3
│   └── ambient_terrace.mp3
├── sfx/                  # 互動音效（一次性）
│   ├── sfx_drawer_open.mp3
│   ├── sfx_metal.mp3
│   ├── sfx_paper_rustle.mp3
│   ├── sfx_glass_break.mp3
│   ├── sfx_bed_wheel.mp3
│   ├── sfx_door_creak.mp3
│   ├── sfx_recorder_click.mp3
│   ├── sfx_wardrobe_open.mp3
│   ├── sfx_monitor_on.mp3
│   ├── sfx_window_open.mp3
│   ├── sfx_rust_remover.mp3
│   ├── sfx_toolbox_open.mp3
│   ├── sfx_rope_tension.mp3
│   ├── sfx_descend.mp3
│   ├── sfx_box_drag.mp3
│   ├── sfx_box_open.mp3
│   └── sfx_door_unlock.mp3
├── broadcast/            # 廣播音效
│   └── broadcast_static.mp3
└── horror/               # 恐怖音效
    ├── horror_whisper.mp3
    ├── horror_heartbeat.mp3
    ├── horror_breathing.mp3
    ├── horror_wind.mp3
    └── horror_ambient.mp3
```

---

## 程式修改位置

### 主要修改檔案

1. **`app/play/[chapterId]/[sceneId]/page.tsx`**
   - 添加環境音效播放邏輯（line 152-201）
   - 添加恐怖元素隨機觸發邏輯（line 203-245）
   - 添加統一的廣播處理函數（line 197-204）
   - 為所有互動點添加音效觸發（line 315-844）
   - 更新所有廣播觸發點使用統一處理（line 1044-1097）

2. **`public/audio/README.md`**
   - 更新音效檔案結構說明
   - 添加各空間音效需求說明

3. **`docs/broadcast_triggers.md`**（新建）
   - 詳細記錄所有廣播觸發時機
   - 說明廣播處理流程

---

## 音效檔案準備指南

### 檔案格式
- **格式**：MP3（相容性最佳）
- **品質**：128 kbps
- **長度**：
  - 環境音：30-60秒（會循環播放）
  - 音效：0.5-3秒
  - 廣播：1-2秒
  - 恐怖音效：2-5秒

### 檔案大小建議
- 單個檔案 < 500KB
- 環境音可稍大（< 1MB）

### 資源來源建議
- [Freesound.org](https://freesound.org/) - 免費音效庫
- [Zapsplat](https://www.zapsplat.com/) - 免費音效庫
- [OpenGameArt](https://opengameart.org/) - 遊戲資源

---

## 測試建議

1. **環境音效測試**
   - 確認每個空間的環境音正確播放
   - 確認場景切換時環境音正確停止

2. **互動音效測試**
   - 測試每個互動點的音效是否正確觸發
   - 確認音效音量適中

3. **廣播測試**
   - 測試所有4個廣播觸發時機
   - 確認廣播音效和閃爍效果正確

4. **恐怖元素測試**
   - 在每個空間停留一段時間，觀察恐怖元素是否隨機觸發
   - 確認恐怖音效音量適中（不會過於驚嚇）

---

## 注意事項

1. **音效檔案路徑**
   - 所有音效檔案必須放在 `public/audio/` 對應的子資料夾中
   - 檔案名稱必須與程式碼中的路徑完全一致

2. **廣播處理**
   - 所有廣播都通過統一的 `handleBroadcast` 函數處理
   - 廣播對話的 `type` 必須是 `'broadcast'` 才會觸發特殊處理

3. **恐怖元素**
   - 恐怖元素是隨機觸發的，不會影響遊戲流程
   - 如果音效檔案不存在，不會報錯，只是不會播放音效

4. **音效載入**
   - 音效使用快取機制，避免重複載入
   - 環境音在場景切換時會自動停止

