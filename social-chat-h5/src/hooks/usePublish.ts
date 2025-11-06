/**
 * usePublish Hook - 发布相关的自定义 Hook
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  updateDraftContent,
  addDraftImages,
  removeDraftImage,
  setDraftVideo,
  clearDraftVideo,
  addDraftTopic,
  removeDraftTopic,
  setDraftLocation,
  clearDraftLocation,
  setDraftVisibility,
  resetDraft,
  clearError,
  uploadImagesAsync,
  uploadVideoAsync,
  publishPostAsync,
} from '@/store/slices/publishSlice';
import type { CreatePostParams } from '@/types';
import { SSDialog } from '@/components/SSDialog';

export function usePublish() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    draft,
    uploading,
    uploadProgress,
    publishing,
    publishSuccess,
    publishedPost,
    error,
  } = useAppSelector((state) => state.publish);

  /**
   * 更新内容
   */
  const updateContent = useCallback(
    (content: string) => {
      dispatch(updateDraftContent(content));
    },
    [dispatch]
  );

  /**
   * 上传图片
   */
  const uploadImages = useCallback(
    async (files: File[]) => {
      try {
        await dispatch(uploadImagesAsync(files)).unwrap();
        return true;
      } catch (err: any) {
        SSDialog.toast.error(err || '上传失败');
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 删除图片
   */
  const removeImage = useCallback(
    (index: number) => {
      dispatch(removeDraftImage(index));
    },
    [dispatch]
  );

  /**
   * 上传视频
   */
  const uploadVideo = useCallback(
    async (file: File) => {
      try {
        await dispatch(uploadVideoAsync(file)).unwrap();
        return true;
      } catch (err: any) {
        SSDialog.toast.error(err || '上传失败');
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 清除视频
   */
  const removeVideo = useCallback(() => {
    dispatch(clearDraftVideo());
  }, [dispatch]);

  /**
   * 添加话题
   */
  const addTopic = useCallback(
    (topicId: string) => {
      dispatch(addDraftTopic(topicId));
    },
    [dispatch]
  );

  /**
   * 删除话题
   */
  const removeTopic = useCallback(
    (topicId: string) => {
      dispatch(removeDraftTopic(topicId));
    },
    [dispatch]
  );

  /**
   * 设置位置
   */
  const setLocation = useCallback(
    (location: { name: string; latitude?: number; longitude?: number }) => {
      dispatch(setDraftLocation(location));
    },
    [dispatch]
  );

  /**
   * 清除位置
   */
  const removeLocation = useCallback(() => {
    dispatch(clearDraftLocation());
  }, [dispatch]);

  /**
   * 设置可见性
   */
  const setVisibility = useCallback(
    (visibility: 'public' | 'friends' | 'private') => {
      dispatch(setDraftVisibility(visibility));
    },
    [dispatch]
  );

  /**
   * 发布
   */
  const publish = useCallback(
    async (type: 'text' | 'image' | 'video' = 'text') => {
      // 验证
      if (!draft.content.trim() && draft.images.length === 0 && !draft.video) {
        SSDialog.toast.error('请输入内容或上传媒体文件');
        return false;
      }

      const params: CreatePostParams = {
        content: draft.content,
        type,
        images: draft.images.length > 0 ? draft.images : undefined,
        video: draft.video,
        topics: draft.topics.length > 0 ? draft.topics : undefined,
        location: draft.location,
        visibility: draft.visibility,
      };

      try {
        await dispatch(publishPostAsync(params)).unwrap();
        SSDialog.toast.success('发布成功');
        // 跳转到首页或详情页
        navigate('/home');
        return true;
      } catch (err: any) {
        SSDialog.toast.error(err || '发布失败');
        return false;
      }
    },
    [dispatch, navigate, draft]
  );

  /**
   * 重置草稿
   */
  const reset = useCallback(() => {
    dispatch(resetDraft());
  }, [dispatch]);

  /**
   * 清除错误
   */
  const clearPublishError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    draft,
    uploading,
    uploadProgress,
    publishing,
    publishSuccess,
    publishedPost,
    error,
    updateContent,
    uploadImages,
    removeImage,
    uploadVideo,
    removeVideo,
    addTopic,
    removeTopic,
    setLocation,
    removeLocation,
    setVisibility,
    publish,
    reset,
    clearPublishError,
  };
}
