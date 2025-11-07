import knex from 'knex';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import { knexConfig } from './database';
import config from './index';
import logger from '../utils/logger';

// PostgreSQL 连接
export const db = knex(knexConfig);

// 测试 PostgreSQL 连接
export const testPostgresConnection = async (): Promise<boolean> => {
  try {
    await db.raw('SELECT 1');
    logger.info('PostgreSQL 连接成功');
    return true;
  } catch (error) {
    logger.error('PostgreSQL 连接失败:', error);
    return false;
  }
};

// MongoDB 连接
export const mongoClient = new MongoClient(config.mongo.uri, {
  auth: config.mongo.user && config.mongo.password
    ? {
        username: config.mongo.user,
        password: config.mongo.password,
      }
    : undefined,
});

// 测试 MongoDB 连接
export const testMongoConnection = async (): Promise<boolean> => {
  try {
    await mongoClient.connect();
    await mongoClient.db().admin().ping();
    logger.info('MongoDB 连接成功');
    return true;
  } catch (error) {
    logger.error('MongoDB 连接失败:', error);
    return false;
  }
};

// 获取 MongoDB 数据库实例
export const getMongoDb = () => {
  return mongoClient.db();
};

// Redis 连接
export const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password,
  database: config.redis.db,
});

// Redis 错误处理
redisClient.on('error', (error) => {
  logger.error('Redis 连接错误:', error);
});

redisClient.on('connect', () => {
  logger.info('Redis 连接成功');
});

// 测试 Redis 连接
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    await redisClient.connect();
    await redisClient.ping();
    logger.info('Redis 连接并测试成功');
    return true;
  } catch (error) {
    logger.error('Redis 连接失败:', error);
    return false;
  }
};

// 关闭所有数据库连接
export const closeAllConnections = async (): Promise<void> => {
  await db.destroy();
  await mongoClient.close();
  await redisClient.quit();
  logger.info('所有数据库连接已关闭');
};
