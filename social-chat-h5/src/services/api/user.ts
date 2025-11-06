/**
 * User API - 用户相关接口
 */

import { get, post, put, del } from '../request';
import type {
  User,
  UpdateProfileParams,
  PaginationParams,
  PaginationResponse,
  Post,
} from '@/types';

/**
 * 获取用户信息
 */
export function getUserInfo(userId: string): Promise<User> {
  return get<User>(`/users/${userId}`);
}

/**
 * 更新个人资料
 */
export function updateProfile(params: UpdateProfileParams): Promise<User> {
  return put<User>('/users/me', params);
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  return post<{ url: string }>('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 获取我的动态列表
 */
export function getMyPosts(
  params: PaginationParams
): Promise<PaginationResponse<Post>> {
  return get<PaginationResponse<Post>>('/users/me/posts', params);
}

/**
 * 获取用户的动态列表
 */
export function getUserPosts(
  userId: string,
  params: PaginationParams
): Promise<PaginationResponse<Post>> {
  return get<PaginationResponse<Post>>(`/users/${userId}/posts`, params);
}

/**
 * 获取我的好友列表
 */
export function getMyFriends(): Promise<User[]> {
  return get<User[]>('/users/me/friends');
}

/**
 * 获取我的关注列表
 */
export function getMyFollowing(
  params: PaginationParams
): Promise<PaginationResponse<User>> {
  return get<PaginationResponse<User>>('/users/me/following', params);
}

/**
 * 获取我的粉丝列表
 */
export function getMyFollowers(
  params: PaginationParams
): Promise<PaginationResponse<User>> {
  return get<PaginationResponse<User>>('/users/me/followers', params);
}

/**
 * 关注用户
 */
export function followUser(userId: string): Promise<void> {
  return post<void>(`/users/${userId}/follow`);
}

/**
 * 取消关注用户
 */
export function unfollowUser(userId: string): Promise<void> {
  return del<void>(`/users/${userId}/follow`);
}

/**
 * 搜索用户
 */
export function searchUsers(params: {
  keyword: string;
  page: number;
  pageSize: number;
}): Promise<PaginationResponse<User>> {
  return get<PaginationResponse<User>>('/users/search', params);
}
