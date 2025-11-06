/**
 * Post 动态/帖子模型类型定义
 */

import { UserBrief } from './user';

/**
 * 动态类型
 */
export type PostType = 'text' | 'image' | 'video' | 'link';

/**
 * 动态可见性
 */
export type PostVisibility = 'public' | 'friends' | 'private';

/**
 * 动态模型
 */
export interface Post {
  id: string;
  user: UserBrief;
  content: string;
  type: PostType;

  // 媒体资源
  images?: string[];
  video?: string;
  link?: {
    url: string;
    title: string;
    description?: string;
    cover?: string;
  };

  // 话题标签
  topics?: Array<{
    id: string;
    name: string;
  }>;

  // 位置信息
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };

  // 互动数据
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;

  // 用户互动状态
  isLiked: boolean;
  isFavorited: boolean;

  // 配置
  visibility: PostVisibility;

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

/**
 * Feed 流项目（首页内容流）
 */
export interface Feed extends Post {
  // Feed 可能有额外的推荐信息
  recommendReason?: string;
}

/**
 * 创建动态参数
 */
export interface CreatePostParams {
  content: string;
  type: PostType;
  images?: string[];
  video?: string;
  topics?: string[];
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  visibility?: PostVisibility;
}

/**
 * 评论模型
 */
export interface Comment {
  id: string;
  post_id: string;
  user: UserBrief;
  content: string;

  // 回复信息
  reply_to?: {
    id: string;
    user: UserBrief;
  };

  // 互动数据
  likeCount: number;
  isLiked: boolean;

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建评论参数
 */
export interface CreateCommentParams {
  post_id: string;
  content: string;
  reply_to?: string; // 回复的评论ID
}
