import { Request } from 'express';

// 用户类型
export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  password_hash: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  birthday?: Date;
  location?: string;
  website?: string;
  status: 'active' | 'inactive' | 'banned';
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  username: string;
  type: 'access' | 'refresh';
}

// 扩展 Express Request
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// 通用响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 动态类型
export interface Post {
  id: string;
  user_id: string;
  type: 'text' | 'image' | 'video';
  content?: string;
  images?: string[];
  video_url?: string;
  visibility: 'public' | 'friends' | 'private';
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: Date;
  updated_at: Date;
}

// 评论类型
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

// 消息类型
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  status: 'sent' | 'delivered' | 'read';
  created_at: Date;
}

// 会话类型
export interface Conversation {
  id: string;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

// 通知类型
export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'friend_request' | 'system';
  title: string;
  content: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: Date;
}

// 好友关系类型
export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  remark?: string;
  group_name?: string;
  created_at: Date;
  updated_at: Date;
}

// 关注类型
export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
}

// WebSocket 消息类型
export interface WSMessage {
  event: string;
  data: any;
}
