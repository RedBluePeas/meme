/**
 * Topic API - 话题相关接口
 */

import { get, post, del } from '../request';
import type { Topic, TopicCategory, Post, PaginationParams, PaginationResponse } from '@/types';

/**
 * 获取话题列表
 */
export function getTopics(params: {
  category?: string;
  page: number;
  pageSize: number;
}): Promise<PaginationResponse<Topic>> {
  return get<PaginationResponse<Topic>>('/topics', params);
}

/**
 * 获取话题详情
 */
export function getTopicDetail(topicId: string): Promise<Topic> {
  return get<Topic>(`/topics/${topicId}`);
}

/**
 * 获取推荐话题
 */
export function getRecommendTopics(params?: { limit?: number }): Promise<Topic[]> {
  return get<Topic[]>('/topics/recommend', params);
}

/**
 * 获取热门话题
 */
export function getHotTopics(params?: { limit?: number }): Promise<Topic[]> {
  return get<Topic[]>('/topics/hot', params);
}

/**
 * 获取我关注的话题
 */
export function getMyFollowedTopics(
  params: PaginationParams
): Promise<PaginationResponse<Topic>> {
  return get<PaginationResponse<Topic>>('/topics/my-followed', params);
}

/**
 * 搜索话题
 */
export function searchTopics(params: {
  keyword: string;
  page: number;
  pageSize: number;
}): Promise<PaginationResponse<Topic>> {
  return get<PaginationResponse<Topic>>('/topics/search', params);
}

/**
 * 关注话题
 */
export function followTopic(topicId: string): Promise<void> {
  return post<void>(`/topics/${topicId}/follow`);
}

/**
 * 取消关注话题
 */
export function unfollowTopic(topicId: string): Promise<void> {
  return del<void>(`/topics/${topicId}/follow`);
}

/**
 * 获取话题下的帖子
 */
export function getTopicPosts(
  topicId: string,
  params: PaginationParams & { sort?: 'latest' | 'hot' }
): Promise<PaginationResponse<Post>> {
  return get<PaginationResponse<Post>>(`/topics/${topicId}/posts`, params);
}

/**
 * 获取话题分类
 */
export function getTopicCategories(): Promise<TopicCategory[]> {
  return get<TopicCategory[]>('/topics/categories');
}

/**
 * 根据分类获取话题
 */
export function getTopicsByCategory(
  categoryId: string,
  params: PaginationParams
): Promise<PaginationResponse<Topic>> {
  return get<PaginationResponse<Topic>>(`/topics/category/${categoryId}`, params);
}
