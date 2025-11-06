/**
 * Performance Utilities - 性能优化工具函数
 */

/**
 * 防抖函数
 * 在事件触发后，延迟执行函数，如果在延迟期间再次触发，则重新计时
 *
 * @param func 要防抖的函数
 * @param wait 延迟时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 *
 * @example
 * const handleSearch = debounce((keyword: string) => {
 *   console.log('搜索:', keyword);
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * 节流函数
 * 在指定时间内，只执行一次函数
 *
 * @param func 要节流的函数
 * @param wait 时间间隔（毫秒）
 * @param options 配置选项
 * @returns 节流后的函数
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('滚动中...');
 * }, 100);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  const { leading = true, trailing = true } = options;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();

    if (!previous && !leading) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * 请求动画帧节流
 * 使用 requestAnimationFrame 实现的节流，适合动画和滚动场景
 *
 * @param func 要节流的函数
 * @returns 节流后的函数
 *
 * @example
 * const handleScroll = rafThrottle(() => {
 *   console.log('滚动中...');
 * });
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      func.apply(context, args);
      rafId = null;
    });
  };
}

/**
 * 延迟执行
 * 返回一个 Promise，在指定时间后 resolve
 *
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 *
 * @example
 * await sleep(1000);
 * console.log('1秒后执行');
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 批量请求
 * 将多个请求合并成一个批次，减少请求次数
 *
 * @param func 请求函数
 * @param wait 等待时间（毫秒）
 * @returns 批量请求函数
 *
 * @example
 * const batchFetch = batch((ids: string[]) => {
 *   return api.getUsersByIds(ids);
 * }, 50);
 *
 * batchFetch('id1').then(user => console.log(user));
 * batchFetch('id2').then(user => console.log(user));
 * // 50ms 后一次性请求 ['id1', 'id2']
 */
export function batch<T, R>(
  func: (items: T[]) => Promise<R[]>,
  wait: number
): (item: T) => Promise<R> {
  let queue: Array<{ item: T; resolve: (value: R) => void; reject: (error: any) => void }> = [];
  let timeout: NodeJS.Timeout | null = null;

  const flush = async () => {
    const currentQueue = queue;
    queue = [];
    timeout = null;

    try {
      const items = currentQueue.map((q) => q.item);
      const results = await func(items);

      currentQueue.forEach((q, index) => {
        q.resolve(results[index]);
      });
    } catch (error) {
      currentQueue.forEach((q) => {
        q.reject(error);
      });
    }
  };

  return (item: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      queue.push({ item, resolve, reject });

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(flush, wait);
    });
  };
}

/**
 * 缓存函数结果
 * 使用 LRU 缓存策略缓存函数结果
 *
 * @param func 要缓存的函数
 * @param options 配置选项
 * @returns 缓存后的函数
 *
 * @example
 * const getUser = memoize((id: string) => {
 *   return api.getUser(id);
 * }, { maxSize: 100, ttl: 60000 });
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  options: { maxSize?: number; ttl?: number; resolver?: (...args: Parameters<T>) => string } = {}
): T {
  const { maxSize = 100, ttl, resolver = (...args: any[]) => JSON.stringify(args) } = options;

  const cache = new Map<string, { value: any; timestamp: number }>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver(...args);
    const cached = cache.get(key);

    // 检查缓存是否有效
    if (cached) {
      if (!ttl || Date.now() - cached.timestamp < ttl) {
        return cached.value;
      }
      cache.delete(key);
    }

    // 执行函数并缓存结果
    const result = func.apply(this, args);
    cache.set(key, { value: result, timestamp: Date.now() });

    // LRU: 超出大小限制时，删除最早的缓存
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  } as T;
}

/**
 * 只执行一次
 * 确保函数只执行一次
 *
 * @param func 要执行的函数
 * @returns 包装后的函数
 *
 * @example
 * const initialize = once(() => {
 *   console.log('初始化');
 * });
 *
 * initialize(); // 输出: 初始化
 * initialize(); // 不会再次执行
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false;
  let result: any;

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = func.apply(this, args);
    }
    return result;
  } as T;
}
