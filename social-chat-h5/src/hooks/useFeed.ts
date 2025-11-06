/**
 * useFeed Hook - 首页内容流相关的自定义 Hook
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchFeedsAsync,
  loadMoreFeedsAsync,
  likeFeedAsync,
  unlikeFeedAsync,
  resetHomeState,
  clearError,
} from '@/store/slices/homeSlice';
import { SSDialog } from '@/components/SSDialog';

export function useFeed() {
  const dispatch = useAppDispatch();

  const { feeds, page, hasMore, loading, refreshing, error } = useAppSelector(
    (state) => state.home
  );

  /**
   * 初始化加载
   */
  useEffect(() => {
    if (feeds.length === 0 && !loading) {
      dispatch(fetchFeedsAsync({ page: 1, pageSize: 10 }));
    }
  }, []);

  /**
   * 刷新（下拉刷新）
   */
  const refresh = useCallback(async () => {
    try {
      await dispatch(fetchFeedsAsync({ page: 1, pageSize: 10 })).unwrap();
      return true;
    } catch (err: any) {
      SSDialog.toast(err || '刷新失败', 'error');
      return false;
    }
  }, [dispatch]);

  /**
   * 加载更多
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) {
      return false;
    }

    try {
      await dispatch(loadMoreFeedsAsync({ page: page + 1 })).unwrap();
      return true;
    } catch (err: any) {
      SSDialog.toast(err || '加载失败', 'error');
      return false;
    }
  }, [dispatch, hasMore, loading, page]);

  /**
   * 点赞/取消点赞
   */
  const toggleLike = useCallback(
    async (feedId: string, isLiked: boolean) => {
      try {
        if (isLiked) {
          await dispatch(unlikeFeedAsync(feedId)).unwrap();
        } else {
          await dispatch(likeFeedAsync(feedId)).unwrap();
        }
        return true;
      } catch (err: any) {
        SSDialog.toast(err || '操作失败', 'error');
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    dispatch(resetHomeState());
  }, [dispatch]);

  /**
   * 清除错误
   */
  const clearFeedError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    feeds,
    page,
    hasMore,
    loading,
    refreshing,
    error,
    refresh,
    loadMore,
    toggleLike,
    reset,
    clearFeedError,
  };
}
