/**
 * 本地存储工具类 (Social chat Service Storage Util)
 * 统一处理 localStorage 和 sessionStorage 操作，支持过期时间
 */

interface StorageData<T> {
  value: T;
  expire: number | null;
}

export class SSStorageUtil {
  /**
   * 设置localStorage（支持过期时间）
   * @param key - 键名
   * @param value - 值（自动JSON序列化）
   * @param expire - 过期时间（秒），不传则永久有效
   *
   * @example
   * SSStorageUtil.set('user', userInfo, 7 * 24 * 3600) // 7天后过期
   * SSStorageUtil.set('token', 'xxx') // 永久有效
   */
  static set<T>(key: string, value: T, expire?: number): void {
    try {
      const data: StorageData<T> = {
        value,
        expire: expire ? Date.now() + expire * 1000 : null
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('localStorage.setItem error:', error);
    }
  }

  /**
   * 获取localStorage
   * @param key - 键名
   * @returns 值（自动JSON反序列化），过期或不存在返回null
   *
   * @example
   * const user = SSStorageUtil.get<User>('user');
   */
  static get<T = unknown>(key: string): T | null {
    try {
      const json = localStorage.getItem(key);
      if (!json) return null;

      const data: StorageData<T> = JSON.parse(json);

      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        this.remove(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('localStorage.getItem error:', error);
      return null;
    }
  }

  /**
   * 删除localStorage
   * @param key - 键名
   *
   * @example
   * SSStorageUtil.remove('user');
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage.removeItem error:', error);
    }
  }

  /**
   * 清空localStorage
   *
   * @example
   * SSStorageUtil.clear();
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('localStorage.clear error:', error);
    }
  }

  /**
   * 检查键是否存在
   * @param key - 键名
   * @returns 是否存在
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * 获取所有键名
   * @returns 键名数组
   */
  static keys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('localStorage.keys error:', error);
      return [];
    }
  }

  /**
   * 获取存储大小（大约值，单位：字节）
   * @returns 大小
   */
  static getSize(): number {
    try {
      let size = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
      return size;
    } catch (error) {
      console.error('localStorage.getSize error:', error);
      return 0;
    }
  }

  /**
   * sessionStorage操作（无过期时间）
   */
  static session = {
    /**
     * 设置sessionStorage
     * @param key - 键名
     * @param value - 值
     */
    set<T>(key: string, value: T): void {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('sessionStorage.setItem error:', error);
      }
    },

    /**
     * 获取sessionStorage
     * @param key - 键名
     * @returns 值
     */
    get<T = unknown>(key: string): T | null {
      try {
        const json = sessionStorage.getItem(key);
        return json ? JSON.parse(json) : null;
      } catch (error) {
        console.error('sessionStorage.getItem error:', error);
        return null;
      }
    },

    /**
     * 删除sessionStorage
     * @param key - 键名
     */
    remove(key: string): void {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('sessionStorage.removeItem error:', error);
      }
    },

    /**
     * 清空sessionStorage
     */
    clear(): void {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('sessionStorage.clear error:', error);
      }
    },

    /**
     * 检查键是否存在
     * @param key - 键名
     * @returns 是否存在
     */
    has(key: string): boolean {
      return this.get(key) !== null;
    }
  };

  /**
   * Cookie操作
   */
  static cookie = {
    /**
     * 设置Cookie
     * @param name - 名称
     * @param value - 值
     * @param days - 有效天数
     * @param path - 路径
     */
    set(name: string, value: string, days = 7, path = '/'): void {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`;
    },

    /**
     * 获取Cookie
     * @param name - 名称
     * @returns 值
     */
    get(name: string): string | null {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    /**
     * 删除Cookie
     * @param name - 名称
     * @param path - 路径
     */
    remove(name: string, path = '/'): void {
      this.set(name, '', -1, path);
    }
  };
}

/**
 * 存储键名常量（统一管理，避免硬编码）
 */
export const StorageKeys = {
  // 用户相关
  USER_TOKEN: 'user_token',
  USER_INFO: 'user_info',
  USER_SETTINGS: 'user_settings',

  // 应用设置
  APP_THEME: 'app_theme',
  APP_LANGUAGE: 'app_language',

  // 草稿
  DRAFT_POST: 'draft_post',

  // 缓存
  CACHE_FEED: 'cache_feed',
  CACHE_TOPICS: 'cache_topics'
} as const;
