/**
 * Home Slice - 首页状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Feed, PaginationParams } from '@/types';
import { postApi } from '@/services/api';

interface HomeState {
  feeds: Feed[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: HomeState = {
  feeds: [],
  page: 1,
  pageSize: 10,
  total: 0,
  hasMore: true,
  loading: false,
  refreshing: false,
  error: null,
};

/**
 * 获取首页内容流（首次加载或刷新）
 */
export const fetchFeedsAsync = createAsyncThunk(
  'home/fetchFeeds',
  async (params: Partial<PaginationParams> = {}, { rejectWithValue }) => {
    try {
      const response = await postApi.getFeeds({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取内容失败');
    }
  }
);

/**
 * 加载更多内容
 */
export const loadMoreFeedsAsync = createAsyncThunk(
  'home/loadMoreFeeds',
  async (params: Partial<PaginationParams>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { home: HomeState };
      const { page, pageSize } = state.home;

      const response = await postApi.getFeeds({
        page: params.page || page + 1,
        pageSize: params.pageSize || pageSize,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '加载更多失败');
    }
  }
);

/**
 * 点赞动态
 */
export const likeFeedAsync = createAsyncThunk(
  'home/likeFeed',
  async (feedId: string, { rejectWithValue }) => {
    try {
      await postApi.likePost(feedId);
      return feedId;
    } catch (error: any) {
      return rejectWithValue(error.message || '点赞失败');
    }
  }
);

/**
 * 取消点赞
 */
export const unlikeFeedAsync = createAsyncThunk(
  'home/unlikeFeed',
  async (feedId: string, { rejectWithValue }) => {
    try {
      await postApi.unlikePost(feedId);
      return feedId;
    } catch (error: any) {
      return rejectWithValue(error.message || '取消点赞失败');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    /**
     * 重置状态
     */
    resetHomeState: () => initialState,

    /**
     * 清除错误
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * 更新单个 Feed
     */
    updateFeed: (state, action: PayloadAction<Feed>) => {
      const index = state.feeds.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.feeds[index] = action.payload;
      }
    },

    /**
     * 删除 Feed
     */
    removeFeed: (state, action: PayloadAction<string>) => {
      state.feeds = state.feeds.filter((f) => f.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // 获取首页内容流
    builder
      .addCase(fetchFeedsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.feeds = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.hasMore = action.payload.hasMore || false;
        state.error = null;
      })
      .addCase(fetchFeedsAsync.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      });

    // 加载更多
    builder
      .addCase(loadMoreFeedsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreFeedsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = [...state.feeds, ...action.payload.items];
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore || false;
        state.error = null;
      })
      .addCase(loadMoreFeedsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 点赞
    builder
      .addCase(likeFeedAsync.pending, (state, action) => {
        // 乐观更新 UI
        const feed = state.feeds.find((f) => f.id === action.meta.arg);
        if (feed) {
          feed.isLiked = true;
          feed.likeCount += 1;
        }
      })
      .addCase(likeFeedAsync.fulfilled, (state) => {
        // 已经在 pending 中更新了 UI
      })
      .addCase(likeFeedAsync.rejected, (state, action) => {
        // 失败时回滚
        const feed = state.feeds.find((f) => f.id === action.meta.arg);
        if (feed) {
          feed.isLiked = false;
          feed.likeCount -= 1;
        }
        state.error = action.payload as string;
      });

    // 取消点赞
    builder
      .addCase(unlikeFeedAsync.pending, (state, action) => {
        // 乐观更新 UI
        const feed = state.feeds.find((f) => f.id === action.meta.arg);
        if (feed) {
          feed.isLiked = false;
          feed.likeCount -= 1;
        }
      })
      .addCase(unlikeFeedAsync.fulfilled, (state) => {
        // 已经在 pending 中更新了 UI
      })
      .addCase(unlikeFeedAsync.rejected, (state, action) => {
        // 失败时回滚
        const feed = state.feeds.find((f) => f.id === action.meta.arg);
        if (feed) {
          feed.isLiked = true;
          feed.likeCount += 1;
        }
        state.error = action.payload as string;
      });
  },
});

export const { resetHomeState, clearError, updateFeed, removeFeed } =
  homeSlice.actions;

export default homeSlice.reducer;
