/**
 * ConversationList - 会话列表
 * 显示所有会话，支持上拉加载、下拉刷新、左滑操作
 * 性能优化: 使用 VirtualList
 */

import React, { useMemo } from 'react';
import { Spinner } from '@heroui/react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { ConversationItem } from './ConversationItem';
import { VirtualList } from '@/components/VirtualList';
import { Conversation } from '@/types/models';

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
   * 渲染加载状态
   */
  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // 会话列表项渲染函数
  const renderConversationItem = useMemo(
    () => (conversation: Conversation) => (
      <ConversationItem
        conversation={conversation}
        onClick={() => onClick?.(conversation)}
      />
    ),
    [onClick]
  );

  return (
    <VirtualList
      data={conversations}
      itemHeight={80}
      containerHeight={window.innerHeight - 100}
      renderItem={renderConversationItem}
      getItemKey={(conversation) => conversation.id}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      emptyContent={
        <div className="flex flex-col items-center justify-center text-gray-400">
          <ChatBubbleLeftIcon className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-sm">暂无会话</p>
          <p className="text-xs mt-1">快去找好友聊天吧~</p>
        </div>
      }
    />
  );
};
