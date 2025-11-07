import bcrypt from 'bcrypt';
import { db, redisClient } from '../config/db';
import { User } from '../types';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  /**
   * 用户注册
   */
  static async register(data: {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    nickname: string;
  }): Promise<{ user: Partial<User>; tokens: { accessToken: string; refreshToken: string } }> {
    const { username, email, phone, password, nickname } = data;

    // 检查用户名是否已存在
    const existingUser = await db('users')
      .where('username', username)
      .orWhere((builder) => {
        if (email) builder.orWhere('email', email);
        if (phone) builder.orWhere('phone', phone);
      })
      .first();

    if (existingUser) {
      if (existingUser.username === username) {
        throw new AppError(409, '用户名已存在');
      }
      if (email && existingUser.email === email) {
        throw new AppError(409, '邮箱已被注册');
      }
      if (phone && existingUser.phone === phone) {
        throw new AppError(409, '手机号已被注册');
      }
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const [user] = await db('users')
      .insert({
        username,
        email,
        phone,
        password_hash: passwordHash,
        nickname,
        status: 'active',
      })
      .returning(['id', 'username', 'email', 'phone', 'nickname', 'avatar', 'created_at']);

    // 生成令牌
    const tokens = generateTokenPair(user.id, user.username);

    // 将刷新令牌存入 Redis（7天过期）
    await redisClient.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  /**
   * 用户登录
   */
  static async login(data: {
    identifier: string; // 用户名/邮箱/手机号
    password: string;
  }): Promise<{ user: Partial<User>; tokens: { accessToken: string; refreshToken: string } }> {
    const { identifier, password } = data;

    // 查找用户
    const user = await db('users')
      .where('username', identifier)
      .orWhere('email', identifier)
      .orWhere('phone', identifier)
      .first();

    if (!user) {
      throw new AppError(401, '用户名或密码错误');
    }

    // 检查用户状态
    if (user.status === 'banned') {
      throw new AppError(403, '账号已被封禁');
    }

    if (user.status === 'inactive') {
      throw new AppError(403, '账号未激活');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError(401, '用户名或密码错误');
    }

    // 更新最后登录时间
    await db('users').where('id', user.id).update({
      last_login_at: db.fn.now(),
    });

    // 生成令牌
    const tokens = generateTokenPair(user.id, user.username);

    // 将刷新令牌存入 Redis
    await redisClient.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    // 返回用户信息（不包含密码）
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * 刷新访问令牌
   */
  static async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // 验证刷新令牌
      const payload = verifyRefreshToken(refreshToken);

      // 检查 Redis 中的刷新令牌是否有效
      const storedToken = await redisClient.get(`refresh_token:${payload.id}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError(401, '刷新令牌无效或已过期');
      }

      // 检查用户是否存在
      const user = await db('users').where('id', payload.id).first();
      if (!user) {
        throw new AppError(401, '用户不存在');
      }

      if (user.status !== 'active') {
        throw new AppError(403, '账号状态异常');
      }

      // 生成新的令牌对
      const tokens = generateTokenPair(user.id, user.username);

      // 更新 Redis 中的刷新令牌
      await redisClient.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(401, '刷新令牌无效');
    }
  }

  /**
   * 用户登出
   */
  static async logout(userId: string): Promise<void> {
    // 删除 Redis 中的刷新令牌
    await redisClient.del(`refresh_token:${userId}`);

    // 删除在线状态
    await redisClient.del(`online:${userId}`);
  }

  /**
   * 修改密码
   */
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    // 获取用户
    const user = await db('users').where('id', userId).first();
    if (!user) {
      throw new AppError(404, '用户不存在');
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError(401, '原密码错误');
    }

    // 加密新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await db('users').where('id', userId).update({
      password_hash: newPasswordHash,
      updated_at: db.fn.now(),
    });

    // 删除所有刷新令牌，强制重新登录
    await redisClient.del(`refresh_token:${userId}`);
  }
}
