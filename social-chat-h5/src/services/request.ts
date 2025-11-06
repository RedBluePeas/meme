/**
 * HTTP 请求封装
 * 基于 Axios 的统一请求配置
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types';
import { SSStorageUtil } from '@/utils';
import { SSDialog } from '@/components/SSDialog';

// API 基础路径
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = SSStorageUtil.get('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 成功响应，返回数据
    if (data.code === 0 || data.code === 200) {
      return response;
    }

    // 业务错误
    handleBusinessError(data);
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  (error: AxiosError<ApiError>) => {
    // 网络错误或 HTTP 错误
    handleHttpError(error);
    return Promise.reject(error);
  }
);

/**
 * 处理业务错误
 */
function handleBusinessError(data: ApiResponse) {
  const errorMessage = data.message || '操作失败';

  // 特殊错误码处理
  switch (data.code) {
    case 401:
      // 未登录或 token 过期
      SSStorageUtil.remove('auth_token');
      SSStorageUtil.remove('user_info');
      SSDialog.toast('登录已过期，请重新登录', 'error');
      // 跳转到登录页
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      break;

    case 403:
      SSDialog.toast('没有权限执行此操作', 'error');
      break;

    case 404:
      SSDialog.toast('请求的资源不存在', 'error');
      break;

    case 500:
      SSDialog.toast('服务器错误，请稍后重试', 'error');
      break;

    default:
      SSDialog.toast(errorMessage, 'error');
      break;
  }
}

/**
 * 处理 HTTP 错误
 */
function handleHttpError(error: AxiosError<ApiError>) {
  if (error.response) {
    // 服务器返回了错误状态码
    const { status, data } = error.response;
    const message = data?.message || `HTTP ${status} 错误`;

    switch (status) {
      case 401:
        SSStorageUtil.remove('auth_token');
        SSStorageUtil.remove('user_info');
        SSDialog.toast('登录已过期，请重新登录', 'error');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        break;

      case 403:
        SSDialog.toast('没有权限访问', 'error');
        break;

      case 404:
        SSDialog.toast('请求的资源不存在', 'error');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        SSDialog.toast('服务器错误，请稍后重试', 'error');
        break;

      default:
        SSDialog.toast(message, 'error');
        break;
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    SSDialog.toast('网络连接失败，请检查网络', 'error');
  } else {
    // 其他错误
    SSDialog.toast('请求失败，请稍后重试', 'error');
  }

  console.error('HTTP error:', error);
}

/**
 * GET 请求
 */
export function get<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request
    .get<ApiResponse<T>>(url, { params, ...config })
    .then((response) => response.data.data);
}

/**
 * POST 请求
 */
export function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request
    .post<ApiResponse<T>>(url, data, config)
    .then((response) => response.data.data);
}

/**
 * PUT 请求
 */
export function put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request
    .put<ApiResponse<T>>(url, data, config)
    .then((response) => response.data.data);
}

/**
 * DELETE 请求
 */
export function del<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request
    .delete<ApiResponse<T>>(url, config)
    .then((response) => response.data.data);
}

/**
 * 文件上传
 */
export function upload<T = any>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  return request
    .post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    })
    .then((response) => response.data.data);
}

// 导出 axios 实例
export { request };
export default request;
