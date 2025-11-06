/**
 * InfiniteScroll - 无限滚动组件
 * 监听滚动位置，自动加载更多内容
 */

import { useEffect, useRef, ReactNode } from 'react';
import { Spinner } from '@nextui-org/react';

/**
 * 无限滚动组件属性
 */
export interface InfiniteScrollProps {
  /** 子内容 */
  children: ReactNode;
  /** 加载更多回调 */
  onLoadMore: () => Promise<void>;
  /** 是否有更多数据 */
  hasMore: boolean;
  /** 是否正在加载 */
  loading?: boolean;
  /** 触发距离（距离底部多少像素时触发） */
  threshold?: number;
  /** 加载中文字 */
  loadingText?: string;
  /** 没有更多数据文字 */
  noMoreText?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore,
  loading = false,
  threshold = 100,
  loadingText = '加载中...',
  noMoreText = '没有更多了'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  /**
   * 检查是否需要加载更多
   */
  const checkAndLoad = async () => {
    if (!hasMore || loading || loadingRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceToBottom <= threshold) {
      loadingRef.current = true;
      try {
        await onLoadMore();
      } catch (error) {
        console.error('Load more error:', error);
      } finally {
        loadingRef.current = false;
      }
    }
  };

  /**
   * 监听滚动事件
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkAndLoad();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  /**
   * 初始检查（如果内容不足一屏，自动加载）
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollHeight <= container.clientHeight && hasMore && !loading) {
      checkAndLoad();
    }
  }, [children, hasMore, loading]);

  return (
    <div ref={containerRef} className="h-full overflow-auto">
      {children}

      {/* 底部状态 */}
      <div className="flex items-center justify-center py-4">
        {loading && (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {loadingText}
            </span>
          </div>
        )}

        {!loading && !hasMore && (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {noMoreText}
          </span>
        )}
      </div>
    </div>
  );
};
