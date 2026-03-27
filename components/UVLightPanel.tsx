'use client';

import { X, Lightbulb, LightbulbOff } from 'lucide-react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

interface UVLightPanelProps {
  onClose: () => void;
  onReveal?: () => void;
}

/** 光斑半徑：略放大方便多行掃讀，仍須移動才看全 */
const SPOTLIGHT_RADIUS = 86;

/** 牆面顯影：最高紀錄與日期、氣溫等雜訊混排，需自行辨識 */
const UV_WALL_LINES = [
  '701 體能備註 · 殘影',
  '────────',
  '紀錄日 2024/03/27　外氣 18°C',
  '病房 22.5°C　走廊濕度 63%',
  '────────',
  '深蹲 最高 120kg　胸推 最高 80kg',
  '暖身 空槓 20kg　側平舉 12kg × 12',
  '────────',
  '心率 164　血氧 98%　體溫 36.4',
  '────────',
  '維護 2019-11-04　換氣 3 次/h',
  '備註：待覆核',
] as const;

export default function UVLightPanel({ onClose, onReveal }: UVLightPanelProps) {
  const [isOn, setIsOn] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);
  const [beam, setBeam] = useState({ x: 0, y: 0 });

  /** 光斑收到牆角暗處，避免一進場就照在字上；游標離開牆面時也回到角落而非正中央 */
  const obscureCornerBeam = useCallback(() => {
    const el = wallRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setBeam({ x: r.width * 0.12, y: r.height * 0.18 });
  }, []);

  useLayoutEffect(() => {
    if (isOn) {
      obscureCornerBeam();
    }
  }, [isOn, obscureCornerBeam]);

  const updateFromClient = useCallback((clientX: number, clientY: number) => {
    const el = wallRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientX - r.left));
    const y = Math.max(0, Math.min(r.height, clientY - r.top));
    setBeam({ x, y });
  }, []);

  /** 統一滑鼠 + 觸控 + 觸控筆：手機可拖移光斑；單次點擊也會在 pointerdown 立刻對準 */
  const onWallPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateFromClient(e.clientX, e.clientY);
  };

  const onWallPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    updateFromClient(e.clientX, e.clientY);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onWallPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onWallPointerLeave = () => {
    obscureCornerBeam();
  };

  const onWallPointerCancel = () => {
    obscureCornerBeam();
  };

  const toggleUV = () => {
    const newState = !isOn;
    setIsOn(newState);

    if (newState && !hasRevealed) {
      setTimeout(() => {
        if (onReveal) {
          onReveal();
        }
        setHasRevealed(true);
      }, 500);
    }
  };

  const clipCircle = `circle(${SPOTLIGHT_RADIUS}px at ${beam.x}px ${beam.y}px)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#0c0c14] via-dark-card to-dark-surface border border-violet-900/40 rounded-2xl p-6 md:p-8 max-w-[min(600px,100vmin)] w-full shadow-2xl shadow-violet-950/30">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg transition-colors ${
                isOn ? 'bg-violet-600/25 ring-1 ring-violet-500/40' : 'bg-gray-600/20'
              }`}
            >
              {isOn ? (
                <Lightbulb size={24} className="text-violet-300" />
              ) : (
                <LightbulbOff size={24} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-200">緊急呼叫盒</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 p-3 rounded-lg bg-dark-surface/60 border border-dark-border/80">
          <p className="text-sm text-gray-400 leading-relaxed">沒有電話，只有 UV 燈。</p>
        </div>

        {/* UV 模擬牆面 */}
        <div className="mb-5">
          <div
            className={`rounded-xl border-2 transition-all duration-500 overflow-hidden ${
              isOn ? 'border-violet-600/40 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]' : 'border-dark-border'
            }`}
          >
            {!isOn ? (
              <div className="bg-dark-bg py-14 px-6 text-center">
                <p className="text-gray-500 text-sm">……</p>
              </div>
            ) : (
              <div className="relative">
                <p className="text-center text-[10px] text-violet-400/60 tracking-wide py-2 px-2 bg-black/40 border-b border-violet-900/30 leading-snug">
                  看不清楚...
                </p>

                <div
                  ref={wallRef}
                  role="presentation"
                  onPointerDown={onWallPointerDown}
                  onPointerMove={onWallPointerMove}
                  onPointerUp={onWallPointerUp}
                  onPointerLeave={onWallPointerLeave}
                  onPointerCancel={onWallPointerCancel}
                  className="relative h-[min(400px,62vmin)] w-full cursor-crosshair touch-none bg-[#050508] select-none"
                  style={{
                    backgroundImage: `
                      radial-gradient(ellipse 120% 80% at 50% 0%, rgba(30,27,60,0.45) 0%, transparent 55%),
                      linear-gradient(180deg, #07070c 0%, #030305 100%)
                    `,
                  }}
                >
                  {/* 暗牆底紋（極淡） */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* 未照亮：與牆同色，僅極微反差（肉眼幾乎無字） */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center px-4 py-5 text-left opacity-[0.045] w-full"
                    style={{ color: '#050508' }}
                  >
                    <div className="w-full max-w-[min(320px,92%)] mx-auto font-mono text-[8px] md:text-[9px] font-light leading-relaxed space-y-0.5">
                      {UV_WALL_LINES.map((line, i) => (
                        <div key={`uv-dim-${i}`}>{line}</div>
                      ))}
                    </div>
                  </div>

                  {/* UV 紫光：僅限光斑圓內，不洗亮整面牆 */}
                  <div
                    className="uv-lamp-glow pointer-events-none absolute inset-0 mix-blend-screen"
                    style={{
                      clipPath: clipCircle,
                      background: `
                        radial-gradient(
                          circle ${SPOTLIGHT_RADIUS * 0.65}px at ${beam.x}px ${beam.y}px,
                          rgba(196, 181, 253, 0.42) 0%,
                          rgba(139, 92, 246, 0.14) 48%,
                          transparent 72%
                        ),
                        radial-gradient(
                          circle ${SPOTLIGHT_RADIUS * 1.08}px at ${beam.x}px ${beam.y}px,
                          rgba(34, 211, 238, 0.09) 0%,
                          rgba(167, 139, 250, 0.05) 42%,
                          transparent 65%
                        )
                      `,
                    }}
                  />

                  {/* 螢光層：僅光斑內 */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center px-4 py-5 text-left pointer-events-none w-full"
                    style={{ clipPath: clipCircle }}
                  >
                    <div className="w-full max-w-[min(320px,92%)] mx-auto font-mono text-[8px] md:text-[9px] text-emerald-200/95 leading-relaxed space-y-0.5 font-normal">
                      {UV_WALL_LINES.map((line, i) => (
                        <div
                          key={`uv-glow-${i}`}
                          style={{
                            textShadow:
                              '0 0 6px rgba(110,231,183,0.75), 0 0 14px rgba(52,211,153,0.32)',
                          }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 光斑邊緣細環 */}
                  <div
                    className="pointer-events-none absolute rounded-full border border-violet-200/25 opacity-50"
                    style={{
                      width: SPOTLIGHT_RADIUS * 2,
                      height: SPOTLIGHT_RADIUS * 2,
                      left: beam.x - SPOTLIGHT_RADIUS,
                      top: beam.y - SPOTLIGHT_RADIUS,
                      boxShadow: 'inset 0 0 16px rgba(167,139,250,0.2)',
                    }}
                  />

                  {/* 四邊暗角 */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      boxShadow: 'inset 0 0 70px rgba(0,0,0,0.75)',
                    }}
                  />
                </div>

                {hasRevealed && (
                  <div className="h-2 bg-black/40 border-t border-violet-900/20" aria-hidden />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={toggleUV}
            className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
              isOn
                ? 'bg-violet-800 hover:bg-violet-700 text-white border border-violet-600/50'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-700 hover:from-violet-500 hover:to-fuchsia-600 text-white'
            }`}
          >
            {isOn ? (
              <span className="flex items-center justify-center gap-2">
                <LightbulbOff size={18} />
                關閉 UV 燈
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lightbulb size={18} />
                開啟 UV 燈
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
