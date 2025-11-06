/**
 * Message API - 消息模块接口
 */

import { request } from '../request';
import {
  Message,
  Conversation,
  SendMessageParams,
  CreateConversationParams,
} from '@/types/models';
import { PaginationParams, PaginationResponse } from '@/types/api';

/**
 * 获取会话列表
 */
export function getConversations(
  params: PaginationParams
): Promise<PaginationResponse<Conversation>> {
  return request.get('/api/conversations', { params });
}

/**
 * 获取会话详情
 */
export function getConversation(conversationId: string): Promise<Conversation> {
  return request.get(`/api/conversations/${conversationId}`);
}

/**
 * 创建会话
 */
export function createConversation(
  params: CreateConversationParams
): Promise<Conversation> {
  return request.post('/api/conversations', params);
}

/**
 * 删除会话
 */
export function deleteConversation(conversationId: string): Promise<void> {
  return request.delete(`/api/conversations/${conversationId}`);
}

/**
 * 置顶/取消置顶会话
 */
export function pinConversation(
  conversationId: string,
  isPinned: boolean
): Promise<void> {
  return request.put(`/api/conversations/${conversationId}/pin`, { isPinned });
}

/**
 * 免打扰/取消免打扰
 */
export function muteConversation(
  conversationId: string,
  isMuted: boolean
): Promise<void> {
  return request.put(`/api/conversations/${conversationId}/mute`, { isMuted });
}

/**
 * 获取消息列表
 */
export function getMessages(
  conversationId: string,
  params: PaginationParams
): Promise<PaginationResponse<Message>> {
  return request.get(`/api/conversations/${conversationId}/messages`, { params });
}

/**
 * 发送消息
 */
export function sendMessage(params: SendMessageParams): Promise<Message> {
  return request.post('/api/messages', params);
}

/**
 * 撤回消息
 */
export function recallMessage(messageId: string): Promise<void> {
  return request.put(`/api/messages/${messageId}/recall`);
}

/**
 * 删除消息
 */
export function deleteMessage(messageId: string): Promise<void> {
  return request.delete(`/api/messages/${messageId}`);
}

/**
 * 标记消息为已读
 */
export function markAsRead(conversationId: string): Promise<void> {
  return request.put(`/api/conversations/${conversationId}/read`);
}

/**
 * 获取未读消息总数
 */
export function getUnreadCount(): Promise<{ count: number }> {
  return request.get('/api/messages/unread-count');
}
