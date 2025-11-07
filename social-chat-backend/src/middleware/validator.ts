import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * 验证请求数据
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : undefined,
      message: error.msg,
    }));

    res.status(400).json({
      code: 400,
      message: '请求参数验证失败',
      errors: errorMessages,
    });
    return;
  }

  next();
};
