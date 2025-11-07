import { body, param, query } from 'express-validator';

export const sendFriendRequestValidator = [
  body('friendId')
    .isUUID()
    .withMessage('好友 ID 格式不正确'),

  body('remark')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('备注不能超过 50 个字符'),
];

export const friendshipIdValidator = [
  param('friendshipId')
    .isUUID()
    .withMessage('好友关系 ID 格式不正确'),
];

export const friendIdValidator = [
  param('friendId')
    .isUUID()
    .withMessage('好友 ID 格式不正确'),
];

export const updateFriendRemarkValidator = [
  body('remark')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('备注不能超过 50 个字符'),

  body('groupName')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('分组名称不能超过 50 个字符'),
];

export const friendRequestTypeValidator = [
  query('type')
    .optional()
    .isString()
    .isIn(['received', 'sent'])
    .withMessage('类型必须是 received 或 sent'),
];
