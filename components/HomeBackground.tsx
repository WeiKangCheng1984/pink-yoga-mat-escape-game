'use client';

/**
 * 首頁背景：方案 1+2+4
 * 單一 SVG 三層疊加 — 粉紅光暈 → 醫療細網格 → 點陣紋
 */
export default function HomeBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 方案2：粉紅 → 暗紅 漸層光暈 */}
          <radialGradient
            id="home-glow"
            cx="50%"
            cy="35%"
            r="75%"
            fx="50%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.14" />
            <stop offset="45%" stopColor="#b91c1c" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>

          {/* 方案1：醫療／機構細網格 */}
          <pattern
            id="home-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="28" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="28" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>

          {/* 方案4：點陣／輕微雜訊紋 */}
          <pattern
            id="home-dots"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="0.8" fill="rgba(255,255,255,0.045)" />
            <circle cx="7.5" cy="7.5" r="0.8" fill="rgba(255,255,255,0.04)" />
          </pattern>
        </defs>

        {/* 底層：光暈 */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#home-glow)"
        />
        {/* 中層：網格 */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#home-grid)"
        />
        {/* 上層：點陣 */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#home-dots)"
        />
      </svg>
    </div>
  );
}
