/**
 * API 相关类型定义
 */

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 列表响应（无分页）
 */
export interface ListResponse<T> {
  list: T[];
  total: number;
}

/**
 * 错误响应
 */
export interface ApiError {
  code: number;
  message: string;
  errors?: Record<string, string[]>;
}
