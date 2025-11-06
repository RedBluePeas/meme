/**
 * VirtualList - 虚拟滚动列表组件
 * 用于高性能渲染大量列表项
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Spinner } from '@nextui-org/react';

interface VirtualListProps<T> {
  /** 列表数据 */
  data: T[];
  /** 列表项高度 */
  itemHeight: number;
  /** 容器高度 */
  containerHeight: number;
  /** 缓冲区大小（渲染额外的项数） */
  bufferSize?: number;
  /** 渲染函数 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 列表项唯一键 */
  getItemKey: (item: T, index: number) => string | number;
  /** 是否正在加载更多 */
  loading?: boolean;
  /** 是否还有更多数据 */
  hasMore?: boolean;
  /** 加载更多回调 */
  onLoadMore?: () => void;
  /** 触发加载更多的阈值（距离底部的距离） */
  loadMoreThreshold?: number;
  /** 列表为空时的占位内容 */
  emptyContent?: React.ReactNode;
  /** 容器类名 */
  className?: string;
}

export function VirtualList<T>({
  data,
  itemHeight,
  containerHeight,
  bufferSize = 3,
  renderItem,
  getItemKey,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadMoreThreshold = 200,
  emptyContent,
  className = '',
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // 计算可见区域
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(data.length, start + visibleCount + bufferSize * 2);
    const offset = start * itemHeight;

    return {
      startIndex: start,
      endIndex: end,
      offsetY: offset,
    };
  }, [scrollTop, itemHeight, containerHeight, bufferSize, data.length]);

  // 可见的数据项
  const visibleData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // 总高度
  const totalHeight = data.length * itemHeight;

  // 滚动处理
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);

      // 触发加载更多
      if (
        onLoadMore &&
        hasMore &&
        !loading &&
        target.scrollHeight - target.scrollTop - target.clientHeight < loadMoreThreshold
      ) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, loading, loadMoreThreshold]
  );

  // 空状态
  if (data.length === 0 && !loading) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height: containerHeight }}
      >
        {emptyContent || <div className="text-gray-400 text-sm">暂无数据</div>}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleData.map((item, index) => {
            const actualIndex = startIndex + index;
            return (
              <div key={getItemKey(item, actualIndex)} style={{ height: itemHeight }}>
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {/* 加载更多指示器 */}
      {loading && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  );
}

export default VirtualList;
