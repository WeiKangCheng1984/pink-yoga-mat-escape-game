// 音效管理器
export class AudioManager {
  private ambientAudio: HTMLAudioElement | null = null;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();
  private masterVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private ambientVolume: number = 0.3;

  // 播放環境音（循環）
  playAmbient(audioPath: string, volume?: number): void {
    this.stopAmbient();
    if (!audioPath) return;
    
    try {
      const audio = new Audio(audioPath);
      audio.loop = true;
      audio.volume = (volume !== undefined ? volume : this.ambientVolume) * this.masterVolume;
      audio.play().catch((err) => {
        console.warn('無法播放環境音:', err);
      });
      this.ambientAudio = audio;
    } catch (error) {
      console.warn('載入環境音失敗:', error);
    }
  }

  // 播放音效（一次性）
  playSFX(audioPath: string, volume?: number): void {
    if (!audioPath) return;
    
    try {
      // 使用快取避免重複載入
      let audio = this.sfxCache.get(audioPath);
      if (!audio) {
        audio = new Audio(audioPath);
        this.sfxCache.set(audioPath, audio);
      }
      audio.volume = (volume !== undefined ? volume : this.sfxVolume) * this.masterVolume;
      audio.currentTime = 0; // 重置播放位置
      audio.play().catch((err) => {
        console.warn('無法播放音效:', err);
      });
    } catch (error) {
      console.warn('載入音效失敗:', error);
    }
  }

  // 停止環境音
  stopAmbient(): void {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio = null;
    }
  }

  // 設定音量
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.ambientVolume * this.masterVolume;
    }
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setAmbientVolume(volume: number): void {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.ambientVolume * this.masterVolume;
    }
  }

  // 清理資源
  cleanup(): void {
    this.stopAmbient();
    this.sfxCache.clear();
  }
}

// 單例實例
export const audioManager = new AudioManager();

