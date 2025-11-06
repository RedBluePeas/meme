/**
 * User 用户模型类型定义
 */

export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  email?: string;
  phone?: string;
  signature?: string;
  gender?: 'male' | 'female' | 'unknown';
  birthday?: string;
  backgroundImage?: string;

  // 统计数据
  followingCount: number;
  followerCount: number;
  postCount: number;

  // 关系状态
  isFollowing?: boolean;
  isFollower?: boolean;
  isFriend?: boolean;

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户简要信息（用于列表展示）
 */
export interface UserBrief {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  username: string;
  password: string;
  nickname: string;
  email?: string;
  phone?: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

/**
 * 更新个人资料参数
 */
export interface UpdateProfileParams {
  nickname?: string;
  avatar?: string;
  signature?: string;
  gender?: 'male' | 'female' | 'unknown';
  birthday?: string;
  backgroundImage?: string;
}
