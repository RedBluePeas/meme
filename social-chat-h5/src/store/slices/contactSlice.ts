/**
 * ContactSlice - 联系人/好友模块状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Friend,
  FriendRequest,
  FriendGroup,
  BlockedUser,
  AddFriendParams,
  HandleFriendRequestParams,
  UpdateFriendParams,
  SearchUserParams,
  SearchUserResult,
} from '@/types/models';
import { PaginationParams } from '@/types/api';
import { contactApi } from '@/services/api';

interface ContactState {
  // 好友列表
  friends: Friend[];
  friendsLoading: boolean;

  // 好友请求
  friendRequests: FriendRequest[];
  friendRequestsLoading: boolean;
  friendRequestsHasMore: boolean;
  friendRequestsPage: number;
  pendingRequestCount: number;

  // 好友分组
  friendGroups: FriendGroup[];
  friendGroupsLoading: boolean;

  // 黑名单
  blockedUsers: BlockedUser[];
  blockedLoading: boolean;

  // 搜索结果
  searchResults: SearchUserResult[];
  searchLoading: boolean;

  // 当前选中的好友
  currentFriend: Friend | null;
}

const initialState: ContactState = {
  friends: [],
  friendsLoading: false,

  friendRequests: [],
  friendRequestsLoading: false,
  friendRequestsHasMore: true,
  friendRequestsPage: 1,
  pendingRequestCount: 0,

  friendGroups: [],
  friendGroupsLoading: false,

  blockedUsers: [],
  blockedLoading: false,

  searchResults: [],
  searchLoading: false,

  currentFriend: null,
};

/**
 * 获取好友列表
 */
export const fetchFriendsAsync = createAsyncThunk(
  'contact/fetchFriends',
  async (params?: { groupId?: string; keyword?: string }) => {
    const response = await contactApi.getFriends(params);
    return response;
  }
);

/**
 * 获取好友详情
 */
export const fetchFriendAsync = createAsyncThunk(
  'contact/fetchFriend',
  async (friendshipId: string) => {
    const response = await contactApi.getFriend(friendshipId);
    return response;
  }
);

/**
 * 搜索用户
 */
export const searchUsersAsync = createAsyncThunk(
  'contact/searchUsers',
  async (params: SearchUserParams) => {
    const response = await contactApi.searchUsers(params);
    return response;
  }
);

/**
 * 添加好友
 */
export const addFriendAsync = createAsyncThunk(
  'contact/addFriend',
  async (params: AddFriendParams) => {
    const response = await contactApi.addFriend(params);
    return response;
  }
);

/**
 * 删除好友
 */
export const deleteFriendAsync = createAsyncThunk(
  'contact/deleteFriend',
  async (friendshipId: string) => {
    await contactApi.deleteFriend(friendshipId);
    return friendshipId;
  }
);

/**
 * 更新好友信息
 */
export const updateFriendAsync = createAsyncThunk(
  'contact/updateFriend',
  async (params: UpdateFriendParams) => {
    const response = await contactApi.updateFriend(params);
    return response;
  }
);

/**
 * 获取好友请求列表
 */
export const fetchFriendRequestsAsync = createAsyncThunk(
  'contact/fetchFriendRequests',
  async (params: PaginationParams) => {
    const response = await contactApi.getFriendRequests(params);
    return response;
  }
);

/**
 * 获取待处理请求数量
 */
export const fetchPendingRequestCountAsync = createAsyncThunk(
  'contact/fetchPendingRequestCount',
  async () => {
    const response = await contactApi.getPendingRequestCount();
    return response.count;
  }
);

/**
 * 处理好友请求
 */
export const handleFriendRequestAsync = createAsyncThunk(
  'contact/handleFriendRequest',
  async (params: HandleFriendRequestParams) => {
    const response = await contactApi.handleFriendRequest(params);
    return { requestId: params.requestId, accept: params.accept, friend: response };
  }
);

/**
 * 获取好友分组
 */
export const fetchFriendGroupsAsync = createAsyncThunk(
  'contact/fetchFriendGroups',
  async () => {
    const response = await contactApi.getFriendGroups();
    return response;
  }
);

/**
 * 创建好友分组
 */
export const createFriendGroupAsync = createAsyncThunk(
  'contact/createFriendGroup',
  async (name: string) => {
    const response = await contactApi.createFriendGroup(name);
    return response;
  }
);

/**
 * 删除好友分组
 */
export const deleteFriendGroupAsync = createAsyncThunk(
  'contact/deleteFriendGroup',
  async (groupId: string) => {
    await contactApi.deleteFriendGroup(groupId);
    return groupId;
  }
);

/**
 * 拉黑用户
 */
export const blockUserAsync = createAsyncThunk(
  'contact/blockUser',
  async ({ userId, reason }: { userId: string; reason?: string }) => {
    await contactApi.blockUser(userId, reason);
    return userId;
  }
);

/**
 * 取消拉黑
 */
export const unblockUserAsync = createAsyncThunk(
  'contact/unblockUser',
  async (userId: string) => {
    await contactApi.unblockUser(userId);
    return userId;
  }
);

/**
 * 获取黑名单
 */
