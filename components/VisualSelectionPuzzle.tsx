'use client';

import { Puzzle } from '@/types/game';
import { useMemo, useState } from 'react';
import { X, Check, HelpCircle, Anchor, AlertCircle } from 'lucide-react';
import { VISUAL_SELECTION_USE_RAILING_LAYOUT } from '@/components/visualSelectionPuzzleConfig';

interface VisualSelectionPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

/** 欄杆上各點座標（viewBox 400×160），淺弧線讓三點可連成可視三角形 */
function getRailPositions(n: number): { x: number; y: number }[] {
  const padX = 24;
  const vbW = 400;
  const w = vbW - padX * 2;
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const x = padX + t * w;
    const y = 52 + 16 * Math.sin(t * Math.PI);
    return { x, y };
  });
}

function getTriangleVertices(
  selectedIds: string[],
  options: { id: string }[],
  positions: { x: number; y: number }[]
): { x: number; y: number }[] | null {
  if (selectedIds.length !== 3) return null;
  const indices = selectedIds
    .map((id) => options.findIndex((o) => o.id === id))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  if (indices.length !== 3) return null;
  return indices.map((i) => positions[i]);
}

type OptionItem = { id: string; label: string; description?: string };

/** 建議①：欄杆示意圖 + 點位（第四關七選三） */
function RailingFixedPointDiagram({
  options,
  selected,
  onSelect,
}: {
  options: OptionItem[];
  selected: string[];
  onSelect: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const positions = useMemo(() => getRailPositions(options.length), [options.length]);

  const railPathD = useMemo(() => {
    if (positions.length === 0) return '';
    return positions.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [positions]);

  const trianglePts = useMemo(
    () => getTriangleVertices(selected, options, positions),
    [selected, options, positions]
  );

  const hovered = hoveredId ? options.find((o) => o.id === hoveredId) : null;

  const activatePoint = (id: string) => {
    setHoveredId(id);
    onSelect(id);
  };

  return (
    <div className="relative w-full select-none">
      <p className="text-sm text-gray-500 mb-2 leading-snug">
        點選欄杆上的扣環；選滿三個會以半透明三角連線示意支撐。
      </p>
      <svg
        viewBox="0 0 400 160"
        className="w-full h-auto max-h-[min(220px,32vh)] touch-manipulation"
        role="img"
        aria-label="欄杆固定點示意圖，共七處可點選"
      >
        {/* 簡化欄杆線條（避免粗弧線像垂繩遮字、搶版面） */}
        <path
          d={railPathD}
          fill="none"
          stroke="rgb(51 65 85)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-85"
        />
        {trianglePts && (
          <polygon
            points={trianglePts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(168, 85, 247, 0.14)"
            stroke="rgba(168, 85, 247, 0.55)"
            strokeWidth={1.5}
          />
        )}
        {options.map((opt, i) => {
          const p = positions[i];
          if (!p) return null;
          const sel = selected.includes(opt.id);
          const order = sel ? selected.indexOf(opt.id) + 1 : 0;
          return (
            <g key={opt.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={sel ? 11 : 9}
                fill={sel ? 'rgb(147 51 234)' : 'rgb(30 41 59)'}
                stroke={sel ? 'rgb(216 180 254)' : 'rgb(71 85 105)'}
                strokeWidth={2}
                className="pointer-events-none"
              />
              {order > 0 && (
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize={13}
                  fontWeight={700}
                  className="pointer-events-none"
                >
                  {order}
                </text>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={26}
                fill="transparent"
                className="cursor-pointer hover:fill-white/5"
                onPointerDown={(e) => {
                  /* 手機無 hover：必須在按下時就鎖定說明，否則下方文案永遠不更新 */
                  e.preventDefault();
                  activatePoint(opt.id);
                }}
                onMouseEnter={() => setHoveredId(opt.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            </g>
          );
        })}
      </svg>
      <div className="grid grid-cols-7 gap-0.5 mt-2 px-0.5 text-[11px] sm:text-xs text-gray-500 tabular-nums text-center">
        {options.map((opt, i) => (
          <span key={opt.id} className="min-w-0" title={opt.label}>
            {i + 1}
          </span>
        ))}
      </div>
      <div className="mt-3 max-h-[min(42vh,18rem)] min-h-[6rem] overflow-y-auto overscroll-contain p-3 sm:p-3.5 rounded-lg bg-dark-surface/80 border border-dark-border text-sm text-gray-300">
        {hovered ? (
          <>
            <div className="text-purple-300 font-medium mb-1.5">{hovered.label}</div>
            <div className="whitespace-pre-line leading-relaxed text-gray-300 break-words">
              {hovered.description || '—'}
            </div>
          </>
        ) : (
          <span className="text-gray-500 text-sm leading-relaxed">
            點選上方圓點可查看此處的名牌與代號（手機請直接點，無需游標懸停）。
          </span>
        )}
      </div>
    </div>
  );
}

export default function VisualSelectionPuzzle({
  puzzle,
  onSolve,
  onClose,
  error: externalError,
  onErrorClear,
}: VisualSelectionPuzzleProps) {
  const isMultiSelect = Array.isArray(puzzle.solution) && puzzle.solution.length > 1;
  const requiredCount = isMultiSelect ? puzzle.solution.length : 1;

  const [selected, setSelected] = useState<string[]>([]);
  const [internalError, setInternalError] = useState('');

  const error = externalError || internalError;

  const handleSelect = (optionId: string) => {
    if (isMultiSelect) {
      if (selected.includes(optionId)) {
        setSelected(selected.filter((id) => id !== optionId));
      } else {
        if (selected.length < requiredCount) {
          setSelected([...selected, optionId]);
        } else {
          setInternalError(`你最多只能選擇 ${requiredCount} 個固定點。`);
          return;
        }
      }
    } else {
      setSelected([optionId]);
    }
    setInternalError('');
    if (onErrorClear) onErrorClear();
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setInternalError(isMultiSelect ? `請選擇 ${requiredCount} 個固定點。` : '請選擇一個固定點。');
      return;
    }

    if (isMultiSelect && selected.length !== requiredCount) {
      setInternalError(`你需要選擇恰好 ${requiredCount} 個固定點，形成三角支撐系統。`);
      return;
    }

    let isCorrect = false;
    if (isMultiSelect) {
      const solutionArray = puzzle.solution as string[];
      isCorrect =
        solutionArray.length === selected.length &&
        solutionArray.every((id) => selected.includes(id)) &&
        selected.every((id) => solutionArray.includes(id));
    } else {
      isCorrect =
        puzzle.solution === selected[0] ||
        (Array.isArray(puzzle.solution) && puzzle.solution.includes(selected[0]));
    }

    if (!isCorrect) {
      if (isMultiSelect) {
        setInternalError('這個組合無法形成穩定的支撐系統。');
      } else {
        setInternalError('這個固定點無法提供足夠的支撐。');
      }
      return;
    }

    setInternalError('');
    if (onErrorClear) onErrorClear();

    onSolve(isMultiSelect ? selected : selected[0]);
  };

  const options: OptionItem[] =
    puzzle.options || [
      { id: 'fixed_point_1', label: '固定點 1', description: '名牌上沒有標記' },
      { id: 'fixed_point_2', label: '固定點 2', description: '名牌上標記了「加固扣」' },
      { id: 'fixed_point_3', label: '固定點 3', description: '名牌上沒有標記' },
    ];

  /** 第四關七選三：用欄杆示意圖；其餘或關閉設定檔時用原本網格 */
  const useRailingUi =
    VISUAL_SELECTION_USE_RAILING_LAYOUT && isMultiSelect && options.length === 7 && requiredCount === 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl w-full shadow-2xl max-h-[90vh] flex flex-col ${
          useRailingUi ? 'max-w-[min(680px,100vmin)]' : 'max-w-[min(600px,100vmin)]'
        }`}
      >
        <div className="flex items-center justify-between p-6 md:p-8 pb-4 border-b border-dark-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Anchor size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200">
                {isMultiSelect ? '選擇固定點（三角支撐系統）' : '選擇固定點'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {isMultiSelect
                  ? `選擇 ${requiredCount} 個固定點形成穩定的三角支撐系統`
                  : '選擇有加固扣的固定點進行垂降'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4">
          {puzzle.hint && (
            <div className="mb-6 p-4 bg-yellow-950/20 border border-yellow-700/50 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-yellow-400 mb-1 font-medium">提示</div>
                  <div className="text-sm text-yellow-300 leading-relaxed">{puzzle.hint}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            {isMultiSelect && (
              <div className="mb-4 p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
                <div className="text-sm text-blue-300 font-medium">
                  已選擇：{selected.length} / {requiredCount}
                </div>
              </div>
            )}

            {useRailingUi ? (
              <RailingFixedPointDiagram options={options} selected={selected} onSelect={handleSelect} />
            ) : (
              /* LEGACY：原本網格卡片；將 visualSelectionPuzzleConfig 的 USE_RAILING_LAYOUT 設為 false 即可恢復七選三此版面 */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {options.map((option) => {
                  const isSelected = isMultiSelect
                    ? selected.includes(option.id)
                    : selected[0] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option.id)}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg'
                          : 'bg-dark-surface/50 border-dark-border text-gray-300 hover:bg-dark-surface hover:border-purple-500/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                isSelected ? 'bg-purple-500' : 'bg-gray-500'
                              }`}
                            />
                            <div className="font-medium text-sm">{option.label}</div>
                          </div>
                          {option.description && (
                            <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/30 border-2 border-red-700/70 rounded-lg text-sm text-red-300 flex items-center gap-2 animate-pulse">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 md:p-8 pt-4 border-t border-dark-border flex-shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected.length === 0 || (isMultiSelect && selected.length !== requiredCount)}
            className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg ${
              selected.length > 0 && (!isMultiSelect || selected.length === requiredCount)
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-xl'
                : 'bg-dark-surface border-2 border-dark-border text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check size={18} />
            {isMultiSelect ? `確認選擇 (${selected.length}/${requiredCount})` : '確認選擇'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
