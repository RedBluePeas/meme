import { Router } from 'express';
import { FriendController } from '../controllers/friendController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  sendFriendRequestValidator,
  friendshipIdValidator,
  friendIdValidator,
  updateFriendRemarkValidator,
  friendRequestTypeValidator,
} from '../validators/friendValidator';
import { paginationValidator } from '../validators/userValidator';
import { userIdValidator } from '../validators/userValidator';

const router = Router();

// 所有好友相关路由都需要认证
router.use(authenticate);

// 发送好友申请
router.post(
  '/requests',
  sendFriendRequestValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.sendFriendRequest(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取好友申请列表
router.get(
  '/requests',
  friendRequestTypeValidator,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.getFriendRequests(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 接受好友申请
router.post(
  '/requests/:friendshipId/accept',
  friendshipIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.acceptFriendRequest(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 拒绝好友申请
router.post(
  '/requests/:friendshipId/reject',
  friendshipIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.rejectFriendRequest(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取好友列表
router.get(
  '/',
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.getFriendList(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 删除好友
router.delete(
  '/:friendId',
  friendIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.removeFriend(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 更新好友备注和分组
router.put(
  '/:friendId/remark',
  friendIdValidator,
  updateFriendRemarkValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.updateFriendRemark(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 检查是否是好友
router.get(
  '/check/:userId',
  userIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.checkFriendship(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 拉黑用户
router.post(
  '/block/:userId',
  userIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.blockUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 取消拉黑
router.delete(
  '/block/:userId',
  userIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.unblockUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取拉黑列表
router.get(
  '/block',
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await FriendController.getBlockList(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
