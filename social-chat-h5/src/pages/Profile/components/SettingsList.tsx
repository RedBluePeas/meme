/**
 * SettingsList - 设置列表
 * 显示各种设置入口
 */

import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export interface SettingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string | number;
  onClick?: () => void;
}

interface SettingsListProps {
  items: SettingItem[];
  title?: string;
}

export const SettingsList: React.FC<SettingsListProps> = ({ items, title }) => {
  return (
    <div className="mb-2">
      {title && (
        <div className="px-4 py-2 bg-gray-50">
          <h3 className="text-sm text-gray-600">{title}</h3>
        </div>
      )}

      <div className="bg-white divide-y divide-gray-100">
        {items.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            onClick={item.onClick}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* 图标 */}
              <div className="flex-shrink-0 text-gray-600">{item.icon}</div>

              {/* 标题和副标题 */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-gray-900 font-medium">{item.title}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* 右侧内容 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.badge && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRightIcon className="w-[18px] h-[18px] text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
