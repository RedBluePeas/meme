/**
 * useNotification Hook - 通知管理逻辑
 */

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchNotificationsAsync,
  fetchStatsAsync,
  markAsReadAsync,
  deleteNotificationAsync,
} from '@/store/slices/notificationSlice';
import { SSDialog } from '@/components/SSDialog';

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, hasMore, page, stats } = useAppSelector(
    (state) => state.notification
  );

  const loadNotifications = useCallback(
    async (refresh = false) => {
      const currentPage = refresh ? 1 : page + 1;
      if (!refresh && !hasMore) return;

      try {
        await dispatch(fetchNotificationsAsync({ page: currentPage, pageSize: 20 })).unwrap();
      } catch (error) {
        SSDialog.toast.error('加载失败');
      }
    },
    [dispatch, page, hasMore]
  );

  const loadStats = useCallback(async () => {
    try {
      await dispatch(fetchStatsAsync()).unwrap();
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  }, [dispatch]);

  const markAsRead = useCallback(
    async (notificationIds?: string[]) => {
      try {
        await dispatch(markAsReadAsync({ notificationIds })).unwrap();
      } catch (error) {
        SSDialog.toast.error('操作失败');
      }
    },
    [dispatch]
  );

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteNotificationAsync(id)).unwrap();
      } catch (error) {
        SSDialog.toast.error('删除失败');
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    notifications,
    loading,
    hasMore,
    stats,
    loadNotifications,
    loadStats,
    markAsRead,
    deleteNotification,
  };
};
