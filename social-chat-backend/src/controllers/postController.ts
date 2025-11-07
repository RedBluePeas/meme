import { Response } from 'express';
import { AuthRequest } from '../types';
import { PostService } from '../services/postService';
import { success, paginated } from '../utils/response';

export class PostController {
  /**
   * 创建动态
   */
  static async createPost(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { type, content, images, videoUrl, visibility, locationName, locationLat, locationLng } =
      req.body;

    const post = await PostService.createPost({
      userId,
      type,
      content,
      images,
      videoUrl,
      visibility,
      locationName,
      locationLat,
      locationLng,
    });

    success(res, { post }, '发布成功', 201);
  }

  /**
   * 获取动态详情
   */
  static async getPostById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const post = await PostService.getPostById(id, currentUserId);

    success(res, { post });
  }

  /**
   * 获取用户的动态列表
   */
  static async getUserPosts(req: AuthRequest, res: Response): Promise<void> {
    const { userId } = req.params;
    const currentUserId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await PostService.getUserPosts(userId, currentUserId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 获取关注用户的动态（Feed）
   */
  static async getFeed(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await PostService.getFeed(userId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 更新动态
   */
  static async updatePost(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.id;
    const { content, visibility } = req.body;

    const post = await PostService.updatePost(id, userId, {
      content,
      visibility,
    });

    success(res, { post }, '更新成功');
  }

  /**
   * 删除动态
   */
  static async deletePost(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.id;

    await PostService.deletePost(id, userId);

    success(res, undefined, '删除成功');
  }

  /**
   * 点赞动态
   */
  static async likePost(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.id;

    await PostService.likePost(id, userId);

    success(res, undefined, '点赞成功');
  }

  /**
   * 取消点赞动态
   */
  static async unlikePost(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.id;

    await PostService.unlikePost(id, userId);

    success(res, undefined, '取消点赞成功');
  }

  /**
   * 获取动态的点赞列表
   */
  static async getPostLikes(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await PostService.getPostLikes(id, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }
}
