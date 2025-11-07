import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  changePasswordValidator,
} from '../validators/authValidator';

const router = Router();

// 注册
router.post(
  '/register',
  registerValidator,
  validate,
  async (req, res, next) => {
    try {
      await AuthController.register(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 登录
router.post(
  '/login',
  loginValidator,
  validate,
  async (req, res, next) => {
    try {
      await AuthController.login(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 刷新令牌
router.post(
  '/refresh-token',
  refreshTokenValidator,
  validate,
  async (req, res, next) => {
    try {
      await AuthController.refreshToken(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 登出（需要认证）
router.post(
  '/logout',
  authenticate,
  async (req, res, next) => {
    try {
      await AuthController.logout(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 修改密码（需要认证）
router.post(
  '/change-password',
  authenticate,
  changePasswordValidator,
  validate,
  async (req, res, next) => {
    try {
      await AuthController.changePassword(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取当前用户信息（需要认证）
router.get(
  '/me',
  authenticate,
  async (req, res, next) => {
    try {
      await AuthController.getCurrentUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
