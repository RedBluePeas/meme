/**
 * App Slice - 应用全局状态管理
 * 管理主题、语言、网络状态等全局配置
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SSStorageUtil, StorageKeys } from '@/utils';

/**
 * 主题类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'zh-TW' | 'en-US';

/**
 * 应用状态接口
 */
interface AppState {
  /** 主题模式 */
  theme: ThemeMode;
  /** 语言 */
  language: Language;
  /** 是否在线 */
  isOnline: boolean;
  /** 是否显示TabBar */
  showTabBar: boolean;
}

/**
 * 初始状态
 */
const initialState: AppState = {
  theme: SSStorageUtil.get<ThemeMode>(StorageKeys.APP_THEME) || 'auto',
  language: SSStorageUtil.get<Language>(StorageKeys.APP_LANGUAGE) || 'zh-CN',
  isOnline: navigator.onLine,
  showTabBar: true
};

/**
 * App Slice
 */
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    /**
     * 设置主题
     */
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      SSStorageUtil.set(StorageKeys.APP_THEME, action.payload);

      // 应用主题到 DOM
      const root = document.documentElement;
      if (action.payload === 'dark') {
        root.classList.add('dark');
      } else if (action.payload === 'light') {
        root.classList.remove('dark');
      } else {
        // auto: 跟随系统
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    },

    /**
     * 设置语言
     */
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      SSStorageUtil.set(StorageKeys.APP_LANGUAGE, action.payload);
    },

    /**
     * 设置在线状态
     */
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    /**
     * 设置TabBar显示状态
     */
    setShowTabBar: (state, action: PayloadAction<boolean>) => {
      state.showTabBar = action.payload;
    }
  }
});

export const { setTheme, setLanguage, setOnlineStatus, setShowTabBar } = appSlice.actions;
export default appSlice.reducer;
