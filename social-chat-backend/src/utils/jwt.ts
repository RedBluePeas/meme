import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { JwtPayload } from '../types';

/**
 * 生成访问令牌
 */
export const generateAccessToken = (userId: string, username: string): string => {
  const payload = {
    id: userId,
    username,
    type: 'access',
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiration,
  } as SignOptions);
};

/**
 * 生成刷新令牌
 */
export const generateRefreshToken = (userId: string, username: string): string => {
  const payload = {
    id: userId,
    username,
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiration,
  } as SignOptions);
};

/**
 * 验证访问令牌
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

/**
 * 验证刷新令牌
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

/**
 * 生成令牌对
 */
export const generateTokenPair = (userId: string, username: string) => {
  return {
    accessToken: generateAccessToken(userId, username),
    refreshToken: generateRefreshToken(userId, username),
  };
};
