/**
 * MessageBubble - 消息气泡
 * 根据消息类型展示不同样式
 */

import React from 'react';
import { Avatar, Image } from '@heroui/react';
import { CheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Message } from '@/types/models';
import { formatTime } from '@/utils/format';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMine,
  showAvatar = true,
}) => {
  /**
   * 渲染消息状态图标
   */
  const renderStatusIcon = () => {
    if (!isMine) return null;

    switch (message.status) {
      case 'sending':
        return <ClockIcon className="w-3.5 h-3.5 text-gray-400" />;
      case 'sent':
        return <CheckIcon className="w-3.5 h-3.5 text-gray-400" />;
      case 'delivered':
        return <CheckIcon className="w-3.5 h-3.5 text-gray-400" />;
      case 'read':
        return <CheckIcon className="w-3.5 h-3.5 text-blue-500" />;
      case 'failed':
        return <XCircleIcon className="w-3.5 h-3.5 text-red-500" />;
      default:
        return null;
    }
  };

  /**
   * 渲染文本消息
   */
  const renderTextMessage = () => {
    return (
      <div
        className={`max-w-[70%] px-3 py-2 rounded-2xl break-words ${
          isMine
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        {/* 回复消息 */}
        {message.replyTo && (
          <div className="mb-2 pb-2 border-b border-white/20 text-xs opacity-80">
            <div className="font-medium">{message.replyTo.sender.nickname}</div>
            <div className="truncate">{message.replyTo.content}</div>
          </div>
        )}

        {/* 消息内容 */}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    );
  };

  /**
   * 渲染图片消息
   */
  const renderImageMessage = () => {
    return (
      <div className="max-w-[70%]">
        {message.replyTo && (
          <div className="mb-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600">
            <div className="font-medium">{message.replyTo.sender.nickname}</div>
            <div className="truncate">{message.replyTo.content}</div>
          </div>
        )}
        <Image
          src={message.imageUrl}
          alt="image"
          className="rounded-lg max-w-full"
        />
      </div>
    );
  };

  /**
   * 渲染视频消息
   */
  const renderVideoMessage = () => {
    return (
      <div className="max-w-[70%]">
        {message.replyTo && (
          <div className="mb-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600">
            <div className="font-medium">{message.replyTo.sender.nickname}</div>
            <div className="truncate">{message.replyTo.content}</div>
          </div>
        )}
        <video
          src={message.videoUrl}
          controls
          className="rounded-lg max-w-full"
        />
      </div>
    );
  };

  /**
   * 渲染音频消息
   */
  const renderAudioMessage = () => {
    return (
      <div
        className={`max-w-[70%] px-3 py-2 rounded-2xl ${
          isMine
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        {message.replyTo && (
          <div className="mb-2 pb-2 border-b border-white/20 text-xs opacity-80">
            <div className="font-medium">{message.replyTo.sender.nickname}</div>
            <div className="truncate">{message.replyTo.content}</div>
          </div>
        )}
        <audio src={message.audioUrl} controls className="w-full" />
        {message.audioDuration && (
          <div className="text-xs mt-1 opacity-80">
            {Math.floor(message.audioDuration / 60)}:
            {(message.audioDuration % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>
    );
  };

  /**
   * 渲染文件消息
   */
  const renderFileMessage = () => {
    return (
      <a
        href={message.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block max-w-[70%] px-3 py-2 rounded-2xl ${
          isMine
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        {message.replyTo && (
          <div className="mb-2 pb-2 border-b border-white/20 text-xs opacity-80">
            <div className="font-medium">{message.replyTo.sender.nickname}</div>
            <div className="truncate">{message.replyTo.content}</div>
          </div>
        )}
        <div className="font-medium">{message.fileName}</div>
        {message.fileSize && (
          <div className="text-xs mt-1 opacity-80">
            {(message.fileSize / 1024).toFixed(2)} KB
          </div>
        )}
      </a>
    );
  };

  /**
   * 渲染系统消息
   */
  const renderSystemMessage = () => {
    return (
      <div className="text-center py-2">
        <span className="text-xs text-gray-400 px-3 py-1 bg-gray-100 rounded-full">
          {message.content}
        </span>
      </div>
    );
  };

  /**
   * 根据消息类型渲染内容
   */
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return renderTextMessage();
      case 'image':
        return renderImageMessage();
      case 'video':
        return renderVideoMessage();
      case 'audio':
        return renderAudioMessage();
      case 'file':
        return renderFileMessage();
      case 'system':
        return renderSystemMessage();
      default:
        return null;
    }
  };

  // 系统消息居中显示
  if (message.type === 'system') {
    return <div className="py-2">{renderContent()}</div>;
  }

  return (
    <div className={`flex gap-2 py-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 头像 */}
      {showAvatar && (
        <Avatar
          src={message.sender.avatar}
          alt={message.sender.nickname}
          size="sm"
          className="flex-shrink-0"
        />
      )}

      {/* 内容区 */}
      <div className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
        {/* 发送者昵称（非自己的消息显示） */}
        {!isMine && showAvatar && (
          <span className="text-xs text-gray-500 px-2">
            {message.sender.nickname}
          </span>
        )}

        {/* 消息气泡 */}
        {renderContent()}

        {/* 时间和状态 */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-gray-400">
            {formatTime(message.createdAt)}
          </span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
};
