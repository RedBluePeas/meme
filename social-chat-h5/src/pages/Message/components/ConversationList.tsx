/**
 * ConversationList - 会话列表
 * 显示所有会话，支持上拉加载、下拉刷新、左滑操作
 */

import React from 'react';
import { Spinner } from '@nextui-org/react';
import { ConversationItem } from './ConversationItem';
import { Conversation } from '@/types/models';
import { InfiniteScroll } from '@/components/common';

interface ConversationListProps {
  conversations: Conversation[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onClick?: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading = false,
  hasMore = false,
  onLoadMore,
  onClick,
}) => {
  /**
   * 渲染空状态
   */
  if (!loading && conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-400 text-sm">暂无会话</p>
        <p className="text-gray-400 text-xs mt-1">快去找好友聊天吧~</p>
      </div>
    );
  }

  /**
   * 渲染加载状态
   */
  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {/* 会话列表 */}
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onClick={() => onClick?.(conversation)}
        />
      ))}

      {/* 无限滚动 */}
      {hasMore && onLoadMore && (
        <InfiniteScroll onLoad={onLoadMore} loading={loading}>
          <div className="flex items-center justify-center py-4">
            <Spinner size="sm" />
          </div>
        </InfiniteScroll>
      )}

      {/* 没有更多 */}
      {!hasMore && conversations.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          没有更多会话了
        </div>
      )}
    </div>
  );
};
