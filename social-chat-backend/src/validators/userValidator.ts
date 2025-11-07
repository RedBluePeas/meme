import { body, param, query } from 'express-validator';

export const updateUserValidator = [
  body('nickname')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('昵称长度必须在1-50个字符之间'),

  body('avatar')
    .optional()
    .isString()
    .isURL()
    .withMessage('头像必须是有效的URL'),

  body('bio')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('个人简介不能超过500个字符'),

  body('gender')
    .optional()
    .isString()
    .isIn(['male', 'female', 'other'])
    .withMessage('性别必须是male、female或other'),

  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('生日格式不正确'),

  body('location')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('位置不能超过100个字符'),

  body('website')
    .optional()
    .isString()
    .isURL()
    .withMessage('网站必须是有效的URL'),
];

export const userIdValidator = [
  param('userId')
    .isUUID()
    .withMessage('用户ID格式不正确'),
];

export const usernameValidator = [
  param('username')
    .isString()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50个字符之间'),
];

export const searchUsersValidator = [
  query('keyword')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('搜索关键词不能为空'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是正整数'),

  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须在1-100之间'),
];

export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是正整数'),

  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须在1-100之间'),
];
