/**
 * Auth API - 认证相关接口
 */

import { get, post } from '../request';
import type { LoginParams, RegisterParams, LoginResponse, User } from '@/types';

/**
 * 登录
 */
export function login(params: LoginParams): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/login', params);
}

/**
 * 注册
 */
export function register(params: RegisterParams): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/register', params);
}

/**
 * 退出登录
 */
export function logout(): Promise<void> {
  return post<void>('/auth/logout');
}

/**
 * 刷新 token
 */
export function refreshToken(refreshToken: string): Promise<{ token: string }> {
  return post<{ token: string }>('/auth/refresh', { refreshToken });
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): Promise<User> {
  return get<User>('/auth/me');
}

/**
 * 发送验证码（用于注册/找回密码）
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
 */
export function resetPassword(params: {
  username: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  return post<void>('/auth/reset-password', params);
}
