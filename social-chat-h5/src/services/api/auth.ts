/**
 * Auth API - 认证相关接口
 * 与后端 Swagger 文档保持一致
 */

import { get, post } from '../request';
import type { LoginParams, RegisterParams, LoginResponse, User } from '@/types';

/**
 * 登录
 * POST /api/auth/login
 * 使用 identifier（用户名/邮箱/手机号）和密码登录
 */
export function login(params: LoginParams): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/login', params);
}

/**
 * 注册
 * POST /api/auth/register
 * 创建新用户账号
 */
export function register(params: RegisterParams): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/register', params);
}

/**
 * 退出登录
 * POST /api/auth/logout
 * 退出登录，清除 token
 */
export function logout(): Promise<void> {
  return post<void>('/auth/logout');
}

// ==================== 以下接口后端暂未实现 ====================
// TODO: 等待后端实现以下接口

/**
 * 刷新 token
 * POST /api/auth/refresh-token
 * ⚠️ 注意：后端接口路径可能是 /auth/refresh-token
 */
export function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  return post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', { refreshToken });
}

/**
 * 获取当前用户信息
 * GET /api/auth/me
 * ⚠️ 后端暂未实现此接口，建议使用 GET /api/users/{userId}
 */
export function getCurrentUser(): Promise<User> {
  // 临时方案：如果后端没有 /auth/me，可以使用用户ID查询
  // const userId = SSStorageUtil.get('user_id');
  // return get<User>(`/users/${userId}`);
  return get<User>('/auth/me');
}

/**
 * 修改密码
 * POST /api/auth/change-password
 * ⚠️ 后端暂未实现此接口
 */
export function changePassword(params: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  return post<void>('/auth/change-password', params);
}

/**
 * 发送验证码（用于注册/找回密码）
 * POST /api/auth/send-code
 * ⚠️ 后端暂未实现此接口
 */
export function sendVerifyCode(params: {
  type: 'email' | 'phone';
  target: string;
  purpose: 'register' | 'reset_password';
}): Promise<void> {
  return post<void>('/auth/send-code', params);
}

/**
 * 重置密码
 * POST /api/auth/reset-password
 * ⚠️ 后端暂未实现此接口
 */
export function resetPassword(params: {
  username: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  return post<void>('/auth/reset-password', params);
}
