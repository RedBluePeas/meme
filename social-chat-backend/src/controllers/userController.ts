import { Response } from 'express';
import { AuthRequest } from '../types';
import { UserService } from '../services/userService';
import { success, paginated } from '../utils/response';

export class UserController {
  /**
   * 获取用户信息
   */
  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const user = await UserService.getUserById(id);

    success(res, { user });
  }

  /**
   * 根据用户名获取用户
   */
  static async getUserByUsername(req: AuthRequest, res: Response): Promise<void> {
    const { username } = req.params;

    const user = await UserService.getUserByUsername(username);

    success(res, { user });
  }

  /**
   * 更新用户信息
   */
  static async updateUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { nickname, avatar, bio, gender, birthday, location, website } = req.body;

    const user = await UserService.updateUser(userId, {
      nickname,
      avatar,
      bio,
      gender,
      birthday,
      location,
      website,
    });

    success(res, { user }, '更新成功');
  }

  /**
   * 关注用户
   */
  static async followUser(req: AuthRequest, res: Response): Promise<void> {
    const followerId = req.user!.id;
    const { userId } = req.params;

    await UserService.followUser(followerId, userId);

    success(res, undefined, '关注成功');
  }

  /**
   * 取消关注用户
   */
  static async unfollowUser(req: AuthRequest, res: Response): Promise<void> {
    const followerId = req.user!.id;
    const { userId } = req.params;

    await UserService.unfollowUser(followerId, userId);

    success(res, undefined, '取消关注成功');
  }

  /**
   * 获取关注列表
   */
  static async getFollowing(req: AuthRequest, res: Response): Promise<void> {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await UserService.getFollowing(userId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 获取粉丝列表
   */
  static async getFollowers(req: AuthRequest, res: Response): Promise<void> {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await UserService.getFollowers(userId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 检查是否关注某用户
   */
  static async checkFollowing(req: AuthRequest, res: Response): Promise<void> {
    const followerId = req.user!.id;
    const { userId } = req.params;

    const isFollowing = await UserService.isFollowing(followerId, userId);

    success(res, { isFollowing });
  }

  /**
   * 搜索用户
   */
  static async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    const keyword = req.query.keyword as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await UserService.searchUsers(keyword, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }
}
