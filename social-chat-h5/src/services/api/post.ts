/**
 * Post API - 动态/帖子相关接口
 * 与后端 Swagger 文档保持一致
 */

import { get, post, put, del } from '../request';
import type {
  Post,
  Feed,
  CreatePostParams,
  Comment,
  CreateCommentParams,
  PaginationParams,
  PaginationResponse,
} from '@/types';

// ==================== 后端已实现的接口 ====================

/**
 * 创建动态
 * POST /api/posts
 * 后端支持的类型：text, image, video
 * 必填字段：type
 * 可选字段：content, images, visibility (public/friends/private)
 */
export function createPost(params: CreatePostParams): Promise<Post> {
  return post<Post>('/posts', params);
}

/**
 * 获取动态列表（动态流）
 * GET /api/posts
 * 分页参数：page (默认1), pageSize (默认20)
 */
export function getFeeds(
  params: PaginationParams
): Promise<PaginationResponse<Feed>> {
  return get<PaginationResponse<Feed>>('/posts', params);
}

// ==================== 后端已实现的接口（已添加到 Swagger 文档） ====================

/**
 * 获取动态详情
 * GET /api/posts/{postId}
 */
export function getPostDetail(postId: string): Promise<Post> {
  return get<Post>(`/posts/${postId}`);
}

/**
 * 更新动态
 * PUT /api/posts/{postId}
 */
export function updatePost(
  postId: string,
  params: Partial<CreatePostParams>
): Promise<Post> {
  return put<Post>(`/posts/${postId}`, params);
}

/**
 * 删除动态
 * DELETE /api/posts/{postId}
 */
export function deletePost(postId: string): Promise<void> {
  return del<void>(`/posts/${postId}`);
}

/**
 * 点赞动态
 * POST /api/posts/{postId}/like
 */
export function likePost(postId: string): Promise<void> {
  return post<void>(`/posts/${postId}/like`);
}

/**
 * 取消点赞动态
 * DELETE /api/posts/{postId}/like
 */
export function unlikePost(postId: string): Promise<void> {
  return del<void>(`/posts/${postId}/like`);
}

/**
 * 收藏动态
 * POST /api/posts/{postId}/favorite
 */
export function favoritePost(postId: string): Promise<void> {
  return post<void>(`/posts/${postId}/favorite`);
}

/**
 * 取消收藏动态
 * DELETE /api/posts/{postId}/favorite
 */
export function unfavoritePost(postId: string): Promise<void> {
  return del<void>(`/posts/${postId}/favorite`);
}

/**
 * 分享动态
 * POST /api/posts/{postId}/share
 */
export function sharePost(postId: string): Promise<void> {
  return post<void>(`/posts/${postId}/share`);
}

/**
 * 获取动态的评论列表
 * GET /api/posts/{postId}/comments
 */
export function getPostComments(
  postId: string,
  params: PaginationParams
): Promise<PaginationResponse<Comment>> {
  return get<PaginationResponse<Comment>>(`/posts/${postId}/comments`, params);
}

/**
 * 创建评论
 * POST /api/posts/{postId}/comments
 */
export function createComment(params: CreateCommentParams): Promise<Comment> {
  return post<Comment>(`/posts/${params.postId}/comments`, params);
}

/**
 * 删除评论
 * DELETE /api/comments/{commentId}
 */
export function deleteComment(commentId: string): Promise<void> {
  return del<void>(`/comments/${commentId}`);
}

/**
 * 点赞评论
 * POST /api/comments/{commentId}/like
 */
export function likeComment(commentId: string): Promise<void> {
  return post<void>(`/comments/${commentId}/like`);
}

/**
 * 取消点赞评论
 * DELETE /api/comments/{commentId}/like
 */
export function unlikeComment(commentId: string): Promise<void> {
  return del<void>(`/comments/${commentId}/like`);
}
