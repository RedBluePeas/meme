/**
 * FeedList - 内容流列表组件
 */

import React from 'react';
import { Spinner } from '@heroui/react';
import type { Feed } from '@/types';
import { FeedItem } from './FeedItem';
import { Empty } from '@/components/common';
import { InfiniteScroll } from '@/components/common';

interface FeedListProps {
  feeds: Feed[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onLike?: (feedId: string, isLiked: boolean) => void;
  onComment?: (feedId: string) => void;
  onShare?: (feedId: string) => void;
  onClick?: (feedId: string) => void;
}

export const FeedList: React.FC<FeedListProps> = ({
  feeds,
  loading = false,
  hasMore = false,
  onLoadMore,
  onLike,
  onComment,
  onShare,
  onClick,
}) => {
  /**
   * 首次加载
   */
  if (loading && feeds.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  /**
   * 空状态
   */
  if (!loading && feeds.length === 0) {
    return (
      <Empty
        description="暂无内容"
        action={{
          text: '刷新试试',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return (
    <div className="pb-4">
      {/* 内容列表 */}
      {feeds.map((feed) => (
        <FeedItem
          key={feed.id}
          feed={feed}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onClick={onClick}
        />
      ))}

      {/* 无限滚动 */}
      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};
