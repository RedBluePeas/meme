import { Response } from 'express';
import { AuthRequest } from '../types';
import { CommentService } from '../services/commentService';
import { success, paginated } from '../utils/response';

export class CommentController {
  /**
   * 创建评论
   */
  static async createComment(req: AuthRequest, res: Response): Promise<void> {
    const { postId } = req.params;
    const userId = req.user!.id;
    const { content, parentId } = req.body;

    const comment = await CommentService.createComment({
      postId,
      userId,
      content,
      parentId,
    });

    success(res, { comment }, '评论成功', 201);
  }

  /**
   * 获取动态的评论列表
   */
  static async getPostComments(req: AuthRequest, res: Response): Promise<void> {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await CommentService.getPostComments(postId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 获取评论的回复列表
   */
  static async getCommentReplies(req: AuthRequest, res: Response): Promise<void> {
    const { commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await CommentService.getCommentReplies(commentId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 删除评论
   */
  static async deleteComment(req: AuthRequest, res: Response): Promise<void> {
    const { commentId } = req.params;
    const userId = req.user!.id;

    await CommentService.deleteComment(commentId, userId);

    success(res, undefined, '删除成功');
  }

  /**
   * 点赞评论
   */
  static async likeComment(req: AuthRequest, res: Response): Promise<void> {
    const { commentId } = req.params;
    const userId = req.user!.id;

    await CommentService.likeComment(commentId, userId);

    success(res, undefined, '点赞成功');
  }

  /**
   * 取消点赞评论
   */
  static async unlikeComment(req: AuthRequest, res: Response): Promise<void> {
    const { commentId } = req.params;
    const userId = req.user!.id;

    await CommentService.unlikeComment(commentId, userId);

    success(res, undefined, '取消点赞成功');
  }
}
