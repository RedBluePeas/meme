import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config();

interface Config {
  env: string;
  port: number;
  apiPrefix: string;

  jwt: {
    secret: string;
    accessExpiration: string;
    refreshSecret: string;
    refreshExpiration: string;
  };

  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    poolMin: number;
    poolMax: number;
  };

  mongo: {
    uri: string;
    user?: string;
    password?: string;
  };

  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };

  upload: {
    dir: string;
    maxFileSize: number;
    allowedImageTypes: string[];
    allowedVideoTypes: string[];
  };

  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };

  cors: {
    origin: string;
    credentials: boolean;
  };

  logging: {
    level: string;
    dir: string;
  };

  websocket: {
    pingInterval: number;
    pingTimeout: number;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_here',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'social_chat_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },

  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/social_chat_messages',
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  upload: {
    dir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
    allowedVideoTypes: (process.env.ALLOWED_VIDEO_TYPES || 'video/mp4,video/webm').split(','),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || path.join(__dirname, '../../logs'),
  },

  websocket: {
    pingInterval: parseInt(process.env.WS_PING_INTERVAL || '25000', 10),
    pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '60000', 10),
  },
};

export default config;
