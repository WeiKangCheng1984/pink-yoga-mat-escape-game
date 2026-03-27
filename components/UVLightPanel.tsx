'use client';

import { X, Lightbulb, LightbulbOff } from 'lucide-react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

interface UVLightPanelProps {
  onClose: () => void;
  onReveal?: () => void;
}

const SPOTLIGHT_RADIUS = 132;

export default function UVLightPanel({ onClose, onReveal }: UVLightPanelProps) {
  const [isOn, setIsOn] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);
  const [beam, setBeam] = useState({ x: 0, y: 0 });

  const centerBeam = useCallback(() => {
    const el = wallRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setBeam({ x: r.width / 2, y: r.height / 2 });
  }, []);

  useLayoutEffect(() => {
    if (isOn) {
      centerBeam();
    }
  }, [isOn, centerBeam]);

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
    centerBeam();
  };

  const onWallPointerCancel = () => {
    centerBeam();
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
          <p className="text-sm text-gray-400 leading-relaxed">
            沒有電話，只有 UV 燈。開燈後在暗牆上<strong className="text-violet-400/90 font-normal">移動光斑</strong>
            ，螢光字才會浮出。
          </p>
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
                <p className="text-gray-500 text-sm">先開啟 UV，牆面會變成可掃描的暗場。</p>
              </div>
            ) : (
              <div className="relative">
                <p className="text-center text-[11px] text-violet-400/70 tracking-wider py-2 bg-black/40 border-b border-violet-900/30">
                  移動游標／手指掃描牆面
                </p>

                <div
                  ref={wallRef}
                  role="presentation"
                  onPointerDown={onWallPointerDown}
                  onPointerMove={onWallPointerMove}
                  onPointerUp={onWallPointerUp}
                  onPointerLeave={onWallPointerLeave}
                  onPointerCancel={onWallPointerCancel}
                  className="relative h-[min(280px,55vmin)] w-full cursor-crosshair touch-none bg-[#050508] select-none"
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

                  {/* 未照亮：幾乎看不見的字 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gray-800">wall trace</p>
                    <div className="space-y-3 font-mono text-xl md:text-2xl text-[#0d0d12]">
                      <div>深蹲: 120kg</div>
                      <div>臥推: 80kg</div>
                    </div>
                  </div>

                  {/* 螢光層：僅在光斑內完整顯示（類似 UV 反應漆） */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center pointer-events-none"
                    style={{ clipPath: clipCircle }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.35em] text-emerald-400/90"
                      style={{
                        textShadow:
                          '0 0 10px rgba(52,211,153,0.9), 0 0 22px rgba(34,197,94,0.5)',
                      }}
                    >
                      wall trace
                    </p>
                    <div className="space-y-3 font-mono text-xl md:text-2xl font-bold text-emerald-300">
                      <div
                        style={{
                          textShadow:
                            '0 0 12px rgba(110,231,183,0.95), 0 0 28px rgba(52,211,153,0.45), 0 0 2px rgba(255,255,255,0.3)',
                        }}
                      >
                        深蹲: 120kg
                      </div>
                      <div
                        style={{
                          textShadow:
                            '0 0 12px rgba(110,231,183,0.95), 0 0 28px rgba(52,211,153,0.45), 0 0 2px rgba(255,255,255,0.3)',
                        }}
                      >
                        臥推: 80kg
                      </div>
                    </div>
                  </div>

                  {/* UV 紫光斑 + 青邊（混合光） */}
                  <div
                    className="uv-lamp-glow pointer-events-none absolute inset-0 mix-blend-screen"
                    style={{
                      background: `
                        radial-gradient(
                          circle ${SPOTLIGHT_RADIUS * 0.55}px at ${beam.x}px ${beam.y}px,
                          rgba(196, 181, 253, 0.5) 0%,
                          rgba(139, 92, 246, 0.22) 45%,
                          transparent 72%
                        ),
                        radial-gradient(
                          circle ${SPOTLIGHT_RADIUS * 1.05}px at ${beam.x}px ${beam.y}px,
                          rgba(34, 211, 238, 0.12) 0%,
                          rgba(167, 139, 250, 0.08) 40%,
                          transparent 68%
                        )
                      `,
                    }}
                  />

                  {/* 光斑邊緣細環 */}
                  <div
                    className="pointer-events-none absolute rounded-full border border-white/20 opacity-40"
                    style={{
                      width: SPOTLIGHT_RADIUS * 2,
                      height: SPOTLIGHT_RADIUS * 2,
                      left: beam.x - SPOTLIGHT_RADIUS,
                      top: beam.y - SPOTLIGHT_RADIUS,
                      boxShadow: 'inset 0 0 20px rgba(167,139,250,0.25)',
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
                  <div className="px-4 py-3 bg-black/50 border-t border-violet-900/25 text-center space-y-2">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      你突然明白：有人不是在治療你，是在訓練你。
                    </p>
                    <p className="text-sm text-violet-300/90 font-medium">
                      醫院把你當健身房，健身房把你當屠宰場。
                    </p>
                  </div>
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
