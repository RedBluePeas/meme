import { Response } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { success } from '../utils/response';

export class AuthController {
  /**
   * 用户注册
   */
  static async register(req: AuthRequest, res: Response): Promise<void> {
    const { username, email, phone, password, nickname } = req.body;

    const result = await AuthService.register({
      username,
      email,
      phone,
      password,
      nickname,
    });

    success(res, result, '注册成功', 201);
  }

  /**
   * 用户登录
   */
  static async login(req: AuthRequest, res: Response): Promise<void> {
    const { identifier, password } = req.body;

    const result = await AuthService.login({
      identifier,
      password,
    });

    success(res, result, '登录成功');
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    const tokens = await AuthService.refreshToken(refreshToken);

    success(res, tokens, '令牌刷新成功');
  }

  /**
   * 用户登出
   */
  static async logout(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    await AuthService.logout(userId);

    success(res, undefined, '登出成功');
  }

  /**
   * 修改密码
   */
  static async changePassword(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { oldPassword, newPassword } = req.body;

    await AuthService.changePassword(userId, oldPassword, newPassword);

    success(res, undefined, '密码修改成功');
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const user = await UserService.getUserById(userId);

    success(res, { user }, '获取成功');
  }
}
