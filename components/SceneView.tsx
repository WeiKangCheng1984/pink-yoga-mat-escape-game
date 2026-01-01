'use client';

import { Scene, Hotspot } from '@/types/game';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';

interface SceneViewProps {
  scene: Scene;
  onHotspotClick: (hotspotId: string) => void;
  debug?: boolean;
  interactionCount?: number; // 互動次數，用於判斷是否接近解謎
}

export interface SceneViewRef {
  triggerFlicker: (intensity?: 'light' | 'strong' | 'intense' | 'red' | 'electric') => void;
}

const SceneView = forwardRef<SceneViewRef, SceneViewProps>(
  ({ scene, onHotspotClick, debug = false, interactionCount = 0 }, ref) => {
  const [imageError, setImageError] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null);
  const [lightFlicker, setLightFlicker] = useState(false);
  const [redFlicker, setRedFlicker] = useState(false);
  const [electricFlicker, setElectricFlicker] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [flickerKey, setFlickerKey] = useState(0);
  const [flickerType, setFlickerType] = useState<'white' | 'red' | 'electric'>('white');

  // 觸發閃爍的外部方法
  useImperativeHandle(ref, () => ({
    triggerFlicker: (intensity: 'light' | 'strong' | 'intense' | 'red' | 'electric' = 'light') => {
      const durations = {
        light: 100,
        strong: 200,
        intense: 300,
        red: 150,
        electric: 50,
      };
      
      if (intensity === 'red') {
        setFlickerType('red');
        setRedFlicker(true);
        setFlickerKey(prev => prev + 1);
        setTimeout(() => setRedFlicker(false), durations[intensity]);
      } else if (intensity === 'electric') {
        setFlickerType('electric');
        setFlickerKey(prev => prev + 1);
        // 電流特效：快速閃爍多次
        let flashCount = 0;
        const electricFlash = () => {
          setElectricFlicker(prev => {
            flashCount++;
            if (flashCount >= 6) {
              return false;
            }
            return !prev;
          });
          if (flashCount < 6) {
            setTimeout(electricFlash, 50);
          }
        };
        electricFlash();
      } else {
        setFlickerType('white');
        setLightFlicker(true);
        setFlickerKey(prev => prev + 1);
        setTimeout(() => setLightFlicker(false), durations[intensity]);
      }
    },
  }));

  // 背景閃爍邏輯
  useEffect(() => {
    // 根據互動次數調整閃爍頻率（接近解謎時頻率增加）
    // 互動次數越多，閃爍間隔越短
    const baseInterval = 8000; // 8秒
    const minInterval = 4000; // 最小4秒
    const intervalReduction = Math.min(interactionCount * 500, 4000); // 最多減少4秒
    const flickerInterval = Math.max(minInterval, baseInterval - intervalReduction);
    
    // 隨機輕微閃爍（白色）
    const flickerTimer = setInterval(() => {
      if (Math.random() < 0.3) { // 30% 機率閃爍
        setFlickerType('white');
        setLightFlicker(true);
        setTimeout(() => setLightFlicker(false), 100 + Math.random() * 200);
      }
    }, flickerInterval + Math.random() * 7000); // 加上隨機變化

    // 偶爾紅色閃光（10% 機率）
    const redFlickerTimer = setInterval(() => {
      if (Math.random() < 0.1) { // 10% 機率紅色閃光
        setFlickerType('red');
        setRedFlicker(true);
        setTimeout(() => setRedFlicker(false), 150 + Math.random() * 100);
      }
    }, 15000 + Math.random() * 10000); // 15-25秒間隔

    // 偶爾電流特效（5% 機率）
    const electricTimer = setInterval(() => {
      if (Math.random() < 0.05) { // 5% 機率電流特效
        setFlickerType('electric');
        // 電流特效：快速閃爍多次
        let flashCount = 0;
        const electricFlash = () => {
          setElectricFlicker(prev => {
            flashCount++;
            if (flashCount >= 6) {
              return false;
            }
            return !prev;
          });
          if (flashCount < 6) {
            setTimeout(electricFlash, 50);
          }
        };
        electricFlash();
      }
    }, 20000 + Math.random() * 15000); // 20-35秒間隔

    // 偶爾亮度變化
    const intensityTimer = setInterval(() => {
      if (Math.random() < 0.2) {
        setLightIntensity(0.85 + Math.random() * 0.15);
        setTimeout(() => setLightIntensity(1), 500);
      }
    }, 12000 + Math.random() * 8000);

    return () => {
      clearInterval(flickerTimer);
      clearInterval(redFlickerTimer);
      clearInterval(electricTimer);
      clearInterval(intensityTimer);
    };
  }, [interactionCount]);

  const handleHotspotClick = (hotspot: Hotspot, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // 點擊波紋效果
    setClickedHotspot(hotspot.id);
    setTimeout(() => setClickedHotspot(null), 300);
    
    onHotspotClick(hotspot.id);
  };

  const getHotspotStyle = (hotspot: Hotspot): React.CSSProperties => {
    if (hotspot.shape === 'rect' && hotspot.coords.length >= 4) {
      const [x, y, width, height] = hotspot.coords;
      return {
        position: 'absolute',
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${(width - x) * 100}%`,
        height: `${(height - y) * 100}%`,
        cursor: 'pointer',
      };
    }
    return {};
  };

  return (
    <div className="relative w-full h-full bg-dark-bg">
      {/* 白色燈光閃爍層 */}
      <div 
        key={flickerKey}
        className={`
          absolute inset-0 pointer-events-none z-10
          transition-all duration-75
          ${lightFlicker && flickerType === 'white' ? 'bg-white/15' : 'bg-transparent'}
        `}
        style={{
          filter: `brightness(${lightIntensity})`,
        }}
      />
      
      {/* 紅色閃光層 */}
      <div 
        key={`red-${flickerKey}`}
        className={`
          absolute inset-0 pointer-events-none z-11
          transition-all duration-75
          ${redFlicker && flickerType === 'red' ? 'bg-red-500/25' : 'bg-transparent'}
        `}
        style={{
          mixBlendMode: 'screen',
        }}
      />
      
      {/* 電流特效層 */}
      {electricFlicker && flickerType === 'electric' && (
        <div 
          key={`electric-${flickerKey}`}
          className="absolute inset-0 pointer-events-none z-12 animate-electric-shimmer"
          style={{
            mixBlendMode: 'screen',
            filter: 'contrast(1.5)',
            backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.4) 25%, transparent 50%, rgba(34, 211, 238, 0.4) 75%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}
      
      {/* 背景圖 */}
      <div className="relative w-full h-full">
        {!imageError ? (
          <Image
            src={scene.background}
            alt={scene.name}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-surface text-gray-500">
            <div className="text-center">
              <div className="text-lg mb-2">{scene.name}</div>
              <div className="text-sm">{scene.description}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hotspots */}
      {scene.hotspots.map(hotspot => {
        const isHovered = hoveredHotspot === hotspot.id;
        const isClicked = clickedHotspot === hotspot.id;
        
        return (
          <div
            key={hotspot.id}
            style={getHotspotStyle(hotspot)}
            onClick={(e) => handleHotspotClick(hotspot, e)}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            className={`
              transition-all duration-200
              ${debug ? 'border-2 border-red-500 bg-red-500/20' : ''}
              ${isHovered && !debug ? 'bg-white/5' : ''}
              ${isClicked ? 'bg-white/10 scale-95' : ''}
            `}
            title={debug ? `${hotspot.id}: ${hotspot.description || ''}` : hotspot.hint}
          >
            {/* Debug 標籤 */}
            {debug && (
              <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-br">
                {hotspot.id}
              </div>
            )}

            {/* Hover 提示浮動標籤 */}
            {isHovered && !debug && hotspot.hint && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-dark-surface/95 backdrop-blur-md border border-dark-border rounded-lg text-xs text-gray-200 whitespace-nowrap shadow-lg z-50 pointer-events-none">
                {hotspot.hint}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-border"></div>
                </div>
              </div>
            )}

            {/* 點擊波紋效果 */}
            {isClicked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-white/20 animate-ping"></div>
              </div>
            )}

            {/* 可互動脈衝效果 */}
            {!debug && (
              <div className="absolute inset-0 border-2 border-white/20 rounded animate-pulse opacity-0 hover:opacity-100 transition-opacity"></div>
            )}
          </div>
        );
      })}
    </div>
  );
});

SceneView.displayName = 'SceneView';

export default SceneView;

