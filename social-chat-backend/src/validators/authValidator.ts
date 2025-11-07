import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .isString()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),

  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('邮箱格式不正确'),

  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确'),

  body('password')
    .isString()
    .isLength({ min: 6, max: 50 })
    .withMessage('密码长度必须在6-50个字符之间')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密码必须包含大小写字母和数字'),

  body('nickname')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('昵称长度必须在1-50个字符之间'),
];

export const loginValidator = [
  body('identifier')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('用户名/邮箱/手机号不能为空'),

  body('password')
    .isString()
    .notEmpty()
    .withMessage('密码不能为空'),
];

export const refreshTokenValidator = [
  body('refreshToken')
    .isString()
    .notEmpty()
    .withMessage('刷新令牌不能为空'),
];

export const changePasswordValidator = [
  body('oldPassword')
    .isString()
    .notEmpty()
    .withMessage('原密码不能为空'),

  body('newPassword')
    .isString()
    .isLength({ min: 6, max: 50 })
    .withMessage('新密码长度必须在6-50个字符之间')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('新密码必须包含大小写字母和数字'),
];
