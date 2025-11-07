import { Response } from 'express';
import { AuthRequest } from '../types';
import { MessageService } from '../services/messageService';
import { success, paginated } from '../utils/response';

export class MessageController {
  /**
   * 获取或创建私聊会话
   */
  static async getOrCreatePrivateConversation(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { targetUserId } = req.body;

    const conversation = await MessageService.getOrCreatePrivateConversation(userId, targetUserId);

    success(res, { conversation });
  }

  /**
   * 创建群聊
   */
  static async createGroupConversation(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { name, memberIds } = req.body;

    const conversation = await MessageService.createGroupConversation(userId, name, memberIds);

    success(res, { conversation }, '群聊创建成功', 201);
  }

  /**
   * 发送消息
   */
  static async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { conversationId } = req.params;
    const { type, content, fileUrl, fileName, fileSize, duration, replyTo } = req.body;

    const message = await MessageService.sendMessage({
      conversationId,
      senderId: userId,
      type,
      content,
      fileUrl,
      fileName,
      fileSize,
      duration,
      replyTo,
    });

    success(res, { message }, '发送成功', 201);
  }

  /**
   * 获取会话列表
   */
  static async getConversations(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await MessageService.getConversations(userId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 获取消息列表
   */
  static async getMessages(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { conversationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const result = await MessageService.getMessages(conversationId, userId, page, pageSize);

    paginated(res, result.items, result.total, page, pageSize);
  }

  /**
   * 标记消息已读
   */
  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    await MessageService.markAsRead(conversationId, userId);

    success(res, undefined, '已标记为已读');
  }

  /**
   * 删除会话
   */
  static async deleteConversation(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    await MessageService.deleteConversation(conversationId, userId);

    success(res, undefined, '删除成功');
  }

  /**
   * 置顶/取消置顶会话
   */
  static async togglePin(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    const isPinned = await MessageService.togglePin(conversationId, userId);

    success(res, { isPinned }, isPinned ? '已置顶' : '已取消置顶');
  }

  /**
   * 静音/取消静音会话
   */
  static async toggleMute(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    const isMuted = await MessageService.toggleMute(conversationId, userId);

    success(res, { isMuted }, isMuted ? '已静音' : '已取消静音');
  }

  /**
   * 获取未读消息总数
   */
  static async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const count = await MessageService.getUnreadCount(userId);

    success(res, { count });
  }
}
