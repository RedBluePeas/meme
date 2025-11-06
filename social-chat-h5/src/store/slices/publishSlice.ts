/**
 * Publish Slice - 发布状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CreatePostParams, Post } from '@/types';
import { postApi, uploadApi } from '@/services/api';

interface PublishState {
  // 草稿数据
  draft: {
    content: string;
    images: string[];
    video?: string;
    topics: string[];
    location?: {
      name: string;
      latitude?: number;
      longitude?: number;
    };
    visibility: 'public' | 'friends' | 'private';
  };

  // 上传状态
  uploading: boolean;
  uploadProgress: number;

  // 发布状态
  publishing: boolean;
  publishSuccess: boolean;
  publishedPost: Post | null;

  // 错误信息
  error: string | null;
}

const initialState: PublishState = {
  draft: {
    content: '',
    images: [],
    topics: [],
    visibility: 'public',
  },
  uploading: false,
  uploadProgress: 0,
  publishing: false,
  publishSuccess: false,
  publishedPost: null,
  error: null,
};

/**
 * 上传图片
 */
export const uploadImagesAsync = createAsyncThunk(
  'publish/uploadImages',
  async (files: File[], { rejectWithValue }) => {
    try {
      const urls = await uploadApi.uploadImages(files, (progress) => {
        // 可以在这里更新上传进度
      });
      return urls;
    } catch (error: any) {
      return rejectWithValue(error.message || '图片上传失败');
    }
  }
);

/**
 * 上传视频
 */
export const uploadVideoAsync = createAsyncThunk(
  'publish/uploadVideo',
  async (file: File, { rejectWithValue }) => {
    try {
      const result = await uploadApi.uploadVideo(file, (progress) => {
        // 可以在这里更新上传进度
      });
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || '视频上传失败');
    }
  }
);

/**
 * 发布动态
 */
export const publishPostAsync = createAsyncThunk(
  'publish/publishPost',
  async (params: CreatePostParams, { rejectWithValue }) => {
    try {
      const post = await postApi.createPost(params);
      return post;
    } catch (error: any) {
      return rejectWithValue(error.message || '发布失败');
    }
  }
);

const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    /**
     * 更新草稿内容
     */
    updateDraftContent: (state, action: PayloadAction<string>) => {
      state.draft.content = action.payload;
    },

    /**
     * 添加图片
     */
    addDraftImages: (state, action: PayloadAction<string[]>) => {
      state.draft.images = [...state.draft.images, ...action.payload];
    },

    /**
     * 删除图片
     */
    removeDraftImage: (state, action: PayloadAction<number>) => {
      state.draft.images.splice(action.payload, 1);
    },

    /**
     * 设置视频
     */
    setDraftVideo: (state, action: PayloadAction<string>) => {
      state.draft.video = action.payload;
    },

    /**
     * 清除视频
     */
    clearDraftVideo: (state) => {
      state.draft.video = undefined;
    },

    /**
     * 添加话题
     */
    addDraftTopic: (state, action: PayloadAction<string>) => {
      if (!state.draft.topics.includes(action.payload)) {
        state.draft.topics.push(action.payload);
      }
    },

    /**
     * 删除话题
     */
    removeDraftTopic: (state, action: PayloadAction<string>) => {
      state.draft.topics = state.draft.topics.filter((t) => t !== action.payload);
    },

    /**
     * 设置位置
     */
    setDraftLocation: (
      state,
      action: PayloadAction<{
        name: string;
        latitude?: number;
        longitude?: number;
      }>
    ) => {
      state.draft.location = action.payload;
    },

    /**
     * 清除位置
     */
    clearDraftLocation: (state) => {
      state.draft.location = undefined;
    },

    /**
     * 设置可见性
     */
    setDraftVisibility: (
      state,
      action: PayloadAction<'public' | 'friends' | 'private'>
    ) => {
      state.draft.visibility = action.payload;
    },

    /**
     * 重置草稿
     */
    resetDraft: (state) => {
      state.draft = initialState.draft;
      state.publishSuccess = false;
      state.publishedPost = null;
    },

    /**
     * 重置发布状态
     */
    resetPublishState: () => initialState,

    /**
     * 清除错误
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * 设置上传进度
     */
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 上传图片
    builder
      .addCase(uploadImagesAsync.pending, (state) => {
        state.uploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadImagesAsync.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.draft.images = [...state.draft.images, ...action.payload];
      })
      .addCase(uploadImagesAsync.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      });

    // 上传视频
    builder
      .addCase(uploadVideoAsync.pending, (state) => {
        state.uploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadVideoAsync.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.draft.video = action.payload.url;
      })
      .addCase(uploadVideoAsync.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      });

    // 发布动态
    builder
      .addCase(publishPostAsync.pending, (state) => {
        state.publishing = true;
        state.error = null;
      })
      .addCase(publishPostAsync.fulfilled, (state, action) => {
        state.publishing = false;
        state.publishSuccess = true;
        state.publishedPost = action.payload;
        // 发布成功后重置草稿
        state.draft = initialState.draft;
      })
      .addCase(publishPostAsync.rejected, (state, action) => {
        state.publishing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
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
  resetPublishState,
  clearError,
  setUploadProgress,
} = publishSlice.actions;

export default publishSlice.reducer;
