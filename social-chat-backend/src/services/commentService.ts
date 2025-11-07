import { db } from '../config/db';
import { Comment } from '../types';
import { AppError } from '../middleware/errorHandler';

export class CommentService {
  /**
   * 创建评论
   */
  static async createComment(data: {
    postId: string;
    userId: string;
    content: string;
    parentId?: string;
  }): Promise<Comment & { user: any }> {
    const { postId, userId, content, parentId } = data;

    // 检查动态是否存在
    const post = await db('posts').where('id', postId).first();
    if (!post) {
      throw new AppError(404, '动态不存在');
    }

    // 如果是回复，检查父评论是否存在
    if (parentId) {
      const parentComment = await db('comments')
        .where('id', parentId)
        .andWhere('post_id', postId)
        .first();

      if (!parentComment) {
        throw new AppError(404, '父评论不存在');
      }
    }

    // 开始事务
    return await db.transaction(async (trx) => {
      // 创建评论
      const [comment] = await trx('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
          parent_id: parentId,
        })
        .returning('*');

      // 更新动态的评论数
      await trx('posts').where('id', postId).increment('comment_count', 1);

      // 获取用户信息
      const user = await trx('users')
        .where('id', userId)
        .select('id', 'username', 'nickname', 'avatar')
        .first();

      return {
        ...comment,
        user,
      };
    });
  }

  /**
   * 获取动态的评论列表
   */
  static async getPostComments(
    postId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: (Comment & { user: any; replies?: any[] })[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 获取顶级评论（没有父评论的）
    const comments = await db('comments')
      .where('post_id', postId)
      .whereNull('parent_id')
      .join('users', 'comments.user_id', 'users.id')
      .select(
        'comments.*',
        'users.username',
        'users.nickname',
        'users.avatar'
      )
      .orderBy('comments.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取每个评论的回复（最多3条）
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await db('comments')
          .where('parent_id', comment.id)
          .join('users', 'comments.user_id', 'users.id')
          .select(
            'comments.*',
            'users.username',
            'users.nickname',
            'users.avatar'
          )
          .orderBy('comments.created_at', 'asc')
          .limit(3);

        // 获取回复总数
        const [{ count: replyCount }] = await db('comments')
          .where('parent_id', comment.id)
          .count('* as count');

        return {
          ...comment,
          user: {
            id: comment.user_id,
            username: comment.username,
            nickname: comment.nickname,
            avatar: comment.avatar,
          },
          replies: replies.map((reply) => ({
            ...reply,
            user: {
              id: reply.user_id,
              username: reply.username,
              nickname: reply.nickname,
              avatar: reply.avatar,
            },
          })),
          replyCount: Number(replyCount),
        };
      })
    );

    // 获取总数
    const [{ count }] = await db('comments')
      .where('post_id', postId)
      .whereNull('parent_id')
      .count('* as count');

    return {
      items: commentsWithReplies,
      total: Number(count),
    };
  }

  /**
   * 获取评论的回复列表
   */
  static async getCommentReplies(
    commentId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: (Comment & { user: any })[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 检查评论是否存在
    const comment = await db('comments').where('id', commentId).first();
    if (!comment) {
      throw new AppError(404, '评论不存在');
    }

    // 获取回复列表
    const replies = await db('comments')
      .where('parent_id', commentId)
      .join('users', 'comments.user_id', 'users.id')
      .select(
        'comments.*',
        'users.username',
        'users.nickname',
        'users.avatar'
      )
      .orderBy('comments.created_at', 'asc')
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('comments')
      .where('parent_id', commentId)
      .count('* as count');

    const processedReplies = replies.map((reply) => ({
      ...reply,
      user: {
        id: reply.user_id,
        username: reply.username,
        nickname: reply.nickname,
        avatar: reply.avatar,
      },
    }));

    return {
      items: processedReplies,
      total: Number(count),
    };
  }

  /**
   * 删除评论
   */
  static async deleteComment(commentId: string, userId: string): Promise<void> {
    // 检查评论是否存在
    const comment = await db('comments').where('id', commentId).first();
    if (!comment) {
      throw new AppError(404, '评论不存在');
    }

    // 检查是否是评论作者或动态作者
    const post = await db('posts').where('id', comment.post_id).first();
    if (comment.user_id !== userId && post?.user_id !== userId) {
      throw new AppError(403, '无权删除该评论');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 获取所有子评论数量
      const [{ count: childCount }] = await trx('comments')
        .where('parent_id', commentId)
        .count('* as count');

      // 删除评论及其所有回复
      await trx('comments').where('id', commentId).delete();
      await trx('comments').where('parent_id', commentId).delete();

      // 更新动态的评论数（包括子评论）
      const totalDeleted = 1 + Number(childCount);
      await trx('posts')
        .where('id', comment.post_id)
        .decrement('comment_count', totalDeleted);
    });
  }

  /**
   * 点赞评论
   */
  static async likeComment(commentId: string, userId: string): Promise<void> {
    // 检查评论是否存在
    const comment = await db('comments').where('id', commentId).first();
    if (!comment) {
      throw new AppError(404, '评论不存在');
    }

    // 检查是否已经点赞
    const existingLike = await db('likes')
      .where({
        user_id: userId,
        target_id: commentId,
        target_type: 'comment',
      })
      .first();

    if (existingLike) {
      throw new AppError(400, '已经点赞过该评论');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 创建点赞记录
      await trx('likes').insert({
        user_id: userId,
        target_id: commentId,
        target_type: 'comment',
      });

      // 更新评论的点赞数
      await trx('comments').where('id', commentId).increment('like_count', 1);
    });
  }

  /**
   * 取消点赞评论
   */
  static async unlikeComment(commentId: string, userId: string): Promise<void> {
    // 检查是否已点赞
    const existingLike = await db('likes')
      .where({
        user_id: userId,
        target_id: commentId,
        target_type: 'comment',
      })
      .first();

    if (!existingLike) {
      throw new AppError(400, '未点赞该评论');
    }

    // 开始事务
    await db.transaction(async (trx) => {
      // 删除点赞记录
      await trx('likes')
        .where({
          user_id: userId,
          target_id: commentId,
          target_type: 'comment',
        })
        .delete();

      // 更新评论的点赞数
      await trx('comments').where('id', commentId).decrement('like_count', 1);
    });
  }
}
