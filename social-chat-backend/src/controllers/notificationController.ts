import { Response } from 'express';
import { AuthRequest } from '../types';
import { NotificationService } from '../services/notificationService';
import { success, paginated } from '../utils/response';

export class NotificationController {
  /**
   * 获取通知列表
   */
  static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    const result = await NotificationService.getUserNotifications(userId, page, pageSize, unreadOnly);

    res.json({
      code: 200,
      message: 'success',
      data: {
        items: result.items,
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize),
        unreadCount: result.unreadCount,
      },
    });
  }

  /**
   * 标记通知为已读
   */
  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { notificationId } = req.params;

    await NotificationService.markAsRead(notificationId, userId);

    success(res, undefined, '已标记为已读');
  }

  /**
   * 标记所有通知为已读
   */
  static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    await NotificationService.markAllAsRead(userId);

    success(res, undefined, '已全部标记为已读');
  }

  /**
   * 删除通知
   */
  static async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { notificationId } = req.params;

    await NotificationService.deleteNotification(notificationId, userId);

    success(res, undefined, '删除成功');
  }

  /**
   * 获取未读通知数量
   */
  static async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const count = await NotificationService.getUnreadCount(userId);

    success(res, { count });
  }

  /**
   * 批量删除已读通知
   */
  static async deleteReadNotifications(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    await NotificationService.deleteReadNotifications(userId);

    success(res, undefined, '已删除所有已读通知');
  }
}
