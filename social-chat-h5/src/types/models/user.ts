/**
 * User 用户模型类型定义
 * 与后端 API 保持一致
 */

export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string | null;
  email?: string;
  phone?: string;
  bio?: string;  // 后端使用 bio 而不是 signature
  gender?: 'male' | 'female' | 'unknown';
  birthday?: string;
  backgroundImage?: string;

  // 统计数据（与后端字段名保持一致）
  followingCount: number;
  followersCount: number;  // 注意：后端使用 followersCount
  postsCount: number;       // 注意：后端使用 postsCount

  // 关系状态（前端扩展字段）
  isFollowing?: boolean;
  isFollower?: boolean;
  isFriend?: boolean;

  // 时间戳
  createdAt: string;
  updatedAt?: string;
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
 * 后端使用 identifier（可以是 username/email/phone）
 */
export interface LoginParams {
  identifier: string;  // 用户名、邮箱或手机号
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
 * 与后端 API 返回结构保持一致
 */
export interface LoginResponse {
  user: User;
  accessToken: string;      // 后端返回 accessToken
  refreshToken: string;     // 后端返回 refreshToken
}

/**
 * 更新个人资料参数
 */
export interface UpdateProfileParams {
  nickname?: string;
  avatar?: string;
  bio?: string;  // 后端使用 bio 而不是 signature
  gender?: 'male' | 'female' | 'unknown';
  birthday?: string;
  backgroundImage?: string;
}
