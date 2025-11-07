/**
 * TopicList - 话题列表组件
 */

import React from 'react';
import { Spinner } from '@heroui/react';
import type { Topic } from '@/types';
import { TopicCard } from './TopicCard';
import { Empty } from '@/components/common';
import { InfiniteScroll } from '@/components/common';

interface TopicListProps {
  topics: Topic[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onFollow?: (topicId: string, isFollowed: boolean) => void;
  onClick?: (topicId: string) => void;
}

export const TopicList: React.FC<TopicListProps> = ({
  topics,
  loading = false,
  hasMore = false,
  onLoadMore,
  onFollow,
  onClick,
}) => {
  /**
   * 首次加载
   */
  if (loading && topics.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  /**
   * 空状态
   */
  if (!loading && topics.length === 0) {
    return (
      <Empty
        description="暂无话题"
        actionText="刷新试试"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="pb-4">
      {/* 话题列表 */}
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onFollow={onFollow}
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