export const fetchBlockedUsersAsync = createAsyncThunk(
  'contact/fetchBlockedUsers',
  async () => {
    const response = await contactApi.getBlockedUsers();
    return response;
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    /**
     * 设置当前好友
     */
    setCurrentFriend: (state, action: PayloadAction<Friend | null>) => {
      state.currentFriend = action.payload;
    },

    /**
     * 清空搜索结果
     */
    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    /**
     * 更新好友在线状态
     */
    updateFriendOnlineStatus: (
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean }>
    ) => {
      const { userId, isOnline } = action.payload;
      const friend = state.friends.find((f) => f.id === userId);
      if (friend) {
        friend.isOnline = isOnline;
        if (!isOnline) {
          friend.lastOnlineAt = new Date().toISOString();
        }
      }
    },

    /**
     * 重置状态
     */
    resetContactState: () => initialState,
  },
  extraReducers: (builder) => {
    // 获取好友列表
    builder
      .addCase(fetchFriendsAsync.pending, (state) => {
        state.friendsLoading = true;
      })
      .addCase(fetchFriendsAsync.fulfilled, (state, action) => {
        state.friendsLoading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriendsAsync.rejected, (state) => {
        state.friendsLoading = false;
      });

    // 获取好友详情
    builder.addCase(fetchFriendAsync.fulfilled, (state, action) => {
      state.currentFriend = action.payload;
    });

    // 搜索用户
    builder
      .addCase(searchUsersAsync.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersAsync.rejected, (state) => {
        state.searchLoading = false;
      });

    // 删除好友
    builder.addCase(deleteFriendAsync.fulfilled, (state, action) => {
      state.friends = state.friends.filter(
        (f) => f.friendshipId !== action.payload
      );
    });

    // 更新好友信息
    builder.addCase(updateFriendAsync.fulfilled, (state, action) => {
      const index = state.friends.findIndex(
        (f) => f.friendshipId === action.payload.friendshipId
      );
      if (index !== -1) {
        state.friends[index] = action.payload;
      }
      if (state.currentFriend?.friendshipId === action.payload.friendshipId) {
        state.currentFriend = action.payload;
      }
    });

    // 获取好友请求列表
    builder
      .addCase(fetchFriendRequestsAsync.pending, (state) => {
        state.friendRequestsLoading = true;
      })
      .addCase(fetchFriendRequestsAsync.fulfilled, (state, action) => {
        state.friendRequestsLoading = false;
        const { list, pagination } = action.payload;

        if (pagination.page === 1) {
          state.friendRequests = list;
        } else {
          state.friendRequests = [...state.friendRequests, ...list];
        }

        state.friendRequestsPage = pagination.page;
        state.friendRequestsHasMore = pagination.hasMore;
      })
      .addCase(fetchFriendRequestsAsync.rejected, (state) => {
        state.friendRequestsLoading = false;
      });

    // 获取待处理请求数量
    builder.addCase(
      fetchPendingRequestCountAsync.fulfilled,
      (state, action) => {
        state.pendingRequestCount = action.payload;
      }
    );

    // 处理好友请求
    builder.addCase(handleFriendRequestAsync.fulfilled, (state, action) => {
      const { requestId, accept, friend } = action.payload;

      // 更新请求状态
      const request = state.friendRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = accept ? 'accepted' : 'rejected';
        request.handledAt = new Date().toISOString();
      }

      // 如果接受，添加到好友列表
      if (accept && friend) {
        state.friends.unshift(friend);
      }

      // 减少待处理数量
      if (state.pendingRequestCount > 0) {
        state.pendingRequestCount--;
      }
    });

    // 获取好友分组
    builder
      .addCase(fetchFriendGroupsAsync.pending, (state) => {
        state.friendGroupsLoading = true;
      })
      .addCase(fetchFriendGroupsAsync.fulfilled, (state, action) => {
        state.friendGroupsLoading = false;
        state.friendGroups = action.payload;
      })
      .addCase(fetchFriendGroupsAsync.rejected, (state) => {
        state.friendGroupsLoading = false;
      });

    // 创建好友分组
    builder.addCase(createFriendGroupAsync.fulfilled, (state, action) => {
      state.friendGroups.push(action.payload);
    });

    // 删除好友分组
    builder.addCase(deleteFriendGroupAsync.fulfilled, (state, action) => {
      state.friendGroups = state.friendGroups.filter(
        (g) => g.id !== action.payload
      );
    });

    // 拉黑用户
    builder.addCase(blockUserAsync.fulfilled, (state, action) => {
      // 从好友列表中移除
      state.friends = state.friends.filter((f) => f.id !== action.payload);
    });

    // 获取黑名单
    builder
      .addCase(fetchBlockedUsersAsync.pending, (state) => {
        state.blockedLoading = true;
      })
      .addCase(fetchBlockedUsersAsync.fulfilled, (state, action) => {
        state.blockedLoading = false;
        state.blockedUsers = action.payload;
      })
      .addCase(fetchBlockedUsersAsync.rejected, (state) => {
        state.blockedLoading = false;
      });

    // 取消拉黑
    builder.addCase(unblockUserAsync.fulfilled, (state, action) => {
      state.blockedUsers = state.blockedUsers.filter(
        (u) => u.id !== action.payload
      );
    });
  },
});

export const {
  setCurrentFriend,
  clearSearchResults,
  updateFriendOnlineStatus,
  resetContactState,
} = contactSlice.actions;

export default contactSlice.reducer;
