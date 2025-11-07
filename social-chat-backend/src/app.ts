import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import config from './config';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import commentRoutes from './routes/comment';
import friendRoutes from './routes/friend';
import notificationRoutes from './routes/notification';
// import messageRoutes from './routes/message';

const app: Application = express();

// 安全头部
app.use(helmet());

// CORS 配置
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 压缩响应
app.use(compression());

// 速率限制
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    code: 429,
    message: '请求过于频繁，请稍后再试',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 请求日志
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'OK',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// API 路由
const apiPrefix = config.apiPrefix;

// 注册路由
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/posts`, postRoutes);
app.use(`${apiPrefix}`, commentRoutes); // 评论路由包含 /posts/:postId/comments 等
app.use(`${apiPrefix}/friends`, friendRoutes);
app.use(`${apiPrefix}/notifications`, notificationRoutes);
// app.use(`${apiPrefix}/messages`, messageRoutes);

// 临时测试路由
app.get(`${apiPrefix}/test`, (req, res) => {
  res.json({
    code: 200,
    message: 'API is working',
    data: {
      version: '1.0.0',
      environment: config.env,
    },
  });
});

// 404 处理
app.use(notFoundHandler);

// 全局错误处理
app.use(errorHandler);

export default app;
