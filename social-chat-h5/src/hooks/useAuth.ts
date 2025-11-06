/**
 * useAuth Hook - 认证相关的自定义 Hook
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  loginAsync,
  registerAsync,
  logoutAsync,
  getCurrentUserAsync,
  clearError,
} from '@/store/slices/authSlice';
import type { LoginParams, RegisterParams } from '@/types';
import { SSDialog } from '@/components/SSDialog';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  /**
   * 登录
   */
  const login = useCallback(
    async (params: LoginParams) => {
      try {
        await dispatch(loginAsync(params)).unwrap();
        SSDialog.toast('登录成功', 'success');
        navigate('/home');
        return true;
      } catch (err: any) {
        SSDialog.toast(err || '登录失败', 'error');
        return false;
      }
    },
    [dispatch, navigate]
  );

  /**
   * 注册
   */
  const register = useCallback(
    async (params: RegisterParams) => {
      try {
        await dispatch(registerAsync(params)).unwrap();
        SSDialog.toast('注册成功', 'success');
        navigate('/home');
        return true;
      } catch (err: any) {
        SSDialog.toast(err || '注册失败', 'error');
        return false;
      }
    },
    [dispatch, navigate]
  );

  /**
   * 退出登录
   */
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      SSDialog.toast.success('已退出登录');
      navigate('/login');
      return true;
    } catch (err) {
      SSDialog.toast.error('退出失败');
      return false;
    }
  }, [dispatch, navigate]);

  /**
   * 刷新用户信息
   */
  const refreshUser = useCallback(async () => {
    try {
      await dispatch(getCurrentUserAsync()).unwrap();
      return true;
    } catch (err) {
      return false;
    }
  }, [dispatch]);

  /**
   * 清除错误信息
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearAuthError,
  };
}
