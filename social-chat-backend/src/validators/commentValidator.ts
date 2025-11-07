import { body, param } from 'express-validator';

export const createCommentValidator = [
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('评论内容必须在 1-1000 个字符之间'),

  body('parentId')
    .optional()
    .isUUID()
    .withMessage('父评论 ID 格式不正确'),
];

export const postIdParamValidator = [
  param('postId').isUUID().withMessage('动态 ID 格式不正确'),
];

export const commentIdParamValidator = [
  param('commentId').isUUID().withMessage('评论 ID 格式不正确'),
];
