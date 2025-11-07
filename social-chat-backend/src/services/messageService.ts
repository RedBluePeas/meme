import { db } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class MessageService {
  /**
   * 获取或创建私聊会话
   */
  static async getOrCreatePrivateConversation(
    userId: string,
    targetUserId: string
  ): Promise<any> {
    // 不能和自己聊天
    if (userId === targetUserId) {
      throw new AppError(400, '不能和自己聊天');
    }

    // 检查目标用户是否存在
    const targetUser = await db('users').where('id', targetUserId).first();
    if (!targetUser) {
      throw new AppError(404, '用户不存在');
    }

    // 查找是否已存在会话
    const existingConversation = await db('conversation_members as cm1')
      .join('conversation_members as cm2', 'cm1.conversation_id', 'cm2.conversation_id')
      .join('conversations', 'cm1.conversation_id', 'conversations.id')
      .where('conversations.type', 'private')
      .andWhere('cm1.user_id', userId)
      .andWhere('cm2.user_id', targetUserId)
      .select('conversations.*')
      .first();

    if (existingConversation) {
      // 获取会话成员信息
      const members = await this.getConversationMembers(existingConversation.id);
      return {
        ...existingConversation,
        members,
      };
    }

    // 创建新会话
    return await db.transaction(async (trx) => {
      const [conversation] = await trx('conversations')
        .insert({
          type: 'private',
        })
        .returning('*');

      // 添加会话成员
      await trx('conversation_members').insert([
        {
          conversation_id: conversation.id,
          user_id: userId,
        },
        {
          conversation_id: conversation.id,
          user_id: targetUserId,
        },
      ]);

      // 获取会话成员信息
      const members = await trx('conversation_members')
        .where('conversation_id', conversation.id)
        .join('users', 'conversation_members.user_id', 'users.id')
        .select(
          'users.id',
          'users.username',
          'users.nickname',
          'users.avatar'
        );

      return {
        ...conversation,
        members,
      };
    });
  }

  /**
   * 创建群聊
   */
  static async createGroupConversation(
    userId: string,
    name: string,
    memberIds: string[]
  ): Promise<any> {
    // 验证成员数量
    if (memberIds.length < 2) {
      throw new AppError(400, '群聊至少需要3个成员（包括创建者）');
    }

    // 确保创建者在成员列表中
    const allMemberIds = Array.from(new Set([userId, ...memberIds]));

    // 验证所有成员是否存在
    const users = await db('users').whereIn('id', allMemberIds).select('id');
    if (users.length !== allMemberIds.length) {
      throw new AppError(400, '部分用户不存在');
    }

    return await db.transaction(async (trx) => {
      // 创建群聊
      const [conversation] = await trx('conversations')
        .insert({
          type: 'group',
          name,
          created_by: userId,
        })
        .returning('*');

      // 添加所有成员
      const members = allMemberIds.map((memberId) => ({
        conversation_id: conversation.id,
        user_id: memberId,
      }));

      await trx('conversation_members').insert(members);

      // 获取成员信息
      const memberInfo = await trx('conversation_members')
        .where('conversation_id', conversation.id)
        .join('users', 'conversation_members.user_id', 'users.id')
        .select(
          'users.id',
          'users.username',
          'users.nickname',
          'users.avatar'
        );

      return {
        ...conversation,
        members: memberInfo,
      };
    });
  }

  /**
   * 发送消息
   */
  static async sendMessage(data: {
    conversationId: string;
    senderId: string;
    type: 'text' | 'image' | 'video' | 'file' | 'audio';
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    replyTo?: string;
  }): Promise<any> {
    const {
      conversationId,
      senderId,
      type,
      content,
      fileUrl,
      fileName,
      fileSize,
      duration,
      replyTo,
    } = data;

    // 验证会话是否存在
    const conversation = await db('conversations').where('id', conversationId).first();
    if (!conversation) {
      throw new AppError(404, '会话不存在');
    }

    // 验证发送者是否是会话成员
    const member = await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: senderId,
      })
      .first();

    if (!member) {
      throw new AppError(403, '你不是该会话的成员');
    }

    // 验证消息内容
    if (type === 'text' && !content) {
      throw new AppError(400, '文本消息不能为空');
    }

    return await db.transaction(async (trx) => {
      // 创建消息
      const [message] = await trx('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          type,
          content,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          duration,
          reply_to: replyTo,
        })
        .returning('*');

      // 更新会话的最后消息
      await trx('conversations')
        .where('id', conversationId)
        .update({
          last_message_id: message.id,
          last_message_at: message.created_at,
          updated_at: trx.fn.now(),
        });

      // 更新其他成员的未读数
      await trx('conversation_members')
        .where('conversation_id', conversationId)
        .andWhere('user_id', '!=', senderId)
        .increment('unread_count', 1);

      // 获取发送者信息
      const sender = await trx('users')
        .where('id', senderId)
        .select('id', 'username', 'nickname', 'avatar')
        .first();

      return {
        ...message,
        sender,
      };
    });
  }

  /**
   * 获取会话列表
   */
  static async getConversations(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ items: any[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // 获取用户的会话列表
    const conversations = await db('conversation_members')
      .where('conversation_members.user_id', userId)
      .join('conversations', 'conversation_members.conversation_id', 'conversations.id')
      .leftJoin('messages', 'conversations.last_message_id', 'messages.id')
      .leftJoin('users as sender', 'messages.sender_id', 'sender.id')
      .select(
        'conversations.*',
        'conversation_members.unread_count',
        'conversation_members.is_muted',
        'conversation_members.is_pinned',
        'conversation_members.last_read_at',
        'messages.content as last_message_content',
        'messages.type as last_message_type',
        'sender.nickname as last_message_sender_nickname'
      )
      .orderBy('conversation_members.is_pinned', 'desc')
      .orderBy('conversations.last_message_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取每个会话的成员信息
    const conversationsWithMembers = await Promise.all(
      conversations.map(async (conv) => {
        const members = await this.getConversationMembers(conv.id);

        // 对于私聊，找到对方用户信息
        let otherUser = null;
        if (conv.type === 'private') {
          otherUser = members.find((m: any) => m.id !== userId);
        }

        return {
          ...conv,
          members,
          otherUser,
        };
      })
    );

    // 获取总数
    const [{ count }] = await db('conversation_members')
      .where('user_id', userId)
      .count('* as count');

    return {
      items: conversationsWithMembers,
      total: Number(count),
    };
  }

  /**
   * 获取消息列表
   */
  static async getMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<{ items: any[]; total: number }> {
    // 验证用户是否是会话成员
    const member = await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .first();

    if (!member) {
      throw new AppError(403, '你不是该会话的成员');
    }

    const offset = (page - 1) * pageSize;

    // 获取消息列表
    const messages = await db('messages')
      .where('conversation_id', conversationId)
      .join('users', 'messages.sender_id', 'users.id')
      .select(
        'messages.*',
        'users.username',
        'users.nickname',
        'users.avatar'
      )
      .orderBy('messages.created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db('messages')
      .where('conversation_id', conversationId)
      .count('* as count');

    // 反转顺序（从旧到新）
    const processedMessages = messages.reverse().map((msg) => ({
      ...msg,
      sender: {
        id: msg.sender_id,
        username: msg.username,
        nickname: msg.nickname,
        avatar: msg.avatar,
      },
    }));

    return {
      items: processedMessages,
      total: Number(count),
    };
  }

  /**
   * 标记消息已读
   */
  static async markAsRead(conversationId: string, userId: string): Promise<void> {
    // 验证用户是否是会话成员
    const member = await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .first();

    if (!member) {
      throw new AppError(403, '你不是该会话的成员');
    }

    // 更新未读数和最后阅读时间
    await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .update({
        unread_count: 0,
        last_read_at: db.fn.now(),
      });
  }

  /**
   * 删除会话（仅删除自己的会话记录）
   */
  static async deleteConversation(conversationId: string, userId: string): Promise<void> {
    // 验证用户是否是会话成员
    const member = await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .first();

    if (!member) {
      throw new AppError(403, '你不是该会话的成员');
    }

    // 删除会话成员记录
    await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .delete();

    // 检查是否还有其他成员
    const remainingMembers = await db('conversation_members')
      .where('conversation_id', conversationId)
      .count('* as count');

    // 如果没有成员了，删除整个会话
    if (Number(remainingMembers[0].count) === 0) {
      await db('conversations').where('id', conversationId).delete();
    }
  }

  /**
   * 置顶/取消置顶会话
   */
  static async togglePin(conversationId: string, userId: string): Promise<boolean> {
    const member = await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .first();

    if (!member) {
      throw new AppError(403, '你不是该会话的成员');
    }

    const newPinnedStatus = !member.is_pinned;

    await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .update({
        is_pinned: newPinnedStatus,
      });

    return newPinnedStatus;
  }

  /**
   * 静音/取消静音会话
   */
  static async toggleMute(conversationId: string, userId: string): Promise<boolean> {
    const member = await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .first();

    if (!member) {
      throw new AppError(403, '你不是该会话的成员');
    }

    const newMutedStatus = !member.is_muted;

    await db('conversation_members')
      .where({
        conversation_id: conversationId,
        user_id: userId,
      })
      .update({
        is_muted: newMutedStatus,
      });

    return newMutedStatus;
  }

  /**
   * 获取会话成员信息
   */
  private static async getConversationMembers(conversationId: string): Promise<any[]> {
    return await db('conversation_members')
      .where('conversation_id', conversationId)
      .join('users', 'conversation_members.user_id', 'users.id')
      .select(
        'users.id',
        'users.username',
        'users.nickname',
        'users.avatar'
      );
  }

  /**
   * 获取未读消息总数
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const result = await db('conversation_members')
      .where('user_id', userId)
      .sum('unread_count as total');

    return Number(result[0].total) || 0;
  }
}
