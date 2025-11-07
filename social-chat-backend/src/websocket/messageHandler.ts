import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { MessageService } from '../services/messageService';
import { db } from '../config/db';
import logger from '../utils/logger';

interface AuthSocket extends Socket {
  userId?: string;
  username?: string;
}

// 存储用户的 socket 连接
const userSockets = new Map<string, string>(); // userId -> socketId

/**
 * 初始化消息 WebSocket 处理
 */
export function initializeMessageHandler(io: Server): void {
  // 认证中间件
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('认证失败：缺少 token'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      socket.username = decoded.username;

      next();
    } catch (error) {
      logger.error('Socket 认证失败', error);
      next(new Error('认证失败：token 无效'));
    }
  });

  // 处理连接
  io.on('connection', async (socket: AuthSocket) => {
    const userId = socket.userId!;
    logger.info(`用户 ${userId} 已连接 WebSocket`);

    // 保存用户的 socket 连接
    userSockets.set(userId, socket.id);

    // 更新用户在线状态
    await updateUserOnlineStatus(userId, true);

    // 加入用户的所有会话房间
    await joinUserConversations(socket, userId);

    // 发送在线事件给好友
    await notifyFriendsOnlineStatus(io, userId, true);

    // 监听加入会话房间
    socket.on('join-conversation', async (conversationId: string) => {
      try {
        // 验证用户是否是会话成员
        const member = await db('conversation_members')
          .where({
            conversation_id: conversationId,
            user_id: userId,
          })
          .first();

        if (member) {
          socket.join(`conversation:${conversationId}`);
          logger.info(`用户 ${userId} 加入会话 ${conversationId}`);
        }
      } catch (error) {
        logger.error('加入会话失败', error);
        socket.emit('error', { message: '加入会话失败' });
      }
    });

    // 监听离开会话房间
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`用户 ${userId} 离开会话 ${conversationId}`);
    });

    // 监听发送消息
    socket.on('send-message', async (data: {
      conversationId: string;
      type: 'text' | 'image' | 'video' | 'file' | 'audio';
      content?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      duration?: number;
      replyTo?: string;
    }) => {
      try {
        const message = await MessageService.sendMessage({
          conversationId: data.conversationId,
          senderId: userId,
          type: data.type,
          content: data.content,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          duration: data.duration,
          replyTo: data.replyTo,
        });

        // 向会话中的所有成员广播新消息
        io.to(`conversation:${data.conversationId}`).emit('new-message', message);

        // 获取会话成员（除了发送者）
        const members = await db('conversation_members')
          .where('conversation_id', data.conversationId)
          .andWhere('user_id', '!=', userId)
          .select('user_id');

        // 向离线用户发送推送通知（这里可以集成推送服务）
        for (const member of members) {
          if (!userSockets.has(member.user_id)) {
            // TODO: 发送推送通知
            logger.info(`用户 ${member.user_id} 离线，需要发送推送通知`);
          }
        }

        logger.info(`用户 ${userId} 在会话 ${data.conversationId} 发送消息`);
      } catch (error: any) {
        logger.error('发送消息失败', error);
        socket.emit('error', { message: error.message || '发送消息失败' });
      }
    });

    // 监听标记已读
    socket.on('mark-as-read', async (conversationId: string) => {
      try {
        await MessageService.markAsRead(conversationId, userId);

        // 通知会话中的其他成员（用于显示已读状态）
        socket.to(`conversation:${conversationId}`).emit('message-read', {
          conversationId,
          userId,
        });

        logger.info(`用户 ${userId} 标记会话 ${conversationId} 已读`);
      } catch (error) {
        logger.error('标记已读失败', error);
        socket.emit('error', { message: '标记已读失败' });
      }
    });

    // 监听正在输入
    socket.on('typing', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        conversationId,
        userId,
        username: socket.username,
      });
    });

    // 监听停止输入
    socket.on('stop-typing', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user-stop-typing', {
        conversationId,
        userId,
      });
    });

    // 监听断开连接
    socket.on('disconnect', async () => {
      logger.info(`用户 ${userId} 断开 WebSocket 连接`);

      // 移除用户的 socket 连接
      userSockets.delete(userId);

      // 更新用户离线状态
      await updateUserOnlineStatus(userId, false);

      // 通知好友离线
      await notifyFriendsOnlineStatus(io, userId, false);
    });
  });
}

/**
 * 加入用户的所有会话房间
 */
async function joinUserConversations(socket: AuthSocket, userId: string): Promise<void> {
  try {
    const conversations = await db('conversation_members')
      .where('user_id', userId)
      .select('conversation_id');

    for (const conv of conversations) {
      socket.join(`conversation:${conv.conversation_id}`);
    }

    logger.info(`用户 ${userId} 加入 ${conversations.length} 个会话房间`);
  } catch (error) {
    logger.error('加入会话房间失败', error);
  }
}

/**
 * 更新用户在线状态
 */
async function updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
  try {
    await db('users')
      .where('id', userId)
      .update({
        is_online: isOnline,
        last_seen_at: db.fn.now(),
      });
  } catch (error) {
    logger.error('更新在线状态失败', error);
  }
}

/**
 * 通知好友在线状态变化
 */
async function notifyFriendsOnlineStatus(io: Server, userId: string, isOnline: boolean): Promise<void> {
  try {
    // 获取用户的所有好友
    const friends = await db('friendships')
      .where(function() {
        this.where('user_id', userId).orWhere('friend_id', userId);
      })
      .andWhere('status', 'accepted')
      .select('user_id', 'friend_id');

    // 向在线的好友发送状态变化通知
    for (const friendship of friends) {
      const friendId = friendship.user_id === userId ? friendship.friend_id : friendship.user_id;
      const friendSocketId = userSockets.get(friendId);

      if (friendSocketId) {
        io.to(friendSocketId).emit('friend-status-change', {
          userId,
          isOnline,
        });
      }
    }
  } catch (error) {
    logger.error('通知好友在线状态失败', error);
  }
}

/**
 * 获取在线用户列表
 */
export function getOnlineUsers(): string[] {
  return Array.from(userSockets.keys());
}

/**
 * 检查用户是否在线
 */
export function isUserOnline(userId: string): boolean {
  return userSockets.has(userId);
}

/**
 * 向指定用户发送消息
 */
export function sendToUser(io: Server, userId: string, event: string, data: any): void {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
}
