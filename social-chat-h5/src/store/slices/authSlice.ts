/**
 * Auth Slice - 认证状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginParams, RegisterParams, LoginResponse } from '@/types';
import { authApi } from '@/services/api';
import { SSStorageUtil } from '@/utils';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: SSStorageUtil.get('user_info') || null,
  token: SSStorageUtil.get('auth_token') || null,
  isAuthenticated: !!SSStorageUtil.get('auth_token'),
  loading: false,
  error: null,
};

/**
 * 登录异步 action
 */
export const loginAsync = createAsyncThunk<LoginResponse, LoginParams>(
  'auth/login',
  async (params, { rejectWithValue }) => {
    try {
      const response = await authApi.login(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

/**
 * 注册异步 action
 */
export const registerAsync = createAsyncThunk<LoginResponse, RegisterParams>(
  'auth/register',
  async (params, { rejectWithValue }) => {
    try {
      const response = await authApi.register(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '注册失败');
    }
  }
);

/**
 * 获取当前用户信息
 */
export const getCurrentUserAsync = createAsyncThunk<User>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  }
);

/**
 * 退出登录
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error: any) {
      // 即使退出接口失败，也清除本地数据
      console.error('Logout API failed:', error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * 更新用户信息
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        SSStorageUtil.set('user_info', state.user);
      }
    },

    /**
     * 清除错误
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * 清除认证信息（本地）
     */
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      SSStorageUtil.remove('auth_token');
      SSStorageUtil.remove('user_info');
    },
  },
  extraReducers: (builder) => {
    // 登录
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // 保存到本地存储
        SSStorageUtil.set('auth_token', action.payload.token);
        SSStorageUtil.set('user_info', action.payload.user);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 注册
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // 保存到本地存储
        SSStorageUtil.set('auth_token', action.payload.token);
        SSStorageUtil.set('user_info', action.payload.user);
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取当前用户信息
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        SSStorageUtil.set('user_info', action.payload);
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // 如果获取用户信息失败，清除认证状态
        state.isAuthenticated = false;
        SSStorageUtil.remove('auth_token');
        SSStorageUtil.remove('user_info');
      });

    // 退出登录
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        SSStorageUtil.remove('auth_token');
        SSStorageUtil.remove('user_info');
      })
      .addCase(logoutAsync.rejected, (state) => {
        // 即使失败也清除本地数据
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        SSStorageUtil.remove('auth_token');
        SSStorageUtil.remove('user_info');
      });
  },
});

export const { updateUser, clearError, clearAuth } = authSlice.actions;

export default authSlice.reducer;
