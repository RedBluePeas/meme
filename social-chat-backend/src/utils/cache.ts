import { redisClient } from '../config/db';
import logger from './logger';

/**
 * 缓存键前缀
 */
export const CACHE_KEYS = {
  USER_INFO: 'user:info:',
  USER_PROFILE: 'user:profile:',
  POST_DETAIL: 'post:detail:',
  POST_FEED: 'post:feed:',
  COMMENT_LIST: 'post:comments:',
  FRIEND_LIST: 'friend:list:',
  ONLINE_USERS: 'users:online',
  TRENDING_POSTS: 'posts:trending',
  UNREAD_COUNT: 'unread:',
};

/**
 * 缓存过期时间（秒）
 */
export const CACHE_TTL = {
  SHORT: 60, // 1分钟
  MEDIUM: 300, // 5分钟
  LONG: 1800, // 30分钟
  VERY_LONG: 3600, // 1小时
  DAY: 86400, // 1天
};

/**
 * 缓存服务
 */
export class CacheService {
  /**
   * 获取缓存
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error('获取缓存失败', { key, error });
      return null;
    }
  }

  /**
   * 设置缓存
   */
  static async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await redisClient.setEx(key, ttl, serialized);
      return true;
    } catch (error) {
      logger.error('设置缓存失败', { key, error });
      return false;
    }
  }

  /**
   * 删除缓存
   */
  static async delete(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error('删除缓存失败', { key, error });
      return false;
    }
  }

  /**
   * 批量删除缓存（通过模式匹配）
   */
  static async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }
      await redisClient.del(keys);
      return keys.length;
    } catch (error) {
      logger.error('批量删除缓存失败', { pattern, error });
      return 0;
    }
  }

  /**
   * 检查缓存是否存在
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('检查缓存失败', { key, error });
      return false;
    }
  }

  /**
   * 设置缓存过期时间
   */
  static async expire(key: string, ttl: number): Promise<boolean> {
    try {
      await redisClient.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('设置缓存过期时间失败', { key, error });
      return false;
    }
  }

  /**
   * 获取剩余过期时间
   */
  static async ttl(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      logger.error('获取缓存过期时间失败', { key, error });
      return -1;
    }
  }

  /**
   * 递增
   */
  static async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await redisClient.incrBy(key, amount);
    } catch (error) {
      logger.error('递增缓存失败', { key, error });
      throw error;
    }
  }

  /**
   * 递减
   */
  static async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      return await redisClient.decrBy(key, amount);
    } catch (error) {
      logger.error('递减缓存失败', { key, error });
      throw error;
    }
  }

  /**
   * 缓存优先获取数据（如果缓存不存在，从数据库获取并缓存）
   */
  static async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>
  ): Promise<T | null> {
    try {
      // 先尝试从缓存获取
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // 缓存不存在，从数据库获取
      const data = await callback();
      if (data) {
        await this.set(key, data, ttl);
      }

      return data;
    } catch (error) {
      logger.error('缓存优先获取数据失败', { key, error });
      // 如果缓存失败，直接返回数据库数据
      return await callback();
    }
  }

  /**
   * 清除所有缓存
   */
  static async flush(): Promise<boolean> {
    try {
      await redisClient.flushDb();
      logger.info('已清除所有缓存');
      return true;
    } catch (error) {
      logger.error('清除所有缓存失败', error);
      return false;
    }
  }

  // ==================== 业务专用方法 ====================

  /**
   * 获取用户信息缓存
   */
  static async getUserInfo(userId: string): Promise<any> {
    return this.get(`${CACHE_KEYS.USER_INFO}${userId}`);
  }

  /**
   * 设置用户信息缓存
   */
  static async setUserInfo(userId: string, userInfo: any): Promise<boolean> {
    return this.set(`${CACHE_KEYS.USER_INFO}${userId}`, userInfo, CACHE_TTL.LONG);
  }

  /**
   * 删除用户信息缓存
   */
  static async deleteUserInfo(userId: string): Promise<boolean> {
    return this.delete(`${CACHE_KEYS.USER_INFO}${userId}`);
  }

  /**
   * 获取帖子详情缓存
   */
  static async getPostDetail(postId: string): Promise<any> {
    return this.get(`${CACHE_KEYS.POST_DETAIL}${postId}`);
  }

  /**
   * 设置帖子详情缓存
   */
  static async setPostDetail(postId: string, postDetail: any): Promise<boolean> {
    return this.set(`${CACHE_KEYS.POST_DETAIL}${postId}`, postDetail, CACHE_TTL.MEDIUM);
  }

  /**
   * 删除帖子详情缓存
   */
  static async deletePostDetail(postId: string): Promise<boolean> {
    return this.delete(`${CACHE_KEYS.POST_DETAIL}${postId}`);
  }

  /**
   * 清除用户相关的所有缓存
   */
  static async clearUserCache(userId: string): Promise<void> {
    await Promise.all([
      this.deletePattern(`${CACHE_KEYS.USER_INFO}${userId}`),
      this.deletePattern(`${CACHE_KEYS.USER_PROFILE}${userId}`),
      this.deletePattern(`${CACHE_KEYS.POST_FEED}${userId}*`),
      this.deletePattern(`${CACHE_KEYS.FRIEND_LIST}${userId}*`),
    ]);
  }

  /**
   * 清除帖子相关的所有缓存
   */
  static async clearPostCache(postId: string): Promise<void> {
    await Promise.all([
      this.deletePattern(`${CACHE_KEYS.POST_DETAIL}${postId}`),
      this.deletePattern(`${CACHE_KEYS.COMMENT_LIST}${postId}*`),
      this.deletePattern(`${CACHE_KEYS.POST_FEED}*`), // 清除所有用户的动态流缓存
    ]);
  }
}

/**
 * 缓存装饰器（用于方法级缓存）
 */
export function Cacheable(keyPrefix: string, ttl: number = CACHE_TTL.MEDIUM) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // 构建缓存键（使用参数作为键的一部分）
      const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;

      // 尝试从缓存获取
      const cached = await CacheService.get(cacheKey);
      if (cached !== null) {
        logger.debug('从缓存获取数据', { cacheKey });
        return cached;
      }

      // 执行原方法
      const result = await originalMethod.apply(this, args);

      // 缓存结果
      if (result) {
        await CacheService.set(cacheKey, result, ttl);
      }

      return result;
    };

    return descriptor;
  };
}
