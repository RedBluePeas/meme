import { db } from '../config/db';
import { Post } from '../types';
import { AppError } from '../middleware/errorHandler';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '../utils/cache';

export class PostService {
  /**
   * 创建动态
   */
  static async createPost(data: {
    userId: string;
    type: 'text' | 'image' | 'video';
    content?: string;
    images?: string[];
    videoUrl?: string;
    visibility?: 'public' | 'friends' | 'private';
    locationName?: string;
    locationLat?: number;
    locationLng?: number;
  }): Promise<Post> {
    const {
      userId,
      type,
      content,
      images,
      videoUrl,
      visibility = 'public',
      locationName,
      locationLat,
      locationLng,
    } = data;

    // 验证内容
    if (type === 'text' && !content) {
      throw new AppError(400, '文本动态必须包含内容');
    }

    if (type === 'image' && (!images || images.length === 0)) {
      throw new AppError(400, '图片动态必须包含至少一张图片');
    }

    if (type === 'video' && !videoUrl) {
      throw new AppError(400, '视频动态必须包含视频链接');
    }

    // 开始事务
    return await db.transaction(async (trx) => {
      // 创建动态
      const [post] = await trx('posts')
        .insert({
          user_id: userId,
          type,
          content,
          images: images ? JSON.stringify(images) : null,
          video_url: videoUrl,
          visibility,
          location_name: locationName,
          location_lat: locationLat,
          location_lng: locationLng,
        })
        .returning('*');

      // 更新用户的动态数
      await trx('users')
        .where('id', userId)
        .increment('posts_count', 1);

      // 转换 images 字段
      if (post.images) {
        post.images = JSON.parse(post.images);
      }

      // 清除相关缓存（异步执行，不阻塞响应）
      CacheService.clearUserCache(userId).catch((err) => {
        console.error('清除用户缓存失败', err);
      });

      return post;
    });
  }

  /**
   * 获取动态详情
   */
  static async getPostById(
    postId: string,
    currentUserId?: string
  ): Promise<Post & { user: any; isLiked: boolean; commentCount: number }> {
    // 获取动态信息
    const post = await db('posts')
      .where('posts.id', postId)
      .join('users', 'posts.user_id', 'users.id')
      .select(
        'posts.*',
        'users.id as user_id',
        'users.username',
        'users.nickname',
        'users.avatar'
      )
      .first();

    if (!post) {
      throw new AppError(404, '动态不存在');
    }

    // 检查可见性
    if (post.visibility === 'private' && post.user_id !== currentUserId) {
      throw new AppError(403, '无权查看该动态');
    }

    if (post.visibility === 'friends' && currentUserId) {
      // 检查是否是好友
      const isFriend = await this.checkFriendship(currentUserId, post.user_id);
      if (!isFriend && post.user_id !== currentUserId) {
        throw new AppError(403, '无权查看该动态');
      }
    }

    // 检查是否点赞
    let isLiked = false;
    if (currentUserId) {
      const like = await db('likes')
        .where({
          user_id: currentUserId,
          target_id: postId,
          target_type: 'post',
        })
        .first();
      isLiked = !!like;
    }

    // 转换 images 字段
    if (post.images) {
      post.images = JSON.parse(post.images);
    }

    return {
      ...post,
      user: {
        id: post.user_id,
        username: post.username,
        nickname: post.nickname,
        avatar: post.avatar,
      },
      isLiked,
      commentCount: post.comment_count,
    };
  }

