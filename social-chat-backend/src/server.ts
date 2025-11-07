import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import config from './config';
import logger from './utils/logger';
import { testPostgresConnection, testMongoConnection, testRedisConnection, closeAllConnections } from './config/db';

// 创建 HTTP 服务器
const server = http.createServer(app);

// 创建 Socket.IO 服务器
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  },
  pingInterval: config.websocket.pingInterval,
  pingTimeout: config.websocket.pingTimeout,
});

// WebSocket 连接处理（稍后实现）
io.on('connection', (socket) => {
  logger.info('WebSocket 客户端已连接', { id: socket.id });

  socket.on('disconnect', () => {
    logger.info('WebSocket 客户端已断开', { id: socket.id });
  });
});

// 导出 io 实例供其他模块使用
export { io };

/**
 * 启动服务器
 */
const startServer = async () => {
  try {
    // 测试数据库连接
    logger.info('正在测试数据库连接...');

    const postgresConnected = await testPostgresConnection();
    if (!postgresConnected) {
      logger.warn('PostgreSQL 连接失败，但服务器将继续启动');
    }

    const mongoConnected = await testMongoConnection();
    if (!mongoConnected) {
      logger.warn('MongoDB 连接失败，但服务器将继续启动');
    }

    const redisConnected = await testRedisConnection();
    if (!redisConnected) {
      logger.warn('Redis 连接失败，但服务器将继续启动');
    }

    // 启动服务器
    server.listen(config.port, () => {
      logger.info(`服务器运行在端口 ${config.port}`);
      logger.info(`环境: ${config.env}`);
      logger.info(`API 地址: http://localhost:${config.port}${config.apiPrefix}`);
    });
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
};

/**
 * 优雅关闭
 */
const gracefulShutdown = async () => {
  logger.info('正在优雅关闭服务器...');

  server.close(() => {
    logger.info('HTTP 服务器已关闭');
  });

  io.close(() => {
    logger.info('WebSocket 服务器已关闭');
  });

  await closeAllConnections();

  process.exit(0);
};

// 监听进程信号
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// 未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  gracefulShutdown();
});

// 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的 Promise 拒绝:', { reason, promise });
  gracefulShutdown();
});

// 启动服务器
startServer();
