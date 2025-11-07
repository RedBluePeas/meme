import { body, param, query } from 'express-validator';

export const createPrivateConversationValidator = [
  body('targetUserId')
    .isUUID()
    .withMessage('目标用户 ID 格式不正确'),
];

export const createGroupConversationValidator = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('群聊名称不能为空')
    .isLength({ min: 1, max: 100 })
    .withMessage('群聊名称长度必须在 1-100 个字符之间'),

  body('memberIds')
    .isArray({ min: 2 })
    .withMessage('群聊至少需要 2 个成员（不包括创建者）'),

  body('memberIds.*')
    .isUUID()
    .withMessage('成员 ID 格式不正确'),
];

export const sendMessageValidator = [
  param('conversationId')
    .isUUID()
    .withMessage('会话 ID 格式不正确'),

  body('type')
    .isString()
    .isIn(['text', 'image', 'video', 'file', 'audio'])
    .withMessage('消息类型必须是 text, image, video, file 或 audio'),

  body('content')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('消息内容不能超过 5000 个字符'),

  body('fileUrl')
    .optional()
    .isString()
    .trim()
    .isURL()
    .withMessage('文件 URL 格式不正确'),

  body('fileName')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 255 })
    .withMessage('文件名不能超过 255 个字符'),

  body('fileSize')
    .optional()
    .isInt({ min: 0 })
    .withMessage('文件大小必须是非负整数'),

  body('duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('时长必须是非负整数'),

  body('replyTo')
    .optional()
    .isUUID()
    .withMessage('回复消息 ID 格式不正确'),
];

export const conversationIdValidator = [
  param('conversationId')
    .isUUID()
    .withMessage('会话 ID 格式不正确'),
];

export const conversationPaginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是大于 0 的整数'),

  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须是 1-100 之间的整数'),
];
