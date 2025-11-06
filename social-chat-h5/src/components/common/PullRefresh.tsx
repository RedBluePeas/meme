/**
 * PullRefresh - 下拉刷新组件
 * 支持触摸手势下拉刷新功能
 */

import { useState, useRef, ReactNode } from 'react';
import { Spinner } from '@nextui-org/react';

/**
 * 下拉刷新组件属性
 */
export interface PullRefreshProps {
  /** 子内容 */
  children: ReactNode;
  /** 刷新回调 */
  onRefresh: () => Promise<void>;
  /** 下拉距离阈值 */
  threshold?: number;
  /** 是否禁用 */
  disabled?: boolean;
}

enum RefreshStatus {
  NORMAL = 'normal',
  PULLING = 'pulling',
  READY = 'ready',
  LOADING = 'loading'
}

const STATUS_TEXT = {
  [RefreshStatus.NORMAL]: '',
  [RefreshStatus.PULLING]: '下拉刷新',
  [RefreshStatus.READY]: '释放刷新',
  [RefreshStatus.LOADING]: '加载中...'
};

export const PullRefresh: React.FC<PullRefreshProps> = ({
  children,
  onRefresh,
  threshold = 60,
  disabled = false
}) => {
  const [status, setStatus] = useState<RefreshStatus>(RefreshStatus.NORMAL);
  const [distance, setDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * 触摸开始
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || status === RefreshStatus.LOADING) return;

    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  /**
   * 触摸移动
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || status === RefreshStatus.LOADING || startY.current === 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      // 阻尼效果：距离越大，阻力越大
      const damping = Math.min(diff / 2, threshold * 1.5);
      setDistance(damping);

      if (damping >= threshold) {
        setStatus(RefreshStatus.READY);
      } else {
        setStatus(RefreshStatus.PULLING);
      }
    }
  };

  /**
   * 触摸结束
   */
  const handleTouchEnd = async () => {
    if (disabled || status === RefreshStatus.LOADING) return;

    if (status === RefreshStatus.READY) {
      setStatus(RefreshStatus.LOADING);
      setDistance(threshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setStatus(RefreshStatus.NORMAL);
        setDistance(0);
        startY.current = 0;
      }
    } else {
      setStatus(RefreshStatus.NORMAL);
      setDistance(0);
      startY.current = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 下拉指示器 */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all"
        style={{
          height: distance,
          transform: `translateY(-${threshold - distance}px)`
        }}
      >
        {status === RefreshStatus.LOADING ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-600">{STATUS_TEXT[status]}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">{STATUS_TEXT[status]}</span>
        )}
      </div>

      {/* 内容区域 */}
      <div
        className="transition-transform"
        style={{
          transform: `translateY(${distance}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};
