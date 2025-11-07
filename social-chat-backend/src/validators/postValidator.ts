import { body, param, query } from 'express-validator';

export const createPostValidator = [
  body('type')
    .isString()
    .isIn(['text', 'image', 'video'])
    .withMessage('动态类型必须是 text、image 或 video'),

  body('content')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('内容不能超过 5000 个字符'),

  body('images')
    .optional()
    .isArray()
    .withMessage('图片必须是数组格式'),

  body('images.*')
    .optional()
    .isURL()
    .withMessage('图片必须是有效的 URL'),

  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('视频链接必须是有效的 URL'),

  body('visibility')
    .optional()
    .isString()
    .isIn(['public', 'friends', 'private'])
    .withMessage('可见性必须是 public、friends 或 private'),

  body('locationName')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('位置名称不能超过 100 个字符'),

  body('locationLat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('纬度必须在 -90 到 90 之间'),

  body('locationLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('经度必须在 -180 到 180 之间'),
];

export const updatePostValidator = [
  body('content')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('内容不能超过 5000 个字符'),

  body('visibility')
    .optional()
    .isString()
    .isIn(['public', 'friends', 'private'])
    .withMessage('可见性必须是 public、friends 或 private'),
];

export const postIdValidator = [
  param('id').isUUID().withMessage('动态 ID 格式不正确'),
];

export const userIdParamValidator = [
  param('userId').isUUID().withMessage('用户 ID 格式不正确'),
];
