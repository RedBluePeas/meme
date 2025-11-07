import { param, query } from 'express-validator';

export const notificationIdValidator = [
  param('notificationId')
    .isUUID()
    .withMessage('通知 ID 格式不正确'),
];

export const notificationQueryValidator = [
  query('unreadOnly')
    .optional()
    .isBoolean()
    .withMessage('unreadOnly 必须是布尔值'),
];
