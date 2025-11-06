/**
 * GroupSlice - 群组模块状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Group,
  GroupMember,
  CreateGroupParams,
  UpdateGroupParams,
  JoinGroupParams,
  InviteToGroupParams,
  UpdateMemberRoleParams,
  MuteMemberParams,
  RemoveMemberParams,
  TransferOwnerParams,
  SearchGroupParams,
} from '@/types/models';
import { PaginationParams } from '@/types/api';
import { groupApi } from '@/services/api';

interface GroupState {
  // 我的群组列表
  myGroups: Group[];
  myGroupsLoading: boolean;
  myGroupsHasMore: boolean;
  myGroupsPage: number;

  // 当前群组
  currentGroup: Group | null;
  currentGroupLoading: boolean;

  // 群成员列表
  members: GroupMember[];
  membersLoading: boolean;
  membersHasMore: boolean;
  membersPage: number;

  // 搜索结果
  searchResults: Group[];
  searchLoading: boolean;
}

const initialState: GroupState = {
  myGroups: [],
  myGroupsLoading: false,
  myGroupsHasMore: true,
  myGroupsPage: 1,

  currentGroup: null,
  currentGroupLoading: false,

  members: [],
  membersLoading: false,
  membersHasMore: true,
  membersPage: 1,

  searchResults: [],
  searchLoading: false,
};

/**
 * 获取我的群组列表
 */
export const fetchMyGroupsAsync = createAsyncThunk(
  'group/fetchMyGroups',
  async (params: PaginationParams) => {
    const response = await groupApi.getMyGroups(params);
    return response;
  }
);

/**
 * 获取群组详情
 */
export const fetchGroupAsync = createAsyncThunk(
  'group/fetchGroup',
  async (groupId: string) => {
    const response = await groupApi.getGroup(groupId);
    return response;
  }
);

/**
 * 搜索群组
 */
export const searchGroupsAsync = createAsyncThunk(
  'group/searchGroups',
  async (params: SearchGroupParams) => {
    const response = await groupApi.searchGroups(params);
    return response;
  }
);

/**
 * 创建群组
 */
export const createGroupAsync = createAsyncThunk(
  'group/createGroup',
  async (params: CreateGroupParams) => {
    const response = await groupApi.createGroup(params);
    return response;
  }
);

/**
 * 更新群组信息
 */
export const updateGroupAsync = createAsyncThunk(
  'group/updateGroup',
  async (params: UpdateGroupParams) => {
    const response = await groupApi.updateGroup(params);
    return response;
  }
);

/**
 * 解散群组
 */
export const disbandGroupAsync = createAsyncThunk(
  'group/disbandGroup',
  async (groupId: string) => {
    await groupApi.disbandGroup(groupId);
    return groupId;
  }
);

/**
 * 加入群组
 */
export const joinGroupAsync = createAsyncThunk(
  'group/joinGroup',
  async (params: JoinGroupParams) => {
    const response = await groupApi.joinGroup(params);
    return response;
  }
);

/**
 * 退出群组
 */
export const quitGroupAsync = createAsyncThunk(
  'group/quitGroup',
  async (groupId: string) => {
    await groupApi.quitGroup(groupId);
    return groupId;
  }
);

/**
 * 获取群成员列表
 */
export const fetchMembersAsync = createAsyncThunk(
  'group/fetchMembers',
  async ({ groupId, params }: { groupId: string; params: PaginationParams }) => {
    const response = await groupApi.getGroupMembers(groupId, params);
    return response;
  }
);

/**
 * 更新成员角色
 */
export const updateMemberRoleAsync = createAsyncThunk(
  'group/updateMemberRole',
  async (params: UpdateMemberRoleParams) => {
    const response = await groupApi.updateMemberRole(params);
    return response;
  }
);

/**
 * 踢出成员
 */
