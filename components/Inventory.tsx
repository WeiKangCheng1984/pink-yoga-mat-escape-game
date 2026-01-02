'use client';

import { items } from '@/data/gameData';
import { Package, Sparkles } from 'lucide-react';

interface InventoryProps {
  itemIds: string[];
  onItemClick?: (itemId: string) => void;
}

export default function Inventory({ itemIds, onItemClick }: InventoryProps) {

  if (itemIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-card border-2 border-dashed border-dark-border flex items-center justify-center mb-4">
          <Package size={24} className="text-gray-600" />
        </div>
        <p className="text-sm text-gray-500">背包是空的</p>
        <p className="text-xs text-gray-600 mt-1">探索場景收集道具</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 標題 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-dark-card rounded-lg">
          <Package size={20} className="text-gray-300" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-200">背包</div>
          <div className="text-xs text-gray-500">{itemIds.length} 個道具</div>
        </div>
      </div>

      {/* 道具網格 */}
      <div className="grid grid-cols-2 gap-3">
        {itemIds.map(itemId => {
          const item = items[itemId];
          if (!item) return null;
          
          return (
            <button
              key={itemId}
              onClick={() => onItemClick?.(itemId)}
              className="group relative p-4 bg-gradient-to-br from-dark-card to-dark-surface border-2 rounded-xl transition-all duration-200 border-dark-border hover:border-gray-600"
            >
              {/* 道具圖示區域 */}
              <div className="flex items-center justify-center w-12 h-12 mb-3 bg-dark-bg/50 rounded-lg border border-dark-border group-hover:border-gray-500 transition-colors">
                <Sparkles size={20} className="transition-colors text-gray-500 group-hover:text-yellow-400" />
              </div>

              {/* 道具名稱 */}
              <div className="text-left">
                <div className="text-sm font-medium transition-colors line-clamp-2 text-gray-300 group-hover:text-white">
                  {item.name}
                </div>
                {item.usable && (
                  <div className="text-xs text-blue-400 mt-1">可使用</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

