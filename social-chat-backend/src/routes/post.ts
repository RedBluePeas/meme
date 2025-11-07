import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  createPostValidator,
  updatePostValidator,
  postIdValidator,
  userIdParamValidator,
} from '../validators/postValidator';
import { paginationValidator } from '../validators/userValidator';

const router = Router();

// 获取关注用户的动态（Feed）- 需要认证
router.get(
  '/feed',
  authenticate,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.getFeed(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 创建动态 - 需要认证
router.post(
  '/',
  authenticate,
  createPostValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.createPost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取动态详情 - 可选认证
router.get(
  '/:id',
  optionalAuth,
  postIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.getPostById(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 更新动态 - 需要认证
router.put(
  '/:id',
  authenticate,
  postIdValidator,
  updatePostValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.updatePost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 删除动态 - 需要认证
router.delete(
  '/:id',
  authenticate,
  postIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.deletePost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 点赞动态 - 需要认证
router.post(
  '/:id/like',
  authenticate,
  postIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.likePost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 取消点赞动态 - 需要认证
router.delete(
  '/:id/like',
  authenticate,
  postIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.unlikePost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取动态的点赞列表
router.get(
  '/:id/likes',
  postIdValidator,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.getPostLikes(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取用户的动态列表 - 可选认证
router.get(
  '/user/:userId',
  optionalAuth,
  userIdParamValidator,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await PostController.getUserPosts(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
