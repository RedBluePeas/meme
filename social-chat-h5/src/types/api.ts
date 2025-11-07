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
 * 与后端 API 返回结构保持一致（使用 items 而不是 list）
 */
export interface PaginationResponse<T> {
  items: T[];  // 后端使用 items
  total: number;
  page: number;
  pageSize: number;
  hasMore?: boolean;  // 可选，前端计算
}

/**
 * 列表响应（无分页）
 * 兼容旧版本，保留 list 字段
 */
export interface ListResponse<T> {
  list?: T[];
  items?: T[];  // 支持两种格式
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
