import { Response } from 'express';
import { AuthRequest } from '../types';
import { FriendService } from '../services/friendService';
import { success, paginated } from '../utils/response';

export class FriendController {
  /**
   * 发送好友申请
   */
  static async sendFriendRequest(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { friendId, remark } = req.body;

    const friendship = await FriendService.sendFriendRequest(userId, friendId, remark);

    success(res, { friendship }, '好友申请已发送', 201);
  }

  /**
   * 接受好友申请
   */
  static async acceptFriendRequest(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { friendshipId } = req.params;

    await FriendService.acceptFriendRequest(userId, friendshipId);

    success(res, undefined, '已接受好友申请');
  }

  /**
   * 拒绝好友申请
   */
  static async rejectFriendRequest(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { friendshipId } = req.params;

    await FriendService.rejectFriendRequest(userId, friendshipId);

    success(res, undefined, '已拒绝好友申请');
  }

  /**
   * 删除好友
   */
  static async removeFriend(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { friendId } = req.params;

    await FriendService.removeFriend(userId, friendId);

    success(res, undefined, '已删除好友');
  }

  /**
   * 拉黑用户
   */
  static async blockUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { userId: targetUserId } = req.params;

    await FriendService.blockUser(userId, targetUserId);

    success(res, undefined, '已拉黑该用户');
  }

  /**
   * 取消拉黑
   */
  static async unblockUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { userId: targetUserId } = req.params;

    await FriendService.unblockUser(userId, targetUserId);

    success(res, undefined, '已取消拉黑');
  }

  /**
   * 获取好友列表
   */
  static async getFriendList(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const groupName = req.query.groupName as string;

    const result = await FriendService.getFriendList(userId, page, pageSize, groupName);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 获取好友申请列表
   */
  static async getFriendRequests(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const type = (req.query.type as 'received' | 'sent') || 'received';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await FriendService.getFriendRequests(userId, type, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 更新好友备注和分组
   */
  static async updateFriendRemark(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { friendId } = req.params;
    const { remark, groupName } = req.body;

    await FriendService.updateFriendRemark(userId, friendId, remark, groupName);

    success(res, undefined, '更新成功');
  }

  /**
   * 检查是否是好友
   */
  static async checkFriendship(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { userId: targetUserId } = req.params;

    const isFriend = await FriendService.isFriend(userId, targetUserId);

    success(res, { isFriend });
  }

  /**
   * 获取拉黑列表
   */
  static async getBlockList(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await FriendService.getBlockList(userId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }
}
