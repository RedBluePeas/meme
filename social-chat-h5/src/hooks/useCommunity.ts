/**
 * useCommunity Hook - 社区相关的自定义 Hook
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchTopicsAsync,
  loadMoreTopicsAsync,
  fetchRecommendTopicsAsync,
  fetchHotTopicsAsync,
  fetchTopicDetailAsync,
  fetchTopicPostsAsync,
  followTopicAsync,
  unfollowTopicAsync,
  setCurrentCategory,
  clearError,
} from '@/store/slices/communitySlice';
import { SSDialog } from '@/components/SSDialog';

export function useCommunity() {
  const dispatch = useAppDispatch();

  const {
    topics,
    page,
    hasMore,
    loading,
    recommendTopics,
    hotTopics,
    currentCategory,
    currentTopic,
    topicPosts,
    error,
  } = useAppSelector((state) => state.community);

  /**
   * 初始化加载
   */
  useEffect(() => {
    if (topics.length === 0 && !loading) {
      dispatch(fetchTopicsAsync({ page: 1, pageSize: 10 }));
    }
  }, []);

  /**
   * 刷新
   */
  const refresh = useCallback(async () => {
    try {
      await dispatch(fetchTopicsAsync({ page: 1, pageSize: 10 })).unwrap();
      return true;
    } catch (err: any) {
      SSDialog.toast.error(err || '刷新失败');
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
      await dispatch(loadMoreTopicsAsync({ page: page + 1 })).unwrap();
      return true;
    } catch (err: any) {
      SSDialog.toast.error(err || '加载失败');
      return false;
    }
  }, [dispatch, hasMore, loading, page]);

  /**
   * 切换分类
   */
  const changeCategory = useCallback(
    async (category: string | null) => {
      dispatch(setCurrentCategory(category));
      try {
        await dispatch(fetchTopicsAsync({ page: 1, category: category || undefined })).unwrap();
        return true;
      } catch (err: any) {
        SSDialog.toast.error(err || '加载失败');
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 关注/取消关注话题
   */
  const toggleFollow = useCallback(
    async (topicId: string, isFollowed: boolean) => {
      try {
        if (isFollowed) {
          await dispatch(unfollowTopicAsync(topicId)).unwrap();
        } else {
          await dispatch(followTopicAsync(topicId)).unwrap();
        }
        return true;
      } catch (err: any) {
        SSDialog.toast.error(err || '操作失败');
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 获取推荐话题
   */
  const fetchRecommendTopics = useCallback(async () => {
    try {
      await dispatch(fetchRecommendTopicsAsync()).unwrap();
      return true;
    } catch (err: any) {
      return false;
    }
  }, [dispatch]);

  /**
   * 获取热门话题
   */
  const fetchHotTopics = useCallback(async () => {
    try {
      await dispatch(fetchHotTopicsAsync()).unwrap();
      return true;
    } catch (err: any) {
      return false;
    }
  }, [dispatch]);

  /**
   * 获取话题详情
   */
  const fetchTopicDetail = useCallback(
    async (topicId: string) => {
      try {
        await dispatch(fetchTopicDetailAsync(topicId)).unwrap();
        return true;
      } catch (err: any) {
        SSDialog.toast.error(err || '加载失败');
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 获取话题下的帖子
   */
  const fetchTopicPosts = useCallback(
    async (topicId: string, sort: 'latest' | 'hot' = 'latest') => {
      try {
        await dispatch(fetchTopicPostsAsync({ topicId, sort })).unwrap();
        return true;
      } catch (err: any) {
        SSDialog.toast.error(err || '加载失败');
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 清除错误
   */
  const clearCommunityError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    topics,
    page,
    hasMore,
    loading,
    recommendTopics,
    hotTopics,
    currentCategory,
    currentTopic,
    topicPosts,
    error,
    refresh,
    loadMore,
    changeCategory,
    toggleFollow,
    fetchRecommendTopics,
    fetchHotTopics,
    fetchTopicDetail,
    fetchTopicPosts,
    clearCommunityError,
  };
}
