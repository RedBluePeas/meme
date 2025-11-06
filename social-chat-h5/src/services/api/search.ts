/**
 * MagnifyingGlassIcon API - 搜索模块接口
 */

import { request } from '../request';
import { SearchResult, SearchParams, SearchHistory } from '@/types/models';

/**
 * 全局搜索
 */
export function globalSearch(params: SearchParams): Promise<SearchResult> {
  return request.get('/api/search', { params });
}

/**
 * 获取搜索历史
 */
export function getSearchHistory(): Promise<SearchHistory[]> {
  return request.get('/api/search/history');
}

/**
 * 保存搜索历史
 */
export function saveSearchHistory(keyword: string): Promise<void> {
  return request.post('/api/search/history', { keyword });
}

/**
 * 删除搜索历史
 */
export function deleteSearchHistory(id: string): Promise<void> {
  return request.delete(`/api/search/history/${id}`);
}

/**
 * 清空搜索历史
 */
export function clearSearchHistory(): Promise<void> {
  return request.delete('/api/search/history');
}
