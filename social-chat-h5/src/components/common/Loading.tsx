/**
 * Loading - 加载中组件
 * 用于页面或区块的加载状态显示
 */

import { Spinner } from '@heroui/react';

/**
 * 加载组件属性
 */
export interface LoadingProps {
  /** 加载文字 */
  text?: string;
  /** 是否全屏显示 */
  fullscreen?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 自定义类名 */
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  text,
  fullscreen = false,
  size = 'md',
  className = ''
}) => {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={size} />
          {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Spinner size={size} />
        {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
      </div>
    </div>
  );
};
