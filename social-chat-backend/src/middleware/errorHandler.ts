import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * 自定义错误类
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 记录错误
  logger.error('错误:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // 如果是自定义错误
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
    });
    return;
  }

  // 默认 500 错误
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
  });
};

/**
 * 404 处理中间件
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    code: 404,
    message: '请求的资源不存在',
  });
};
