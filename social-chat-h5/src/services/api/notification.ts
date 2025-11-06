/**
 * Notification API - 通知模块接口
 */

import { request } from '../request';
import { Notification, NotificationStats, MarkAsReadParams } from '@/types/models';
import { PaginationParams, PaginationResponse } from '@/types/api';

/**
 * 获取通知列表
 */
export function getNotifications(params: PaginationParams): Promise<PaginationResponse<Notification>> {
  return request.get('/api/notifications', { params });
}

/**
 * 获取通知统计
 */
export function getNotificationStats(): Promise<NotificationStats> {
  return request.get('/api/notifications/stats');
}

/**
 * 标记已读
 */
export function markAsRead(params?: MarkAsReadParams): Promise<void> {
  return request.put('/api/notifications/read', params);
}

/**
 * 删除通知
 */
export function deleteNotification(notificationId: string): Promise<void> {
  return request.delete(`/api/notifications/${notificationId}`);
}

/**
 * 清空所有通知
 */
export function clearAllNotifications(): Promise<void> {
  return request.delete('/api/notifications');
}
