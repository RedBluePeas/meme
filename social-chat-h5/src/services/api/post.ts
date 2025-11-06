/**
 * Post API - 动态/帖子相关接口
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

/**
 * 获取推荐内容流（首页 Feed）
 */
export function getFeeds(
  params: PaginationParams
): Promise<PaginationResponse<Feed>> {
  return get<PaginationResponse<Feed>>('/posts/feeds', params);
}

/**
 * 获取动态详情
 */
export function getPostDetail(postId: string): Promise<Post> {
  return get<Post>(`/posts/${postId}`);
}

/**
 * 创建动态
 */
export function createPost(params: CreatePostParams): Promise<Post> {
  return post<Post>('/posts', params);
}

/**
 * 更新动态
 */
export function updatePost(
  postId: string,
  params: Partial<CreatePostParams>
): Promise<Post> {
  return put<Post>(`/posts/${postId}`, params);
}

/**
 * 删除动态
 */
export function deletePost(postId: string): Promise<void> {
  return del<void>(`/posts/${postId}`);
}

/**
 * 点赞动态
 */
export function likePost(postId: string): Promise<void> {
  return post<void>(`/posts/${postId}/like`);
}

/**
 * 取消点赞动态
 */
export function unlikePost(postId: string): Promise<void> {
  return del<void>(`/posts/${postId}/like`);
}

/**
 * 收藏动态
 */
export function favoritePost(postId: string): Promise<void> {
  return post<void>(`/posts/${postId}/favorite`);
}

/**
 * 取消收藏动态
 */
export function unfavoritePost(postId: string): Promise<void> {
  return del<void>(`/posts/${postId}/favorite`);
}

/**
 * 分享动态
 */
export function sharePost(postId: string): Promise<void> {
  return post<void>(`/posts/${postId}/share`);
}

/**
 * 获取动态的评论列表
 */
export function getPostComments(
  postId: string,
  params: PaginationParams
): Promise<PaginationResponse<Comment>> {
  return get<PaginationResponse<Comment>>(`/posts/${postId}/comments`, params);
}

/**
 * 创建评论
 */
export function createComment(params: CreateCommentParams): Promise<Comment> {
  return post<Comment>('/comments', params);
}

/**
 * 删除评论
 */
export function deleteComment(commentId: string): Promise<void> {
  return del<void>(`/comments/${commentId}`);
}

/**
 * 点赞评论
 */
export function likeComment(commentId: string): Promise<void> {
  return post<void>(`/comments/${commentId}/like`);
}

/**
 * 取消点赞评论
 */
export function unlikeComment(commentId: string): Promise<void> {
  return del<void>(`/comments/${commentId}/like`);
}
