/**
 * Redux Store 配置
 */

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import homeReducer from './slices/homeSlice';

/**
 * 创建 Store
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    auth: authReducer,
    home: homeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

/**
 * RootState 类型
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch 类型
 */
export type AppDispatch = typeof store.dispatch;

/**
 * 类型化的 hooks
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
