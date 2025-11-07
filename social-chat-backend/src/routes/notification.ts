import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  notificationIdValidator,
  notificationQueryValidator,
} from '../validators/notificationValidator';
import { paginationValidator } from '../validators/userValidator';

const router = Router();

// 所有通知相关路由都需要认证
router.use(authenticate);

// 获取通知列表
router.get(
  '/',
  paginationValidator,
  notificationQueryValidator,
  validate,
  async (req, res, next) => {
    try {
      await NotificationController.getNotifications(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取未读通知数量
router.get(
  '/unread-count',
  async (req, res, next) => {
    try {
      await NotificationController.getUnreadCount(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 标记所有通知为已读
router.post(
  '/mark-all-read',
  async (req, res, next) => {
    try {
      await NotificationController.markAllAsRead(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 批量删除已读通知
router.delete(
  '/read',
  async (req, res, next) => {
    try {
      await NotificationController.deleteReadNotifications(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 标记通知为已读
router.post(
  '/:notificationId/read',
  notificationIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await NotificationController.markAsRead(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 删除通知
router.delete(
  '/:notificationId',
  notificationIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await NotificationController.deleteNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
