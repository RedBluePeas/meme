/**
 * Search - 搜索相关类型定义
 */

import { User, Post, Group } from './';

/**
 * 搜索类型
 */
export type SearchType = 'all' | 'user' | 'post' | 'group';

/**
 * 搜索结果
 */
export interface SearchResult {
  users: User[];
  posts: Post[];
  groups: Group[];
}

/**
 * 搜索参数
 */
export interface SearchParams {
  keyword: string;
  type?: SearchType;
  page?: number;
  pageSize?: number;
}

/**
 * 搜索历史
 */
export interface SearchHistory {
  id: string;
  keyword: string;
  createdAt: string;
}
