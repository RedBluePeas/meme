import { db } from '../config/db';
import { Notification } from '../types';
import { AppError } from '../middleware/errorHandler';

export class NotificationService {
  /**
   * 创建通知
   */
  static async create(data: {
    userId: string;
    type: 'like' | 'comment' | 'follow' | 'friend_request' | 'system';
    title: string;
    content: string;
    data?: Record<string, any>;
  }): Promise<Notification> {
    const { userId, type, title, content, data: extraData } = data;

    const [notification] = await db('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        content,
        data: extraData ? JSON.stringify(extraData) : null,
      })
      .returning('*');

    // 解析 data 字段
    if (notification.data) {
      notification.data = JSON.parse(notification.data);
    }

    return notification;
  }

  /**
   * 获取用户的通知列表
   */
  static async getUserNotifications(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false
  ): Promise<{ items: Notification[]; total: number; unreadCount: number }> {
    const offset = (page - 1) * pageSize;

    // 构建查询
    const query = db('notifications').where('user_id', userId);

    if (unreadOnly) {
      query.andWhere('is_read', false);
    }

    // 获取通知列表
    const notifications = await query
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 解析 data 字段
    const processedNotifications = notifications.map((notification) => {
      if (notification.data) {
        notification.data = JSON.parse(notification.data);
      }
      return notification;
    });

    // 获取总数
    const countQuery = db('notifications').where('user_id', userId);
    if (unreadOnly) {
      countQuery.andWhere('is_read', false);
    }
    const [{ count }] = await countQuery.count('* as count');

    // 获取未读数
    const [{ count: unreadCount }] = await db('notifications')
      .where('user_id', userId)
      .andWhere('is_read', false)
      .count('* as count');

    return {
      items: processedNotifications,
      total: Number(count),
      unreadCount: Number(unreadCount),
    };
  }

  /**
   * 标记通知为已读
   */
  static async markAsRead(notificationId: string, userId: string): Promise<void> {
    // 检查通知是否属于该用户
    const notification = await db('notifications')
      .where({
        id: notificationId,
        user_id: userId,
      })
      .first();

    if (!notification) {
      throw new AppError(404, '通知不存在');
    }

    // 标记为已读
    await db('notifications')
      .where('id', notificationId)
      .update({ is_read: true });
  }

  /**
   * 标记所有通知为已读
   */
  static async markAllAsRead(userId: string): Promise<void> {
    await db('notifications')
      .where({
        user_id: userId,
        is_read: false,
      })
      .update({ is_read: true });
  }

  /**
   * 删除通知
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    // 检查通知是否属于该用户
    const notification = await db('notifications')
      .where({
        id: notificationId,
        user_id: userId,
      })
      .first();

    if (!notification) {
      throw new AppError(404, '通知不存在');
    }

    // 删除通知
    await db('notifications').where('id', notificationId).delete();
  }

  /**
   * 获取未读通知数量
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const [{ count }] = await db('notifications')
      .where({
        user_id: userId,
        is_read: false,
      })
      .count('* as count');

    return Number(count);
  }

  /**
   * 批量删除已读通知
   */
  static async deleteReadNotifications(userId: string): Promise<void> {
    await db('notifications')
      .where({
        user_id: userId,
        is_read: true,
      })
      .delete();
  }
}
