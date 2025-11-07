import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  updateUserValidator,
  userIdValidator,
  usernameValidator,
  searchUsersValidator,
  paginationValidator,
} from '../validators/userValidator';

const router = Router();

// 搜索用户
router.get(
  '/search',
  searchUsersValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.searchUsers(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 根据用户名获取用户信息
router.get(
  '/username/:username',
  usernameValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.getUserByUsername(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取用户信息
router.get(
  '/:id',
  async (req, res, next) => {
    try {
      await UserController.getUserById(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 更新用户信息（需要认证）
router.put(
  '/profile',
  authenticate,
  updateUserValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.updateUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 关注用户（需要认证）
router.post(
  '/:userId/follow',
  authenticate,
  userIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.followUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 取消关注用户（需要认证）
router.delete(
  '/:userId/follow',
  authenticate,
  userIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.unfollowUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 检查是否关注某用户（需要认证）
router.get(
  '/:userId/is-following',
  authenticate,
  userIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.checkFollowing(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取关注列表
router.get(
  '/:userId/following',
  userIdValidator,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.getFollowing(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取粉丝列表
router.get(
  '/:userId/followers',
  userIdValidator,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await UserController.getFollowers(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
