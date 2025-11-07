import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * 成功响应
 */
export const success = <T>(res: Response, data?: T, message = 'success', code = 200): void => {
  const response: ApiResponse<T> = {
    code,
    message,
    data,
  };
  res.status(code).json(response);
};

/**
 * 错误响应
 */
export const error = (res: Response, message: string, code = 400): void => {
  const response: ApiResponse = {
    code,
    message,
  };
  res.status(code).json(response);
};

/**
 * 分页响应
 */
export const paginated = <T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  message = 'success'
): void => {
  const totalPages = Math.ceil(total / pageSize);

  const response: ApiResponse = {
    code: 200,
    message,
    data: {
      items,
      total,
      page,
      pageSize,
      totalPages,
    },
  };

  res.status(200).json(response);
};
