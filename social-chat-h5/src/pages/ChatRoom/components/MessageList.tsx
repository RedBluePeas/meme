/**
 * MessageList - 消息列表
 * 支持上拉加载历史消息
 */

import React, { useRef, useEffect } from 'react';
import { Spinner } from '@nextui-org/react';
import { MessageBubble } from './MessageBubble';
import { Message } from '@/types/models';
import { useAppSelector } from '@/store';

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading = false,
  hasMore = false,
  onLoadMore,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.user);

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * 监听新消息，自动滚动到底部
   */
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  /**
   * 处理滚动事件（加载更多历史消息）
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;

    // 滚动到顶部时加载更多
    if (scrollTop === 0 && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  };

  /**
   * 渲染空状态
   */
  if (!loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm">暂无消息</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-2"
      onScroll={handleScroll}
    >
      {/* 加载更多 */}
      {hasMore && (
        <div className="flex items-center justify-center py-2">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <span className="text-xs text-gray-400">上拉加载更多</span>
          )}
        </div>
      )}

      {/* 消息列表 */}
      {messages.map((message, index) => {
        const isMine = message.sender.id === user?.id;
        const prevMessage = messages[index - 1];
        const showAvatar =
          !prevMessage || prevMessage.sender.id !== message.sender.id;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={isMine}
            showAvatar={showAvatar}
          />
        );
      })}

      {/* 滚动锚点 */}
      <div ref={messagesEndRef} />
    </div>
  );
};
