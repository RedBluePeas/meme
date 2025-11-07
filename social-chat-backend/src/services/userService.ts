import { db } from '../config/db';
import { User } from '../types';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  /**
   * 获取用户信息
   */
  static async getUserById(userId: string): Promise<Partial<User>> {
    const user = await db('users')
      .where('id', userId)
      .select(
        'id',
        'username',
        'email',
        'phone',
        'nickname',
        'avatar',
        'bio',
        'gender',
        'birthday',
        'location',
        'website',
        'status',
        'followers_count',
        'following_count',
        'posts_count',
        'created_at'
      )
      .first();

    if (!user) {
      throw new AppError(404, '用户不存在');
    }

    return user;
  }

  /**
   * 根据用户名获取用户
   */
  static async getUserByUsername(username: string): Promise<Partial<User>> {
    const user = await db('users')
      .where('username', username)
      .select(
        'id',
        'username',
        'nickname',
        'avatar',
        'bio',
        'gender',
        'location',
        'website',
        'followers_count',
        'following_count',
        'posts_count',
        'created_at'
      )
      .first();

    if (!user) {
      throw new AppError(404, '用户不存在');
    }

    return user;
  }

  /**
   * 更新用户信息
   */
  static async updateUser(
    userId: string,
    data: Partial<{
      nickname: string;
      avatar: string;
      bio: string;
      gender: string;
      birthday: Date;
      location: string;
      website: string;
    }>
  ): Promise<Partial<User>> {
    // 检查用户是否存在
    const user = await db('users').where('id', userId).first();
    if (!user) {
      throw new AppError(404, '用户不存在');
    }

    // 更新用户信息
    await db('users')
      .where('id', userId)
      .update({
        ...data,
        updated_at: db.fn.now(),
      });

    // 返回更新后的用户信息
    return this.getUserById(userId);
  }

  /**
   * 关注用户
   */
  static async followUser(followerId: string, followingId: string): Promise<void> {
    // 不能关注自己
    if (followerId === followingId) {
      throw new AppError(400, '不能关注自己');
    }

    // 检查被关注用户是否存在
    const followingUser = await db('users').where('id', followingId).first();
    if (!followingUser) {
      throw new AppError(404, '用户不存在');
    }

    // 检查是否已经关注
    const existingFollow = await db('follows')
      .where({
        follower_id: followerId,
        following_id: followingId,
      })
      .first();

    if (existingFollow) {
      throw new AppError(400, '已经关注该用户');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 创建关注记录
      await trx('follows').insert({
        follower_id: followerId,
        following_id: followingId,
      });

      // 更新关注者的关注数
      await trx('users')
        .where('id', followerId)
        .increment('following_count', 1);

      // 更新被关注者的粉丝数
      await trx('users')
        .where('id', followingId)
        .increment('followers_count', 1);
    });
  }

  /**
   * 取消关注用户
   */
  static async unfollowUser(followerId: string, followingId: string): Promise<void> {
    // 检查是否已关注
    const existingFollow = await db('follows')
      .where({
        follower_id: followerId,
        following_id: followingId,
      })
      .first();

    if (!existingFollow) {
      throw new AppError(400, '未关注该用户');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 删除关注记录
      await trx('follows')
        .where({
          follower_id: followerId,
          following_id: followingId,
        })
        .delete();

      // 更新关注者的关注数
      await trx('users')
        .where('id', followerId)
        .decrement('following_count', 1);

      // 更新被关注者的粉丝数
      await trx('users')
        .where('id', followingId)
        .decrement('followers_count', 1);
    });
  }

  /**
   * 获取用户的关注列表
   */
  static async getFollowing(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: Partial<User>[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 获取关注列表
    const following = await db('follows')
      .where('follower_id', userId)
      .join('users', 'follows.following_id', 'users.id')
      .select(
        'users.id',
        'users.username',
        'users.nickname',
        'users.avatar',
        'users.bio',
        'users.followers_count',
        'users.following_count'
      )
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('follows')
      .where('follower_id', userId)
      .count('* as count');

    return {
      items: following,
      total: Number(count),
    };
  }

  /**
   * 获取用户的粉丝列表
   */
  static async getFollowers(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: Partial<User>[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 获取粉丝列表
    const followers = await db('follows')
      .where('following_id', userId)
      .join('users', 'follows.follower_id', 'users.id')
      .select(
        'users.id',
        'users.username',
        'users.nickname',
        'users.avatar',
        'users.bio',
        'users.followers_count',
        'users.following_count'
      )
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('follows')
      .where('following_id', userId)
      .count('* as count');

    return {
      items: followers,
      total: Number(count),
    };
  }

  /**
   * 检查是否关注某用户
   */
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await db('follows')
      .where({
        follower_id: followerId,
        following_id: followingId,
      })
      .first();

    return !!follow;
  }

  /**
   * 搜索用户
   */
  static async searchUsers(
    keyword: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: Partial<User>[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 搜索用户（按用户名或昵称）
    const users = await db('users')
      .where('username', 'like', `%${keyword}%`)
      .orWhere('nickname', 'like', `%${keyword}%`)
      .andWhere('status', 'active')
      .select(
        'id',
        'username',
        'nickname',
        'avatar',
        'bio',
        'followers_count',
        'following_count',
        'posts_count'
      )
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('users')
      .where('username', 'like', `%${keyword}%`)
      .orWhere('nickname', 'like', `%${keyword}%`)
      .andWhere('status', 'active')
      .count('* as count');

    return {
      items: users,
      total: Number(count),
    };
  }
}
