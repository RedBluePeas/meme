/**
 * Community Slice - 社区状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Topic, TopicCategory, Post, PaginationParams } from '@/types';
import { topicApi } from '@/services/api';

interface CommunityState {
  // 话题列表
  topics: Topic[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;

  // 推荐话题
  recommendTopics: Topic[];

  // 热门话题
  hotTopics: Topic[];

  // 我关注的话题
  followedTopics: Topic[];

  // 话题分类
  categories: TopicCategory[];

  // 当前选中的分类
  currentCategory: string | null;

  // 当前话题详情
  currentTopic: Topic | null;

  // 话题下的帖子
  topicPosts: {
    [topicId: string]: {
      posts: Post[];
      page: number;
      hasMore: boolean;
    };
  };

  // 加载状态
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  topics: [],
  page: 1,
  pageSize: 10,
  total: 0,
  hasMore: true,

  recommendTopics: [],
  hotTopics: [],
  followedTopics: [],
  categories: [],

  currentCategory: null,
  currentTopic: null,
  topicPosts: {},

  loading: false,
  refreshing: false,
  error: null,
};

/**
 * 获取话题列表
 */
export const fetchTopicsAsync = createAsyncThunk(
  'community/fetchTopics',
  async (
    params: Partial<PaginationParams> & { category?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await topicApi.getTopics({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        category: params.category,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取话题列表失败');
    }
  }
);

/**
 * 加载更多话题
 */
export const loadMoreTopicsAsync = createAsyncThunk(
  'community/loadMoreTopics',
  async (params: Partial<PaginationParams>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { community: CommunityState };
      const { page, pageSize, currentCategory } = state.community;

      const response = await topicApi.getTopics({
        page: params.page || page + 1,
        pageSize: params.pageSize || pageSize,
        category: currentCategory || undefined,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '加载更多失败');
    }
  }
);

/**
 * 获取推荐话题
 */
export const fetchRecommendTopicsAsync = createAsyncThunk(
  'community/fetchRecommendTopics',
  async (_, { rejectWithValue }) => {
    try {
      const topics = await topicApi.getRecommendTopics({ limit: 10 });
      return topics;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取推荐话题失败');
    }
  }
);

/**
 * 获取热门话题
 */
export const fetchHotTopicsAsync = createAsyncThunk(
  'community/fetchHotTopics',
  async (_, { rejectWithValue }) => {
    try {
      const topics = await topicApi.getHotTopics({ limit: 10 });
      return topics;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取热门话题失败');
    }
  }
);

/**
 * 获取话题详情
 */
export const fetchTopicDetailAsync = createAsyncThunk(
  'community/fetchTopicDetail',
  async (topicId: string, { rejectWithValue }) => {
    try {
      const topic = await topicApi.getTopicDetail(topicId);
      return topic;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取话题详情失败');
    }
  }
);

/**
 * 获取话题下的帖子
 */
export const fetchTopicPostsAsync = createAsyncThunk(
  'community/fetchTopicPosts',
  async (
    params: { topicId: string; page?: number; sort?: 'latest' | 'hot' },
    { rejectWithValue }
  ) => {
    try {
      const response = await topicApi.getTopicPosts(params.topicId, {
        page: params.page || 1,
        pageSize: 10,
        sort: params.sort || 'latest',
      });
      return { topicId: params.topicId, data: response };
    } catch (error: any) {
      return rejectWithValue(error.message || '获取话题帖子失败');
    }
  }
);

/**
 * 关注话题
 */
export const followTopicAsync = createAsyncThunk(
  'community/followTopic',
  async (topicId: string, { rejectWithValue }) => {
    try {
      await topicApi.followTopic(topicId);
      return topicId;
    } catch (error: any) {
      return rejectWithValue(error.message || '关注失败');
    }
  }
);

/**
 * 取消关注话题
 */
export const unfollowTopicAsync = createAsyncThunk(
  'community/unfollowTopic',
  async (topicId: string, { rejectWithValue }) => {
    try {
      await topicApi.unfollowTopic(topicId);
      return topicId;
    } catch (error: any) {
      return rejectWithValue(error.message || '取消关注失败');
    }
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    /**
     * 设置当前分类
     */
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
    },

    /**
     * 重置状态
     */
    resetCommunityState: () => initialState,

    /**
     * 清除错误
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * 更新单个话题
     */
    updateTopic: (state, action: PayloadAction<Topic>) => {
      const index = state.topics.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.topics[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // 获取话题列表
    builder
      .addCase(fetchTopicsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.topics = action.payload.list;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchTopicsAsync.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      });

    // 加载更多话题
    builder
      .addCase(loadMoreTopicsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadMoreTopicsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = [...state.topics, ...action.payload.list];
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(loadMoreTopicsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取推荐话题
    builder
      .addCase(fetchRecommendTopicsAsync.fulfilled, (state, action) => {
        state.recommendTopics = action.payload;
      });

    // 获取热门话题
    builder
      .addCase(fetchHotTopicsAsync.fulfilled, (state, action) => {
        state.hotTopics = action.payload;
      });

    // 获取话题详情
    builder
      .addCase(fetchTopicDetailAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopicDetailAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTopic = action.payload;
      })
      .addCase(fetchTopicDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取话题下的帖子
    builder
      .addCase(fetchTopicPostsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopicPostsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { topicId, data } = action.payload;
        state.topicPosts[topicId] = {
          posts: data.list,
          page: data.page,
          hasMore: data.hasMore,
        };
      })
      .addCase(fetchTopicPostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 关注话题
    builder
      .addCase(followTopicAsync.pending, (state, action) => {
        // 乐观更新
        const topic = state.topics.find((t) => t.id === action.meta.arg);
        if (topic) {
          topic.isFollowed = true;
          topic.memberCount += 1;
        }
        if (state.currentTopic?.id === action.meta.arg) {
          state.currentTopic.isFollowed = true;
          state.currentTopic.memberCount += 1;
        }
      })
      .addCase(followTopicAsync.rejected, (state, action) => {
        // 失败时回滚
        const topic = state.topics.find((t) => t.id === action.meta.arg);
        if (topic) {
          topic.isFollowed = false;
          topic.memberCount -= 1;
        }
        if (state.currentTopic?.id === action.meta.arg) {
          state.currentTopic.isFollowed = false;
          state.currentTopic.memberCount -= 1;
        }
      });

    // 取消关注话题
    builder
      .addCase(unfollowTopicAsync.pending, (state, action) => {
        // 乐观更新
        const topic = state.topics.find((t) => t.id === action.meta.arg);
        if (topic) {
          topic.isFollowed = false;
          topic.memberCount -= 1;
        }
        if (state.currentTopic?.id === action.meta.arg) {
          state.currentTopic.isFollowed = false;
          state.currentTopic.memberCount -= 1;
        }
      })
      .addCase(unfollowTopicAsync.rejected, (state, action) => {
        // 失败时回滚
        const topic = state.topics.find((t) => t.id === action.meta.arg);
        if (topic) {
          topic.isFollowed = true;
          topic.memberCount += 1;
        }
        if (state.currentTopic?.id === action.meta.arg) {
          state.currentTopic.isFollowed = true;
          state.currentTopic.memberCount += 1;
        }
      });
  },
});

export const { setCurrentCategory, resetCommunityState, clearError, updateTopic } =
  communitySlice.actions;

export default communitySlice.reducer;