  /**
   * 获取用户的动态列表
   */
  static async getUserPosts(
    userId: string,
    currentUserId: string | undefined,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: Post[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 检查可见性
    const visibilityCondition = (builder: any) => {
      if (currentUserId === userId) {
        // 查看自己的动态，可以看到所有
        return;
      } else if (currentUserId) {
        // 查看他人的动态，只能看到 public 和 friends（如果是好友）
        builder.where('posts.visibility', 'public');
        // TODO: 添加好友判断
      } else {
        // 未登录，只能看到 public
        builder.where('posts.visibility', 'public');
      }
    };

    // 获取动态列表
    const posts = await db('posts')
      .where('posts.user_id', userId)
      .where(visibilityCondition)
      .join('users', 'posts.user_id', 'users.id')
      .select(
        'posts.*',
        'users.username',
        'users.nickname',
        'users.avatar'
      )
      .orderBy('posts.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('posts')
      .where('posts.user_id', userId)
      .where(visibilityCondition)
      .count('* as count');

    // 转换 images 字段
    const processedPosts = posts.map((post) => {
      if (post.images) {
        post.images = JSON.parse(post.images);
      }
      return {
        ...post,
        user: {
          id: post.user_id,
          username: post.username,
          nickname: post.nickname,
          avatar: post.avatar,
        },
      };
    });

    return {
      items: processedPosts,
      total: Number(count),
    };
  }

  /**
   * 获取关注用户的动态（Feed）
   */
  static async getFeed(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: Post[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 获取关注的用户ID列表
    const followingIds = await db('follows')
      .where('follower_id', userId)
      .pluck('following_id');

    // 添加自己
    followingIds.push(userId);

    // 获取动态列表
    const posts = await db('posts')
      .whereIn('posts.user_id', followingIds)
      .where((builder) => {
        builder
          .where('posts.visibility', 'public')
          .orWhere((b) => {
            b.where('posts.visibility', 'friends').whereIn('posts.user_id', followingIds);
          })
          .orWhere('posts.user_id', userId);
      })
      .join('users', 'posts.user_id', 'users.id')
      .select(
        'posts.*',
        'users.username',
        'users.nickname',
        'users.avatar'
      )
      .orderBy('posts.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('posts')
      .whereIn('posts.user_id', followingIds)
      .where((builder) => {
        builder
          .where('posts.visibility', 'public')
          .orWhere((b) => {
            b.where('posts.visibility', 'friends').whereIn('posts.user_id', followingIds);
          })
          .orWhere('posts.user_id', userId);
      })
      .count('* as count');

    // 转换 images 字段并添加用户信息
    const processedPosts = posts.map((post) => {
      if (post.images) {
        post.images = JSON.parse(post.images);
      }
      return {
        ...post,
        user: {
          id: post.user_id,
          username: post.username,
          nickname: post.nickname,
          avatar: post.avatar,
        },
      };
    });

    return {
      items: processedPosts,
      total: Number(count),
    };
  }

  /**
   * 更新动态
   */
  static async updatePost(
    postId: string,
    userId: string,
    data: {
      content?: string;
      visibility?: 'public' | 'friends' | 'private';
    }
  ): Promise<Post> {
    // 检查动态是否存在且属于当前用户
    const post = await db('posts').where('id', postId).first();

    if (!post) {
      throw new AppError(404, '动态不存在');
    }

    if (post.user_id !== userId) {
      throw new AppError(403, '无权修改该动态');
    }

    // 更新动态
    await db('posts')
      .where('id', postId)
      .update({
        ...data,
        updated_at: db.fn.now(),
      });

    // 返回更新后的动态
    const updatedPost = await db('posts').where('id', postId).first();

    if (updatedPost.images) {
      updatedPost.images = JSON.parse(updatedPost.images);
    }

    return updatedPost;
  }

  /**
   * 删除动态
   */
  static async deletePost(postId: string, userId: string): Promise<void> {
    // 检查动态是否存在且属于当前用户
    const post = await db('posts').where('id', postId).first();

    if (!post) {
      throw new AppError(404, '动态不存在');
    }

    if (post.user_id !== userId) {
      throw new AppError(403, '无权删除该动态');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 删除动态
      await trx('posts').where('id', postId).delete();

      // 更新用户的动态数
      await trx('users')
        .where('id', userId)
        .decrement('posts_count', 1);
    });
  }

  /**
   * 点赞动态
   */
  static async likePost(postId: string, userId: string): Promise<void> {
    // 检查动态是否存在
    const post = await db('posts').where('id', postId).first();
    if (!post) {
      throw new AppError(404, '动态不存在');
    }

    // 检查是否已经点赞
    const existingLike = await db('likes')
      .where({
        user_id: userId,
        target_id: postId,
        target_type: 'post',
      })
      .first();

    if (existingLike) {
      throw new AppError(400, '已经点赞过该动态');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 创建点赞记录
      await trx('likes').insert({
        user_id: userId,
        target_id: postId,
        target_type: 'post',
      });

      // 更新动态的点赞数
      await trx('posts').where('id', postId).increment('like_count', 1);
    });
  }

  /**
   * 取消点赞动态
   */
  static async unlikePost(postId: string, userId: string): Promise<void> {
    // 检查是否已点赞
    const existingLike = await db('likes')
      .where({
        user_id: userId,
        target_id: postId,
        target_type: 'post',
      })
      .first();

    if (!existingLike) {
      throw new AppError(400, '未点赞该动态');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 删除点赞记录
      await trx('likes')
        .where({
          user_id: userId,
          target_id: postId,
          target_type: 'post',
        })
        .delete();

      // 更新动态的点赞数
      await trx('posts').where('id', postId).decrement('like_count', 1);
    });
  }

  /**
   * 获取动态的点赞列表
   */
  static async getPostLikes(
    postId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: any[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 获取点赞列表
    const likes = await db('likes')
      .where({
        target_id: postId,
        target_type: 'post',
      })
      .join('users', 'likes.user_id', 'users.id')
      .select(
        'users.id',
        'users.username',
        'users.nickname',
        'users.avatar',
        'likes.created_at'
      )
      .orderBy('likes.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('likes')
      .where({
        target_id: postId,
        target_type: 'post',
      })
      .count('* as count');

    return {
      items: likes,
      total: Number(count),
    };
  }

  /**
   * 检查是否是好友
   */
  private static async checkFriendship(userId1: string, userId2: string): Promise<boolean> {
    const friendship = await db('friendships')
      .where({
        user_id: userId1,
        friend_id: userId2,
        status: 'accepted',
      })
      .orWhere({
        user_id: userId2,
        friend_id: userId1,
        status: 'accepted',
      })
      .first();

    return !!friendship;
  }
}
