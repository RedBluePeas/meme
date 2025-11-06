/**
 * Contact - 联系人/好友相关类型定义
 */

import { UserBrief } from './user';

/**
 * 好友状态
 */
export type FriendStatus = 'pending' | 'accepted' | 'blocked';

/**
 * 好友请求状态
 */
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

/**
 * 好友关系
 */
export interface Friend extends UserBrief {
  // 好友关系ID
  friendshipId: string;

  // 备注名
  remark?: string;

  // 好友分组ID
  groupId?: string;

  // 标签
  tags?: string[];

  // 好友状态
  status: FriendStatus;

  // 是否在线
  isOnline: boolean;

  // 最后在线时间
  lastOnlineAt?: string;

  // 成为好友的时间
  friendSince: string;

  // 来源
  source?: string;

  // 共同好友数
  mutualFriendsCount?: number;
}

/**
 * 好友请求
 */
export interface FriendRequest {
  // 请求ID
  id: string;

  // 发起人信息
  sender: UserBrief;

  // 接收人信息
  receiver: UserBrief;

  // 验证消息
  message?: string;

  // 请求状态
  status: FriendRequestStatus;

  // 来源
  source?: string;

  // 创建时间
  createdAt: string;

  // 处理时间
  handledAt?: string;
}

/**
 * 好友分组
 */
export interface FriendGroup {
  // 分组ID
  id: string;

  // 分组名称
  name: string;

  // 好友数量
  count: number;

  // 排序
  order: number;

  // 是否默认分组
  isDefault: boolean;

  // 创建时间
  createdAt: string;
}

/**
 * 黑名单用户
 */
export interface BlockedUser extends UserBrief {
  // 拉黑时间
  blockedAt: string;

  // 拉黑原因
  reason?: string;
}

/**
 * 添加好友参数
 */
export interface AddFriendParams {
  // 用户ID或用户名
  targetId: string;

  // 验证消息
  message?: string;

  // 来源
  source?: string;

  // 备注名
  remark?: string;

  // 分组ID
  groupId?: string;
}

/**
 * 处理好友请求参数
 */
export interface HandleFriendRequestParams {
  // 请求ID
  requestId: string;

  // 是否接受
  accept: boolean;

  // 备注名（接受时）
  remark?: string;

  // 分组ID（接受时）
  groupId?: string;
}

/**
 * 更新好友信息参数
 */
export interface UpdateFriendParams {
  // 好友关系ID
  friendshipId: string;

  // 备注名
  remark?: string;

  // 分组ID
  groupId?: string;

  // 标签
  tags?: string[];
}

/**
 * 搜索用户参数
 */
export interface SearchUserParams {
  // 搜索关键词
  keyword: string;

  // 搜索类型
  type?: 'username' | 'phone' | 'id';
}

/**
 * 搜索用户结果
 */
export interface SearchUserResult extends UserBrief {
  // 是否已是好友
  isFriend: boolean;

  // 好友关系ID（如果已是好友）
  friendshipId?: string;

  // 共同好友数
  mutualFriendsCount: number;
}
