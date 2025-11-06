/**
 * useGroup Hook - 群组管理逻辑
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchMyGroupsAsync,
  fetchGroupAsync,
  searchGroupsAsync,
  createGroupAsync,
  updateGroupAsync,
  disbandGroupAsync,
  joinGroupAsync,
  quitGroupAsync,
  fetchMembersAsync,
  setCurrentGroup,
  clearMembers,
  clearSearchResults,
} from '@/store/slices/groupSlice';
import {
  CreateGroupParams,
  UpdateGroupParams,
  JoinGroupParams,
  SearchGroupParams,
  Group,
} from '@/types/models';
import { SSDialog } from '@/components/SSDialog';

export const useGroup = () => {
  const dispatch = useAppDispatch();
  const {
    myGroups,
    myGroupsLoading,
    myGroupsHasMore,
    myGroupsPage,
    currentGroup,
    currentGroupLoading,
    members,
    membersLoading,
    membersHasMore,
    searchResults,
    searchLoading,
  } = useAppSelector((state) => state.group);

  /**
   * 加载我的群组列表
   */
  const loadMyGroups = useCallback(
    async (refresh = false) => {
      const page = refresh ? 1 : myGroupsPage + 1;

      if (!refresh && !myGroupsHasMore) {
        return;
      }

      try {
        await dispatch(fetchMyGroupsAsync({ page, pageSize: 20 })).unwrap();
      } catch (error) {
        SSDialog.toast.error('加载群组列表失败');
      }
    },
    [dispatch, myGroupsPage, myGroupsHasMore]
  );

  /**
   * 加载群组详情
   */
  const loadGroup = useCallback(
    async (groupId: string) => {
      try {
        const group = await dispatch(fetchGroupAsync(groupId)).unwrap();
        return group;
      } catch (error) {
        SSDialog.toast.error('加载群组信息失败');
        return null;
      }
    },
    [dispatch]
  );

  /**
   * 搜索群组
   */
  const searchGroups = useCallback(
    async (params: SearchGroupParams) => {
      try {
        await dispatch(searchGroupsAsync(params)).unwrap();
      } catch (error) {
        SSDialog.toast.error('搜索失败');
      }
    },
    [dispatch]
  );

  /**
   * 创建群组
   */
  const createGroup = useCallback(
    async (params: CreateGroupParams): Promise<Group | null> => {
      try {
        const group = await dispatch(createGroupAsync(params)).unwrap();
        SSDialog.toast.success('创建成功');
        return group;
      } catch (error) {
        SSDialog.toast.error('创建失败');
        return null;
      }
    },
    [dispatch]
  );

  /**
   * 更新群组信息
   */
  const updateGroup = useCallback(
    async (params: UpdateGroupParams) => {
      try {
        await dispatch(updateGroupAsync(params)).unwrap();
        SSDialog.toast.success('更新成功');
      } catch (error) {
        SSDialog.toast.error('更新失败');
      }
    },
    [dispatch]
  );

  /**
   * 解散群组
   */
  const disbandGroup = useCallback(
    async (groupId: string) => {
      await SSDialog.confirm({
        title: '解散群组',
        content: '确定要解散群组吗？此操作不可撤销。',
        onConfirm: async () => {
          try {
            await dispatch(disbandGroupAsync(groupId)).unwrap();
            SSDialog.toast.success('群组已解散');
          } catch (error) {
            SSDialog.toast.error('解散失败');
          }
        },
      });
    },
    [dispatch]
  );

  /**
   * 加入群组
   */
  const joinGroup = useCallback(
    async (params: JoinGroupParams) => {
      try {
        await dispatch(joinGroupAsync(params)).unwrap();
        SSDialog.toast.success('已加入群组');
      } catch (error) {
        SSDialog.toast.error('加入失败');
      }
    },
    [dispatch]
  );

  /**
   * 退出群组
   */
  const quitGroup = useCallback(
    async (groupId: string) => {
      await SSDialog.confirm({
        title: '退出群组',
        content: '确定要退出群组吗？',
        onConfirm: async () => {
          try {
            await dispatch(quitGroupAsync(groupId)).unwrap();
            SSDialog.toast.success('已退出群组');
          } catch (error) {
            SSDialog.toast.error('退出失败');
          }
        },
      });
    },
    [dispatch]
  );

  /**
   * 加载群成员
   */
  const loadMembers = useCallback(
    async (groupId: string, refresh = false) => {
      const page = refresh ? 1 : myGroupsPage + 1;

      if (!refresh && !membersHasMore) {
        return;
      }

      try {
        await dispatch(fetchMembersAsync({ groupId, params: { page, pageSize: 20 } })).unwrap();
      } catch (error) {
        SSDialog.toast.error('加载成员列表失败');
      }
    },
    [dispatch, myGroupsPage, membersHasMore]
  );

  /**
   * 设置当前群组
   */
  const selectGroup = useCallback(
    (group: Group | null) => {
      dispatch(setCurrentGroup(group));
      if (group) {
        dispatch(clearMembers());
      }
    },
    [dispatch]
  );

  /**
   * 清空搜索结果
   */
  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  return {
    // 我的群组
    myGroups,
    myGroupsLoading,
    myGroupsHasMore,
    loadMyGroups,

    // 当前群组
    currentGroup,
    currentGroupLoading,
    selectGroup,
    loadGroup,

    // 群组操作
    createGroup,
    updateGroup,
    disbandGroup,
    joinGroup,
    quitGroup,

    // 搜索
    searchResults,
    searchLoading,
    searchGroups,
    clearSearch,

    // 成员
    members,
    membersLoading,
    membersHasMore,
    loadMembers,
  };
};