export const removeMemberAsync = createAsyncThunk(
  'group/removeMember',
  async (params: RemoveMemberParams) => {
    await groupApi.removeMember(params);
    return params.userId;
  }
);

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    /**
     * 设置当前群组
     */
    setCurrentGroup: (state, action: PayloadAction<Group | null>) => {
      state.currentGroup = action.payload;
    },

    /**
     * 清空成员列表
     */
    clearMembers: (state) => {
      state.members = [];
      state.membersPage = 1;
      state.membersHasMore = true;
    },

    /**
     * 清空搜索结果
     */
    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    /**
     * 重置状态
     */
    resetGroupState: () => initialState,
  },
  extraReducers: (builder) => {
    // 获取我的群组列表
    builder
      .addCase(fetchMyGroupsAsync.pending, (state) => {
        state.myGroupsLoading = true;
      })
      .addCase(fetchMyGroupsAsync.fulfilled, (state, action) => {
        state.myGroupsLoading = false;
        const { list, pagination } = action.payload;

        if (pagination.page === 1) {
          state.myGroups = list;
        } else {
          state.myGroups = [...state.myGroups, ...list];
        }

        state.myGroupsPage = pagination.page;
        state.myGroupsHasMore = pagination.hasMore;
      })
      .addCase(fetchMyGroupsAsync.rejected, (state) => {
        state.myGroupsLoading = false;
      });

    // 获取群组详情
    builder
      .addCase(fetchGroupAsync.pending, (state) => {
        state.currentGroupLoading = true;
      })
      .addCase(fetchGroupAsync.fulfilled, (state, action) => {
        state.currentGroupLoading = false;
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupAsync.rejected, (state) => {
        state.currentGroupLoading = false;
      });

    // 搜索群组
    builder
      .addCase(searchGroupsAsync.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchGroupsAsync.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchGroupsAsync.rejected, (state) => {
        state.searchLoading = false;
      });

    // 创建群组
    builder.addCase(createGroupAsync.fulfilled, (state, action) => {
      state.myGroups.unshift(action.payload);
    });

    // 更新群组信息
    builder.addCase(updateGroupAsync.fulfilled, (state, action) => {
      const index = state.myGroups.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.myGroups[index] = action.payload;
      }
      if (state.currentGroup?.id === action.payload.id) {
        state.currentGroup = action.payload;
      }
    });

    // 解散群组
    builder.addCase(disbandGroupAsync.fulfilled, (state, action) => {
      state.myGroups = state.myGroups.filter((g) => g.id !== action.payload);
      if (state.currentGroup?.id === action.payload) {
        state.currentGroup = null;
      }
    });

    // 加入群组
    builder.addCase(joinGroupAsync.fulfilled, (state, action) => {
      state.myGroups.unshift(action.payload);
    });

    // 退出群组
    builder.addCase(quitGroupAsync.fulfilled, (state, action) => {
      state.myGroups = state.myGroups.filter((g) => g.id !== action.payload);
      if (state.currentGroup?.id === action.payload) {
        state.currentGroup = null;
      }
    });

    // 获取群成员列表
    builder
      .addCase(fetchMembersAsync.pending, (state) => {
        state.membersLoading = true;
      })
      .addCase(fetchMembersAsync.fulfilled, (state, action) => {
        state.membersLoading = false;
        const { list, pagination } = action.payload;

        if (pagination.page === 1) {
          state.members = list;
        } else {
          state.members = [...state.members, ...list];
        }

        state.membersPage = pagination.page;
        state.membersHasMore = pagination.hasMore;
      })
      .addCase(fetchMembersAsync.rejected, (state) => {
        state.membersLoading = false;
      });

    // 更新成员角色
    builder.addCase(updateMemberRoleAsync.fulfilled, (state, action) => {
      const index = state.members.findIndex((m) => m.user.id === action.payload.user.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    });

    // 踢出成员
    builder.addCase(removeMemberAsync.fulfilled, (state, action) => {
      state.members = state.members.filter((m) => m.user.id !== action.payload);
      if (state.currentGroup) {
        state.currentGroup.memberCount--;
      }
    });
  },
});

export const { setCurrentGroup, clearMembers, clearSearchResults, resetGroupState } =
  groupSlice.actions;

export default groupSlice.reducer;
