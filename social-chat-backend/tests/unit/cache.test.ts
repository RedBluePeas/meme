import { CacheService, CACHE_KEYS, CACHE_TTL } from '../../src/utils/cache';
import { redisClient } from '../../src/config/db';

// Mock Redis client
jest.mock('../../src/config/db', () => ({
  redisClient: {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    incrBy: jest.fn(),
    decrBy: jest.fn(),
    flushDb: jest.fn(),
  },
}));

describe('CacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed data when cache exists', async () => {
      const mockData = { id: '123', name: 'Test User' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const result = await CacheService.get('test-key');

      expect(redisClient.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(mockData);
    });

    it('should return null when cache does not exist', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const result = await CacheService.get('test-key');

      expect(result).toBeNull();
    });

    it('should return null and log error when Redis fails', async () => {
      (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await CacheService.get('test-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set cache with default TTL', async () => {
      const mockData = { id: '123', name: 'Test User' };
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      const result = await CacheService.set('test-key', mockData);

      expect(redisClient.setEx).toHaveBeenCalledWith(
        'test-key',
        CACHE_TTL.MEDIUM,
        JSON.stringify(mockData)
      );
      expect(result).toBe(true);
    });

    it('should set cache with custom TTL', async () => {
      const mockData = { id: '123' };
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      const result = await CacheService.set('test-key', mockData, CACHE_TTL.LONG);

      expect(redisClient.setEx).toHaveBeenCalledWith(
        'test-key',
        CACHE_TTL.LONG,
        JSON.stringify(mockData)
      );
      expect(result).toBe(true);
    });

    it('should return false when Redis fails', async () => {
      (redisClient.setEx as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await CacheService.set('test-key', { id: '123' });

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete cache successfully', async () => {
      (redisClient.del as jest.Mock).mockResolvedValue(1);

      const result = await CacheService.delete('test-key');

      expect(redisClient.del).toHaveBeenCalledWith('test-key');
      expect(result).toBe(true);
    });

    it('should return false when Redis fails', async () => {
      (redisClient.del as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await CacheService.delete('test-key');

      expect(result).toBe(false);
    });
  });

  describe('deletePattern', () => {
    it('should delete all keys matching pattern', async () => {
      const mockKeys = ['user:1', 'user:2', 'user:3'];
      (redisClient.keys as jest.Mock).mockResolvedValue(mockKeys);
      (redisClient.del as jest.Mock).mockResolvedValue(3);

      const result = await CacheService.deletePattern('user:*');

      expect(redisClient.keys).toHaveBeenCalledWith('user:*');
      expect(redisClient.del).toHaveBeenCalledWith(mockKeys);
      expect(result).toBe(3);
    });

    it('should return 0 when no keys match', async () => {
      (redisClient.keys as jest.Mock).mockResolvedValue([]);

      const result = await CacheService.deletePattern('user:*');

      expect(redisClient.keys).toHaveBeenCalledWith('user:*');
      expect(redisClient.del).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe('increment', () => {
    it('should increment counter by 1', async () => {
      (redisClient.incrBy as jest.Mock).mockResolvedValue(2);

      const result = await CacheService.increment('counter:1');

      expect(redisClient.incrBy).toHaveBeenCalledWith('counter:1', 1);
      expect(result).toBe(2);
    });

    it('should increment counter by custom amount', async () => {
      (redisClient.incrBy as jest.Mock).mockResolvedValue(15);

      const result = await CacheService.increment('counter:1', 10);

      expect(redisClient.incrBy).toHaveBeenCalledWith('counter:1', 10);
      expect(result).toBe(15);
    });
  });

  describe('remember', () => {
    it('should return cached data if exists', async () => {
      const mockData = { id: '123', name: 'Test' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const callback = jest.fn();
      const result = await CacheService.remember('test-key', CACHE_TTL.MEDIUM, callback);

      expect(redisClient.get).toHaveBeenCalledWith('test-key');
      expect(callback).not.toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should fetch from callback and cache if not exists', async () => {
      const mockData = { id: '123', name: 'Test' };
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      const callback = jest.fn().mockResolvedValue(mockData);
      const result = await CacheService.remember('test-key', CACHE_TTL.MEDIUM, callback);

      expect(redisClient.get).toHaveBeenCalledWith('test-key');
      expect(callback).toHaveBeenCalled();
      expect(redisClient.setEx).toHaveBeenCalledWith(
        'test-key',
        CACHE_TTL.MEDIUM,
        JSON.stringify(mockData)
      );
      expect(result).toEqual(mockData);
    });

    it('should not cache null values', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const callback = jest.fn().mockResolvedValue(null);
      const result = await CacheService.remember('test-key', CACHE_TTL.MEDIUM, callback);

      expect(callback).toHaveBeenCalled();
      expect(redisClient.setEx).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('business methods', () => {
    it('should get user info from cache', async () => {
      const mockUser = { id: 'user-123', username: 'testuser' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const result = await CacheService.getUserInfo('user-123');

      expect(redisClient.get).toHaveBeenCalledWith(`${CACHE_KEYS.USER_INFO}user-123`);
      expect(result).toEqual(mockUser);
    });

    it('should set user info in cache', async () => {
      const mockUser = { id: 'user-123', username: 'testuser' };
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      const result = await CacheService.setUserInfo('user-123', mockUser);

      expect(redisClient.setEx).toHaveBeenCalledWith(
        `${CACHE_KEYS.USER_INFO}user-123`,
        CACHE_TTL.LONG,
        JSON.stringify(mockUser)
      );
      expect(result).toBe(true);
    });

    it('should delete user info from cache', async () => {
      (redisClient.del as jest.Mock).mockResolvedValue(1);

      const result = await CacheService.deleteUserInfo('user-123');

      expect(redisClient.del).toHaveBeenCalledWith(`${CACHE_KEYS.USER_INFO}user-123`);
      expect(result).toBe(true);
    });
  });
});
