# 音效資源說明

## 文件夾結構

```
public/audio/
├── ambient/          # 環境音效（循環播放）
│   └── ambient_hospital.mp3
├── sfx/              # 互動音效（一次性）
│   ├── sfx_drawer_open.mp3
│   └── sfx_metal.mp3
└── broadcast/        # 廣播音效
    └── broadcast_static.mp3
```

## 第一空間所需音效

### 環境音效
- **ambient_hospital.mp3** (30-60秒，循環)
  - 醫院環境音：消毒水聲、遠處腳步聲、設備運轉聲
  - 音量建議：0.25

### 互動音效
- **sfx_drawer_open.mp3** (0.5-2秒)
  - 抽屜打開的聲音
  - 音量建議：0.7

- **sfx_metal.mp3** (0.5-2秒)
  - 尖銳金屬聲（點擊大門時）
  - 音量建議：0.6

### 廣播音效
- **broadcast_static.mp3** (1-2秒)
  - 廣播電流聲（廣播觸發時）
  - 音量建議：0.7

## 音效資源建議

### 格式
- **MP3** (相容性最佳)
- **OGG** (檔案較小，但相容性較差)

### 品質
- 環境音：128-192 kbps
- 音效：128 kbps

### 長度
- 環境音：30-60 秒（會循環播放）
- 音效：0.5-3 秒
- 廣播：1-2 秒

### 資源來源
- [Freesound.org](https://freesound.org/) - 免費音效庫
- [Zapsplat](https://www.zapsplat.com/) - 免費音效庫
- [OpenGameArt](https://opengameart.org/) - 遊戲資源

## 注意事項

1. 所有音效檔案應放在 `public/audio/` 對應的子資料夾中
2. 檔案名稱必須與程式碼中的路徑完全一致
3. 建議使用小寫字母和底線命名（snake_case）
4. 檔案大小建議控制在合理範圍內（單個檔案 < 500KB）

