/**
 * ConversationItem - 会话列表项
 * 显示会话头像、名称、最后消息、未读数等信息
 */

import React from 'react';
import { Avatar, Badge } from '@nextui-org/react';
import { Pin, BellOff, Image as ImageIcon, Video, File } from 'lucide-react';
import { Conversation } from '@/types/models';
import { formatTime } from '@/utils/format';

interface ConversationItemProps {
  conversation: Conversation;
  onClick?: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onClick,
}) => {
  /**
   * 渲染最后消息内容
   */
  const renderLastMessage = () => {
    const { lastMessage, lastMessageType } = conversation;

    switch (lastMessageType) {
      case 'image':
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <ImageIcon size={14} />
            <span>[图片]</span>
          </div>
        );
      case 'video':
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <Video size={14} />
            <span>[视频]</span>
          </div>
        );
      case 'audio':
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <span>[语音]</span>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <File size={14} />
            <span>[文件]</span>
          </div>
        );
      default:
        return <span className="text-gray-500">{lastMessage}</span>;
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* 头像 */}
      <div className="relative flex-shrink-0">
        <Badge
          content={conversation.unreadCount}
          color="danger"
          isInvisible={conversation.unreadCount === 0}
          placement="top-right"
        >
          <Avatar
            src={conversation.avatar}
            alt={conversation.name}
            size="lg"
            className="flex-shrink-0"
          />
        </Badge>
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        {/* 名称和时间 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            {/* 置顶图标 */}
            {conversation.isPinned && (
              <Pin size={14} className="text-primary flex-shrink-0" />
            )}

            {/* 免打扰图标 */}
            {conversation.isMuted && (
              <BellOff size={14} className="text-gray-400 flex-shrink-0" />
            )}

            {/* 会话名称 */}
            <h3 className="font-medium text-gray-900 truncate">
              {conversation.name}
            </h3>

            {/* 群聊成员数 */}
            {conversation.type === 'group' && conversation.memberCount && (
              <span className="text-xs text-gray-400 flex-shrink-0">
                ({conversation.memberCount})
              </span>
            )}
          </div>

          {/* 时间 */}
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>

        {/* 最后一条消息 */}
        <div className="text-sm truncate">{renderLastMessage()}</div>
      </div>
    </div>
  );
};
