/**
 * User Slice - 用户状态管理
 * 管理用户登录状态、用户信息
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SSStorageUtil, StorageKeys } from '@/utils';

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

/**
 * 用户状态接口
 */
interface UserState {
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 用户Token */
  token: string | null;
  /** 用户信息 */
  userInfo: UserInfo | null;
  /** 是否正在加载 */
  loading: boolean;
}

/**
 * 初始状态
 */
const initialState: UserState = {
  isAuthenticated: !!SSStorageUtil.get(StorageKeys.USER_TOKEN),
  token: SSStorageUtil.get<string>(StorageKeys.USER_TOKEN),
  userInfo: SSStorageUtil.get<UserInfo>(StorageKeys.USER_INFO),
  loading: false
};

/**
 * User Slice
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * 设置登录状态
     */
    setAuth: (state, action: PayloadAction<{ token: string; userInfo: UserInfo }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;

      // 持久化到本地存储
      SSStorageUtil.set(StorageKeys.USER_TOKEN, action.payload.token, 7 * 24 * 3600);
      SSStorageUtil.set(StorageKeys.USER_INFO, action.payload.userInfo, 7 * 24 * 3600);
    },

    /**
     * 更新用户信息
     */
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
        SSStorageUtil.set(StorageKeys.USER_INFO, state.userInfo, 7 * 24 * 3600);
      }
    },

    /**
     * 退出登录
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null;

      // 清除本地存储
      SSStorageUtil.remove(StorageKeys.USER_TOKEN);
      SSStorageUtil.remove(StorageKeys.USER_INFO);
    },

    /**
     * 设置加载状态
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setAuth, updateUserInfo, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
