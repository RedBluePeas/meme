/**
 * Group API - 群组模块接口
 */

import { request } from '../request';
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
import { PaginationParams, PaginationResponse } from '@/types/api';

/**
 * 获取我的群组列表
 */
export function getMyGroups(params?: PaginationParams): Promise<PaginationResponse<Group>> {
  return request.get('/api/groups/my', { params });
}

/**
 * 获取群组详情
 */
export function getGroup(groupId: string): Promise<Group> {
  return request.get(`/api/groups/${groupId}`);
}

/**
 * 搜索群组
 */
export function searchGroups(params: SearchGroupParams): Promise<Group[]> {
  return request.get('/api/groups/search', { params });
}

/**
 * 创建群组
 */
export function createGroup(params: CreateGroupParams): Promise<Group> {
  return request.post('/api/groups', params);
}

/**
 * 更新群组信息
 */
export function updateGroup(params: UpdateGroupParams): Promise<Group> {
  return request.put(`/api/groups/${params.groupId}`, params);
}

/**
 * 解散群组
 */
export function disbandGroup(groupId: string): Promise<void> {
  return request.delete(`/api/groups/${groupId}`);
}

/**
 * 加入群组
 */
export function joinGroup(params: JoinGroupParams): Promise<Group> {
  return request.post(`/api/groups/${params.groupId}/join`, {
    message: params.message,
  });
}

/**
 * 退出群组
 */
export function quitGroup(groupId: string): Promise<void> {
  return request.post(`/api/groups/${groupId}/quit`);
}

/**
 * 邀请成员入群
 */
export function inviteToGroup(params: InviteToGroupParams): Promise<void> {
  return request.post(`/api/groups/${params.groupId}/invite`, {
    userIds: params.userIds,
  });
}

/**
 * 获取群成员列表
 */
export function getGroupMembers(
  groupId: string,
  params?: PaginationParams
): Promise<PaginationResponse<GroupMember>> {
  return request.get(`/api/groups/${groupId}/members`, { params });
}

/**
 * 更新成员角色
 */
export function updateMemberRole(params: UpdateMemberRoleParams): Promise<GroupMember> {
  return request.put(`/api/groups/${params.groupId}/members/${params.userId}/role`, {
    role: params.role,
  });
}

/**
 * 设置群昵称
 */
export function setMemberNickname(
  groupId: string,
  userId: string,
  nickname: string
): Promise<GroupMember> {
  return request.put(`/api/groups/${groupId}/members/${userId}/nickname`, {
    nickname,
  });
}

/**
 * 禁言/取消禁言成员
 */
export function muteMember(params: MuteMemberParams): Promise<void> {
  return request.put(`/api/groups/${params.groupId}/members/${params.userId}/mute`, {
    isMuted: params.isMuted,
  });
}

/**
 * 踢出群组
 */
export function removeMember(params: RemoveMemberParams): Promise<void> {
  return request.delete(`/api/groups/${params.groupId}/members/${params.userId}`);
}

/**
 * 转让群主
 */
export function transferOwner(params: TransferOwnerParams): Promise<Group> {
  return request.put(`/api/groups/${params.groupId}/transfer`, {
    newOwnerId: params.newOwnerId,
  });
}

/**
 * 设置群公告
 */
export function setGroupAnnouncement(
  groupId: string,
  announcement: string
): Promise<void> {
  return request.put(`/api/groups/${groupId}/announcement`, {
    announcement,
  });
}

/**
 * 全员禁言/取消禁言
 */
export function muteAllMembers(groupId: string, isMuted: boolean): Promise<void> {
  return request.put(`/api/groups/${groupId}/mute-all`, {
    isMuted,
  });
}
