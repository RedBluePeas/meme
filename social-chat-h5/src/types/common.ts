/**
 * 通用类型定义
 */

/**
 * 基础选项
 */
export interface Option<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * 加载状态
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * 通用状态
 */
export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * 分页状态
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
