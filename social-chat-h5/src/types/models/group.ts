/**
 * Group - 群组相关类型定义
 */

import { UserBrief } from './user';

/**
 * 群组类型
 */
export type GroupType = 'normal' | 'official' | 'private';

/**
 * 加入方式
 */
export type JoinType = 'free' | 'approval' | 'invite_only';

/**
 * 群成员角色
 */
export type GroupRole = 'owner' | 'admin' | 'member';

/**
 * 群组状态
 */
export type GroupStatus = 'active' | 'disbanded';

/**
 * 群组
 */
export interface Group {
  // 群组ID
  id: string;

  // 群名称
  name: string;

  // 群头像
  avatar?: string;

  // 群简介
  description?: string;

  // 群公告
  announcement?: string;

  // 群主ID
  ownerId: string;

  // 群主信息
  owner?: UserBrief;

  // 群类型
  type: GroupType;

  // 加入方式
  joinType: JoinType;

  // 成员数量
  memberCount: number;

  // 成员上限
  memberLimit: number;

  // 是否全员禁言
  isMuted: boolean;

  // 状态
  status: GroupStatus;

  // 是否已加入
  isJoined?: boolean;

  // 我的角色（如果已加入）
  myRole?: GroupRole;

  // 创建时间
  createdAt: string;

  // 更新时间
  updatedAt?: string;
}

/**
 * 群成员
 */
export interface GroupMember {
  // 成员ID
  id: string;

  // 群组ID
  groupId: string;

  // 用户信息
  user: UserBrief;

  // 角色
  role: GroupRole;

  // 群昵称
  nickname?: string;

  // 是否禁言
  isMuted: boolean;

  // 加入时间
  joinedAt: string;
}

/**
 * 创建群组参数
 */
export interface CreateGroupParams {
  // 群名称
  name: string;

  // 群头像
  avatar?: string;

  // 群简介
  description?: string;

  // 加入方式
  joinType: JoinType;

  // 初始成员ID列表
  memberIds?: string[];
}

/**
 * 更新群组参数
 */
export interface UpdateGroupParams {
  // 群组ID
  groupId: string;

  // 群名称
  name?: string;

  // 群头像
  avatar?: string;

  // 群简介
  description?: string;

  // 群公告
  announcement?: string;

  // 加入方式
  joinType?: JoinType;

  // 全员禁言
  isMuted?: boolean;
}

/**
 * 加入群组参数
 */
export interface JoinGroupParams {
  // 群组ID
  groupId: string;

  // 验证消息（需要审批时）
  message?: string;
}

/**
 * 邀请入群参数
 */
export interface InviteToGroupParams {
  // 群组ID
  groupId: string;

  // 被邀请用户ID列表
  userIds: string[];
}

/**
 * 更新成员角色参数
 */
export interface UpdateMemberRoleParams {
  // 群组ID
  groupId: string;

  // 成员用户ID
  userId: string;

  // 新角色
  role: GroupRole;
}

/**
 * 禁言/取消禁言参数
 */
export interface MuteMemberParams {
  // 群组ID
  groupId: string;

  // 成员用户ID
  userId: string;

  // 是否禁言
  isMuted: boolean;
}

/**
 * 踢出群组参数
 */
export interface RemoveMemberParams {
  // 群组ID
  groupId: string;

  // 成员用户ID
  userId: string;
}

/**
 * 转让群主参数
 */
export interface TransferOwnerParams {
  // 群组ID
  groupId: string;

  // 新群主用户ID
  newOwnerId: string;
}

/**
 * 群组搜索参数
 */
export interface SearchGroupParams {
  // 搜索关键词
  keyword: string;

  // 群组类型
  type?: GroupType;
}
