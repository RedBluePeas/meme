import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  createCommentValidator,
  postIdParamValidator,
  commentIdParamValidator,
} from '../validators/commentValidator';
import { paginationValidator } from '../validators/userValidator';

const router = Router();

// 创建评论 - 需要认证
router.post(
  '/posts/:postId/comments',
  authenticate,
  postIdParamValidator,
  createCommentValidator,
  validate,
  async (req, res, next) => {
    try {
      await CommentController.createComment(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取动态的评论列表
router.get(
  '/posts/:postId/comments',
  postIdParamValidator,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await CommentController.getPostComments(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取评论的回复列表
router.get(
  '/comments/:commentId/replies',
  commentIdParamValidator,
  paginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await CommentController.getCommentReplies(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 删除评论 - 需要认证
router.delete(
  '/comments/:commentId',
  authenticate,
  commentIdParamValidator,
  validate,
  async (req, res, next) => {
    try {
      await CommentController.deleteComment(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 点赞评论 - 需要认证
router.post(
  '/comments/:commentId/like',
  authenticate,
  commentIdParamValidator,
  validate,
  async (req, res, next) => {
    try {
      await CommentController.likeComment(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 取消点赞评论 - 需要认证
router.delete(
  '/comments/:commentId/like',
  authenticate,
  commentIdParamValidator,
  validate,
  async (req, res, next) => {
    try {
      await CommentController.unlikeComment(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
