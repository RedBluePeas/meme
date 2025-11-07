import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  createPrivateConversationValidator,
  createGroupConversationValidator,
  sendMessageValidator,
  conversationIdValidator,
  conversationPaginationValidator,
} from '../validators/messageValidator';

const router = Router();

// 所有消息相关路由都需要认证
router.use(authenticate);

// 获取或创建私聊会话
router.post(
  '/conversations/private',
  createPrivateConversationValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.getOrCreatePrivateConversation(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 创建群聊
router.post(
  '/conversations/group',
  createGroupConversationValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.createGroupConversation(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取会话列表
router.get(
  '/conversations',
  conversationPaginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.getConversations(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 删除会话
router.delete(
  '/conversations/:conversationId',
  conversationIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.deleteConversation(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 置顶/取消置顶会话
router.post(
  '/conversations/:conversationId/pin',
  conversationIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.togglePin(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 静音/取消静音会话
router.post(
  '/conversations/:conversationId/mute',
  conversationIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.toggleMute(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取消息列表
router.get(
  '/conversations/:conversationId/messages',
  conversationIdValidator,
  conversationPaginationValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.getMessages(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 发送消息
router.post(
  '/conversations/:conversationId/messages',
  sendMessageValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.sendMessage(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 标记消息已读
router.post(
  '/conversations/:conversationId/read',
  conversationIdValidator,
  validate,
  async (req, res, next) => {
    try {
      await MessageController.markAsRead(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取未读消息总数
router.get(
  '/unread-count',
  async (req, res, next) => {
    try {
      await MessageController.getUnreadCount(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
