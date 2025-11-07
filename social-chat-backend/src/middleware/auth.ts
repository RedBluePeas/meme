import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types';
import config from '../config';

/**
 * JWT 认证中间件
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // 从 header 中获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        code: 401,
        message: '未提供认证令牌',
      });
      return;
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证 token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // 检查 token 类型
    if (decoded.type !== 'access') {
      res.status(401).json({
        code: 401,
        message: '无效的令牌类型',
      });
      return;
    }

    // 将用户信息附加到请求对象
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        code: 401,
        message: '令牌已过期',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        code: 401,
        message: '无效的令牌',
      });
      return;
    }

    res.status(500).json({
      code: 500,
      message: '认证失败',
    });
  }
};

/**
 * 可选认证中间件（token 可有可无）
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      if (decoded.type === 'access') {
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    // 忽略认证错误，继续执行
    next();
  }
};
