/**
 * useContact Hook - 好友/联系人管理逻辑
 */

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchFriendsAsync,
  fetchFriendAsync,
  searchUsersAsync,
  addFriendAsync,
  deleteFriendAsync,
  updateFriendAsync,
  fetchFriendRequestsAsync,
  fetchPendingRequestCountAsync,
  handleFriendRequestAsync,
  fetchFriendGroupsAsync,
  createFriendGroupAsync,
  deleteFriendGroupAsync,
  blockUserAsync,
  unblockUserAsync,
  fetchBlockedUsersAsync,
  setCurrentFriend,
  clearSearchResults,
} from '@/store/slices/contactSlice';
import {
  AddFriendParams,
  HandleFriendRequestParams,
  UpdateFriendParams,
  SearchUserParams,
  Friend,
} from '@/types/models';
import { SSDialog } from '@/components/SSDialog';

export const useContact = () => {
  const dispatch = useAppDispatch();
  const {
    friends,
    friendsLoading,
    friendRequests,
    friendRequestsLoading,
    friendRequestsHasMore,
    friendRequestsPage,
    pendingRequestCount,
    friendGroups,
    friendGroupsLoading,
    blockedUsers,
    blockedLoading,
    searchResults,
    searchLoading,
    currentFriend,
  } = useAppSelector((state) => state.contact);

  /**
   * 加载好友列表
   */
  const loadFriends = useCallback(
    async (params?: { groupId?: string; keyword?: string }) => {
      try {
        await dispatch(fetchFriendsAsync(params)).unwrap();
      } catch (error) {
        SSDialog.toast.error('加载好友列表失败');
      }
    },
    [dispatch]
  );

  /**
   * 加载好友详情
   */
  const loadFriend = useCallback(
    async (friendshipId: string): Promise<Friend | null> => {
      try {
        const friend = await dispatch(fetchFriendAsync(friendshipId)).unwrap();
        return friend;
      } catch (error) {
        SSDialog.toast.error('加载好友信息失败');
        return null;
      }
    },
    [dispatch]
  );

  /**
   * 搜索用户
   */
  const searchUsers = useCallback(
    async (params: SearchUserParams) => {
      try {
        await dispatch(searchUsersAsync(params)).unwrap();
      } catch (error) {
        SSDialog.toast.error('搜索失败');
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

  /**
   * 添加好友
   */
  const addFriend = useCallback(
    async (params: AddFriendParams) => {
      try {
        await dispatch(addFriendAsync(params)).unwrap();
        SSDialog.toast.success('好友请求已发送');
      } catch (error) {
        SSDialog.toast.error('发送好友请求失败');
      }
    },
    [dispatch]
  );

  /**
   * 删除好友
   */
  const deleteFriend = useCallback(
    async (friendshipId: string) => {
      try {
        await SSDialog.confirm({
          title: '删除好友',
          content: '确定要删除该好友吗？',
          onConfirm: async () => {
            await dispatch(deleteFriendAsync(friendshipId)).unwrap();
            SSDialog.toast.success('已删除好友');
          },
        });
      } catch (error) {
        SSDialog.toast.error('删除好友失败');
      }
    },
    [dispatch]
  );

  /**
   * 更新好友信息
   */
  const updateFriend = useCallback(
    async (params: UpdateFriendParams) => {
      try {
        await dispatch(updateFriendAsync(params)).unwrap();
        SSDialog.toast.success('更新成功');
      } catch (error) {
        SSDialog.toast.error('更新失败');
      }
    },
    [dispatch]
  );

  /**
   * 加载好友请求列表
   */
  const loadFriendRequests = useCallback(
    async (refresh = false) => {
      const page = refresh ? 1 : friendRequestsPage + 1;

      if (!refresh && !friendRequestsHasMore) {
        return;
      }

      try {
        await dispatch(
          fetchFriendRequestsAsync({
            page,
            pageSize: 20,
          })
        ).unwrap();
      } catch (error) {
        SSDialog.toast.error('加载好友请求失败');
      }
    },
    [dispatch, friendRequestsPage, friendRequestsHasMore]
  );

  /**
   * 刷新好友请求列表
   */
  const refreshFriendRequests = useCallback(async () => {
    return loadFriendRequests(true);
  }, [loadFriendRequests]);

  /**
   * 处理好友请求
   */
  const handleFriendRequest = useCallback(
    async (params: HandleFriendRequestParams) => {
      try {
        await dispatch(handleFriendRequestAsync(params)).unwrap();
        SSDialog.toast.success(params.accept ? '已添加为好友' : '已拒绝');

        // 刷新好友列表
        if (params.accept) {
          loadFriends();
        }
      } catch (error) {
        SSDialog.toast.error('操作失败');
      }
    },
    [dispatch, loadFriends]
  );

  /**
   * 加载待处理请求数量
   */
  const loadPendingRequestCount = useCallback(async () => {
    try {
      await dispatch(fetchPendingRequestCountAsync()).unwrap();
    } catch (error) {
      console.error('获取待处理请求数量失败:', error);
    }
  }, [dispatch]);

  /**
   * 加载好友分组
   */
  const loadFriendGroups = useCallback(async () => {
    try {
      await dispatch(fetchFriendGroupsAsync()).unwrap();
    } catch (error) {
      SSDialog.toast.error('加载分组失败');
    }
  }, [dispatch]);

  /**
   * 创建好友分组
   */
  const createFriendGroup = useCallback(
    async (name: string) => {
      try {
        await dispatch(createFriendGroupAsync(name)).unwrap();
        SSDialog.toast.success('创建分组成功');
      } catch (error) {
        SSDialog.toast.error('创建分组失败');
      }
    },
    [dispatch]
  );

  /**
   * 删除好友分组
   */
  const deleteFriendGroup = useCallback(
    async (groupId: string) => {
      try {
        await SSDialog.confirm({
          title: '删除分组',
          content: '确定要删除该分组吗？分组内的好友将移至默认分组。',
          onConfirm: async () => {
            await dispatch(deleteFriendGroupAsync(groupId)).unwrap();
            SSDialog.toast.success('删除分组成功');
          },
        });
      } catch (error) {
        SSDialog.toast.error('删除分组失败');
      }
    },
    [dispatch]
  );

  /**
   * 拉黑用户
   */
  const blockUser = useCallback(
    async (userId: string, reason?: string) => {
      try {
        await SSDialog.confirm({
          title: '拉黑用户',
          content: '拉黑后将无法收到对方的消息，确定要拉黑吗？',
          onConfirm: async () => {
            await dispatch(blockUserAsync({ userId, reason })).unwrap();
            SSDialog.toast.success('已拉黑');
          },
        });
      } catch (error) {
        SSDialog.toast.error('拉黑失败');
      }
    },
    [dispatch]
  );

  /**
   * 取消拉黑
   */
  const unblockUser = useCallback(
    async (userId: string) => {
      try {
        await dispatch(unblockUserAsync(userId)).unwrap();
        SSDialog.toast.success('已取消拉黑');
      } catch (error) {
        SSDialog.toast.error('取消拉黑失败');
      }
    },
    [dispatch]
  );

  /**
   * 加载黑名单
   */
  const loadBlockedUsers = useCallback(async () => {
    try {
      await dispatch(fetchBlockedUsersAsync()).unwrap();
    } catch (error) {
      SSDialog.toast.error('加载黑名单失败');
    }
  }, [dispatch]);

  /**
   * 设置当前选中的好友
   */
  const selectFriend = useCallback(
    (friend: Friend | null) => {
      dispatch(setCurrentFriend(friend));
    },
    [dispatch]
  );

  /**
   * 初始化时加载待处理请求数量
   */
  useEffect(() => {
    loadPendingRequestCount();
  }, [loadPendingRequestCount]);

  return {
    // 好友列表
    friends,
    friendsLoading,
    loadFriends,

    // 好友详情
    currentFriend,
    selectFriend,
    loadFriend,

    // 好友操作
    addFriend,
    deleteFriend,
    updateFriend,

    // 搜索
    searchResults,
    searchLoading,
    searchUsers,
    clearSearch,

    // 好友请求
    friendRequests,
    friendRequestsLoading,
    friendRequestsHasMore,
    loadFriendRequests,
    refreshFriendRequests,
    handleFriendRequest,
    pendingRequestCount,
    loadPendingRequestCount,

    // 好友分组
    friendGroups,
    friendGroupsLoading,
    loadFriendGroups,
    createFriendGroup,
    deleteFriendGroup,

    // 黑名单
    blockedUsers,
    blockedLoading,
    loadBlockedUsers,
    blockUser,
    unblockUser,
  };
};
