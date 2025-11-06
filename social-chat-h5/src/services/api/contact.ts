/**
 * Contact API - 联系人/好友模块接口
 */

import { request } from '../request';
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
import { PaginationParams, PaginationResponse } from '@/types/api';

/**
 * 获取好友列表
 */
export function getFriends(params?: {
  groupId?: string;
  keyword?: string;
}): Promise<Friend[]> {
  return request.get('/api/friends', { params });
}

/**
 * 获取好友详情
 */
export function getFriend(friendshipId: string): Promise<Friend> {
  return request.get(`/api/friends/${friendshipId}`);
}

/**
 * 搜索用户
 */
export function searchUsers(params: SearchUserParams): Promise<SearchUserResult[]> {
  return request.get('/api/users/search', { params });
}

/**
 * 添加好友
 */
export function addFriend(params: AddFriendParams): Promise<FriendRequest> {
  return request.post('/api/friends/request', params);
}

/**
 * 删除好友
 */
export function deleteFriend(friendshipId: string): Promise<void> {
  return request.delete(`/api/friends/${friendshipId}`);
}

/**
 * 更新好友信息（备注、分组、标签）
 */
export function updateFriend(params: UpdateFriendParams): Promise<Friend> {
  return request.put(`/api/friends/${params.friendshipId}`, params);
}

/**
 * 设置备注名
 */
export function setFriendRemark(
  friendshipId: string,
  remark: string
): Promise<void> {
  return request.put(`/api/friends/${friendshipId}/remark`, { remark });
}

/**
 * 移动到分组
 */
export function moveFriendToGroup(
  friendshipId: string,
  groupId: string
): Promise<void> {
  return request.put(`/api/friends/${friendshipId}/group`, { groupId });
}

/**
 * 获取好友请求列表
 */
export function getFriendRequests(
  params: PaginationParams
): Promise<PaginationResponse<FriendRequest>> {
  return request.get('/api/friends/requests', { params });
}

/**
 * 获取待处理好友请求数量
 */
export function getPendingRequestCount(): Promise<{ count: number }> {
  return request.get('/api/friends/requests/pending-count');
}

/**
 * 处理好友请求
 */
export function handleFriendRequest(
  params: HandleFriendRequestParams
): Promise<Friend | null> {
  return request.put(`/api/friends/requests/${params.requestId}`, {
    accept: params.accept,
    remark: params.remark,
    groupId: params.groupId,
  });
}

/**
 * 获取好友分组列表
 */
export function getFriendGroups(): Promise<FriendGroup[]> {
  return request.get('/api/friends/groups');
}

/**
 * 创建好友分组
 */
export function createFriendGroup(name: string): Promise<FriendGroup> {
  return request.post('/api/friends/groups', { name });
}

/**
 * 更新好友分组
 */
export function updateFriendGroup(
  groupId: string,
  data: { name?: string; order?: number }
): Promise<FriendGroup> {
  return request.put(`/api/friends/groups/${groupId}`, data);
}

/**
 * 删除好友分组
 */
export function deleteFriendGroup(groupId: string): Promise<void> {
  return request.delete(`/api/friends/groups/${groupId}`);
}

/**
 * 拉黑用户
 */
export function blockUser(userId: string, reason?: string): Promise<void> {
  return request.post('/api/users/block', { userId, reason });
}

/**
 * 取消拉黑
 */
export function unblockUser(userId: string): Promise<void> {
  return request.delete(`/api/users/block/${userId}`);
}

/**
 * 获取黑名单列表
 */
export function getBlockedUsers(): Promise<BlockedUser[]> {
  return request.get('/api/users/blocked');
}

/**
 * 获取共同好友
 */
export function getMutualFriends(userId: string): Promise<Friend[]> {
  return request.get(`/api/friends/mutual/${userId}`);
}
