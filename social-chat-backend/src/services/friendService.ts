import { db } from '../config/db';
import { Friendship } from '../types';
import { AppError } from '../middleware/errorHandler';
import { NotificationService } from './notificationService';

export class FriendService {
  /**
   * 发送好友申请
   */
  static async sendFriendRequest(
    userId: string,
    friendId: string,
    remark?: string
  ): Promise<Friendship> {
    // 不能添加自己为好友
    if (userId === friendId) {
      throw new AppError(400, '不能添加自己为好友');
    }

    // 检查对方是否存在
    const friend = await db('users').where('id', friendId).first();
    if (!friend) {
      throw new AppError(404, '用户不存在');
    }

    // 检查是否已经是好友或已发送过申请
    const existingFriendship = await db('friendships')
      .where((builder) => {
        builder
          .where({ user_id: userId, friend_id: friendId })
          .orWhere({ user_id: friendId, friend_id: userId });
      })
      .first();

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        throw new AppError(400, '已经是好友关系');
      } else if (existingFriendship.status === 'pending') {
        throw new AppError(400, '好友申请已发送，请等待对方回应');
      } else if (existingFriendship.status === 'blocked') {
        throw new AppError(403, '无法添加该用户为好友');
      }
    }

    // 创建好友申请
    const [friendship] = await db('friendships')
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: 'pending',
        remark,
      })
      .returning('*');

    // 发送通知
    const sender = await db('users')
      .where('id', userId)
      .select('nickname', 'username')
      .first();

    await NotificationService.create({
      userId: friendId,
      type: 'friend_request',
      title: '新的好友申请',
      content: `${sender.nickname} 请求添加你为好友`,
      data: {
        friendshipId: friendship.id,
        fromUserId: userId,
        fromUsername: sender.username,
        fromNickname: sender.nickname,
      },
    });

    return friendship;
  }

  /**
   * 接受好友申请
   */
  static async acceptFriendRequest(userId: string, friendshipId: string): Promise<void> {
    // 获取好友申请
    const friendship = await db('friendships').where('id', friendshipId).first();

    if (!friendship) {
      throw new AppError(404, '好友申请不存在');
    }

    // 检查是否是接收方
    if (friendship.friend_id !== userId) {
      throw new AppError(403, '无权操作此好友申请');
    }

    // 检查状态
    if (friendship.status !== 'pending') {
      throw new AppError(400, '该好友申请已处理');
    }

    // 更新状态
    await db('friendships')
      .where('id', friendshipId)
      .update({
        status: 'accepted',
        updated_at: db.fn.now(),
      });

    // 发送通知给申请方
    const receiver = await db('users')
      .where('id', userId)
      .select('nickname', 'username')
      .first();

    await NotificationService.create({
      userId: friendship.user_id,
      type: 'system',
      title: '好友申请已通过',
      content: `${receiver.nickname} 接受了你的好友申请`,
      data: {
        friendshipId: friendship.id,
        fromUserId: userId,
        fromUsername: receiver.username,
        fromNickname: receiver.nickname,
      },
    });
  }

  /**
   * 拒绝好友申请
   */
  static async rejectFriendRequest(userId: string, friendshipId: string): Promise<void> {
    // 获取好友申请
    const friendship = await db('friendships').where('id', friendshipId).first();

    if (!friendship) {
      throw new AppError(404, '好友申请不存在');
    }

    // 检查是否是接收方
    if (friendship.friend_id !== userId) {
      throw new AppError(403, '无权操作此好友申请');
    }

    // 检查状态
    if (friendship.status !== 'pending') {
      throw new AppError(400, '该好友申请已处理');
    }

    // 更新状态
    await db('friendships')
      .where('id', friendshipId)
      .update({
        status: 'rejected',
        updated_at: db.fn.now(),
      });
  }

  /**
   * 删除好友
   */
  static async removeFriend(userId: string, friendId: string): Promise<void> {
    // 查找好友关系
    const friendship = await db('friendships')
      .where((builder) => {
        builder
          .where({ user_id: userId, friend_id: friendId })
          .orWhere({ user_id: friendId, friend_id: userId });
      })
      .andWhere('status', 'accepted')
      .first();

    if (!friendship) {
      throw new AppError(404, '不是好友关系');
    }

    // 删除好友关系
    await db('friendships').where('id', friendship.id).delete();
  }

  /**
   * 拉黑用户
   */
  static async blockUser(userId: string, targetUserId: string): Promise<void> {
    // 不能拉黑自己
    if (userId === targetUserId) {
      throw new AppError(400, '不能拉黑自己');
    }

    // 检查对方是否存在
    const targetUser = await db('users').where('id', targetUserId).first();
    if (!targetUser) {
      throw new AppError(404, '用户不存在');
    }

    // 查找是否已有关系记录
    const existingFriendship = await db('friendships')
      .where((builder) => {
        builder
          .where({ user_id: userId, friend_id: targetUserId })
          .orWhere({ user_id: targetUserId, friend_id: userId });
      })
      .first();

    if (existingFriendship) {
      // 更新为拉黑状态
      await db('friendships')
        .where('id', existingFriendship.id)
        .update({
          user_id: userId,
          friend_id: targetUserId,
          status: 'blocked',
          updated_at: db.fn.now(),
        });
    } else {
      // 创建拉黑记录
      await db('friendships').insert({
        user_id: userId,
        friend_id: targetUserId,
        status: 'blocked',
      });
    }
  }

  /**
   * 取消拉黑
   */
  static async unblockUser(userId: string, targetUserId: string): Promise<void> {
    // 查找拉黑记录
    const friendship = await db('friendships')
      .where({
        user_id: userId,
        friend_id: targetUserId,
        status: 'blocked',
      })
      .first();

    if (!friendship) {
      throw new AppError(404, '未拉黑该用户');
    }

    // 删除拉黑记录
    await db('friendships').where('id', friendship.id).delete();
  }

  /**
   * 获取好友列表
   */
  static async getFriendList(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
    groupName?: string
  ): Promise<{ items: any[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 构建查询
    const query = db('friendships')
      .where('status', 'accepted')
      .where((builder) => {
        builder.where('user_id', userId).orWhere('friend_id', userId);
      });

    // 按分组筛选
    if (groupName) {
      query.andWhere('group_name', groupName);
    }

    // 获取好友列表
    const friendships = await query
      .join('users', function () {
        this.on('friendships.friend_id', 'users.id')
          .andOn('friendships.user_id', db.raw('?', [userId]))
          .orOn('friendships.user_id', 'users.id')
          .andOn('friendships.friend_id', db.raw('?', [userId]));
      })
      .select(
        'friendships.id as friendship_id',
        'friendships.remark',
        'friendships.group_name',
        'users.id',
        'users.username',
        'users.nickname',
        'users.avatar',
        'users.bio'
      )
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const countQuery = db('friendships')
      .where('status', 'accepted')
      .where((builder) => {
        builder.where('user_id', userId).orWhere('friend_id', userId);
      });

    if (groupName) {
      countQuery.andWhere('group_name', groupName);
    }

    const [{ count }] = await countQuery.count('* as count');

    return {
      items: friendships,
      total: Number(count),
    };
  }

  /**
   * 获取好友申请列表
   */
  static async getFriendRequests(
    userId: string,
    type: 'received' | 'sent',
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: any[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 根据类型构建查询
    const query =
      type === 'received'
        ? db('friendships').where('friend_id', userId)
        : db('friendships').where('user_id', userId);

    // 只查询待处理的申请
    const friendRequests = await query
      .where('status', 'pending')
      .join('users', type === 'received' ? 'friendships.user_id' : 'friendships.friend_id', 'users.id')
      .select(
        'friendships.id as friendship_id',
        'friendships.remark',
        'friendships.created_at',
        'users.id',
        'users.username',
        'users.nickname',
        'users.avatar',
        'users.bio'
      )
      .orderBy('friendships.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const countQuery =
      type === 'received'
        ? db('friendships').where('friend_id', userId)
        : db('friendships').where('user_id', userId);

    const [{ count }] = await countQuery.where('status', 'pending').count('* as count');

    return {
      items: friendRequests,
      total: Number(count),
    };
  }

  /**
   * 更新好友备注和分组
   */
  static async updateFriendRemark(
    userId: string,
    friendId: string,
    remark?: string,
    groupName?: string
  ): Promise<void> {
    // 查找好友关系
    const friendship = await db('friendships')
      .where((builder) => {
        builder
          .where({ user_id: userId, friend_id: friendId })
          .orWhere({ user_id: friendId, friend_id: userId });
      })
      .andWhere('status', 'accepted')
      .first();

    if (!friendship) {
      throw new AppError(404, '不是好友关系');
    }

    // 更新备注和分组
    const updateData: any = { updated_at: db.fn.now() };
    if (remark !== undefined) updateData.remark = remark;
    if (groupName !== undefined) updateData.group_name = groupName;

    await db('friendships').where('id', friendship.id).update(updateData);
  }

  /**
   * 检查是否是好友
   */
  static async isFriend(userId: string, targetUserId: string): Promise<boolean> {
    const friendship = await db('friendships')
      .where((builder) => {
        builder
          .where({ user_id: userId, friend_id: targetUserId })
          .orWhere({ user_id: targetUserId, friend_id: userId });
      })
      .andWhere('status', 'accepted')
      .first();

    return !!friendship;
  }

  /**
   * 获取拉黑列表
   */
  static async getBlockList(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: any[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 获取拉黑列表
    const blockList = await db('friendships')
      .where({
        user_id: userId,
        status: 'blocked',
      })
      .join('users', 'friendships.friend_id', 'users.id')
      .select(
        'friendships.id as friendship_id',
        'friendships.created_at',
        'users.id',
        'users.username',
        'users.nickname',
        'users.avatar'
      )
      .orderBy('friendships.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('friendships')
      .where({
        user_id: userId,
        status: 'blocked',
      })
      .count('* as count');

    return {
      items: blockList,
      total: Number(count),
    };
  }
}
