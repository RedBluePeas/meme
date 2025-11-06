/**
 * NotificationSlice - 通知模块状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationStats, MarkAsReadParams } from '@/types/models';
import { PaginationParams } from '@/types/api';
import { notificationApi } from '@/services/api';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  stats: NotificationStats;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  hasMore: true,
  page: 1,
  stats: {
    unreadCount: 0,
    unreadByType: {},
  },
};

export const fetchNotificationsAsync = createAsyncThunk(
  'notification/fetchNotifications',
  async (params: PaginationParams) => {
    return await notificationApi.getNotifications(params);
  }
);

export const fetchStatsAsync = createAsyncThunk('notification/fetchStats', async () => {
  return await notificationApi.getNotificationStats();
});

export const markAsReadAsync = createAsyncThunk(
  'notification/markAsRead',
  async (params?: MarkAsReadParams) => {
    await notificationApi.markAsRead(params);
    return params?.notificationIds;
  }
);

export const deleteNotificationAsync = createAsyncThunk(
  'notification/deleteNotification',
  async (id: string) => {
    await notificationApi.deleteNotification(id);
    return id;
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.stats.unreadCount++;
      }
    },
    resetNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { list, pagination } = action.payload;
        if (pagination.page === 1) {
          state.notifications = list;
        } else {
          state.notifications = [...state.notifications, ...list];
        }
        state.page = pagination.page;
        state.hasMore = pagination.hasMore;
      })
      .addCase(fetchNotificationsAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchStatsAsync.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const ids = action.payload;
        if (!ids) {
          state.notifications.forEach((n) => (n.isRead = true));
          state.stats.unreadCount = 0;
        } else {
          ids.forEach((id) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (notification && !notification.isRead) {
              notification.isRead = true;
              state.stats.unreadCount--;
            }
          });
        }
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.isRead) {
          state.stats.unreadCount--;
        }
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      });
  },
});

export const { addNotification, resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
