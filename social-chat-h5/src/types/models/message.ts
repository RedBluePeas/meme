/**
 * Message 消息模型类型定义
 */

import { UserBrief } from './user';

/**
 * 消息类型
 */
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'system';

/**
 * 消息状态
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * 会话类型
 */
export type ConversationType = 'private' | 'group';

/**
 * 消息模型
 */
export interface Message {
  id: string;
  conversationId: string;
  sender: UserBrief;
  type: MessageType;
  content: string;
  status: MessageStatus;

  // 媒体资源
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  audioDuration?: number;

  // 回复信息
  replyTo?: {
    id: string;
    content: string;
    sender: UserBrief;
  };

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

/**
 * 会话模型
 */
export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar: string;

  // 最后一条消息
  lastMessage: string;
  lastMessageAt: string;
  lastMessageType?: MessageType;

  // 未读数
  unreadCount: number;

  // 群聊信息
  members?: UserBrief[];
  memberCount?: number;

  // 是否置顶
  isPinned: boolean;

  // 是否免打扰
  isMuted: boolean;

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

/**
 * 发送消息参数
 */
export interface SendMessageParams {
  conversationId: string;
  type: MessageType;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  replyTo?: string; // 回复的消息ID
}

/**
 * 创建会话参数
 */
export interface CreateConversationParams {
  type: ConversationType;
  userIds?: string[]; // 私聊时为对方ID，群聊时为所有成员ID
  name?: string; // 群聊名称
}
