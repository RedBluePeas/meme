/**
 * usePerformance Hooks - 性能优化相关 Hooks
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce, throttle, rafThrottle } from '@/utils/performance';

/**
 * useDebounce Hook
 * 防抖 Hook，用于处理高频事件
 *
 * @param callback 回调函数
 * @param delay 延迟时间（毫秒）
 * @param deps 依赖数组
 * @returns 防抖后的函数
 *
 * @example
 * const handleSearch = useDebounce((keyword: string) => {
 *   searchApi(keyword);
 * }, 300, []);
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(
    () =>
      debounce((...args: Parameters<T>) => {
        return callbackRef.current(...args);
      }, delay),
    [delay, ...deps]
  ) as T;
}

/**
 * useThrottle Hook
 * 节流 Hook，用于限制函数执行频率
 *
 * @param callback 回调函数
 * @param delay 时间间隔（毫秒）
 * @param deps 依赖数组
 * @returns 节流后的函数
 *
 * @example
 * const handleScroll = useThrottle(() => {
 *   console.log('滚动中...');
 * }, 100, []);
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(
    () =>
      throttle((...args: Parameters<T>) => {
        return callbackRef.current(...args);
      }, delay),
    [delay, ...deps]
  ) as T;
}

/**
 * useRafThrottle Hook
 * 使用 requestAnimationFrame 的节流 Hook
 *
 * @param callback 回调函数
 * @param deps 依赖数组
 * @returns 节流后的函数
 *
 * @example
 * const handleScroll = useRafThrottle(() => {
 *   console.log('滚动中...');
 * }, []);
 */
export function useRafThrottle<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList = []
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(
    () =>
      rafThrottle((...args: Parameters<T>) => {
        return callbackRef.current(...args);
      }),
    [...deps]
  ) as T;
}

/**
 * useIntersectionObserver Hook
 * Intersection Observer Hook，用于监听元素是否进入可视区域
 *
 * @param callback 回调函数
 * @param options Intersection Observer 配置
 * @returns ref 对象
 *
 * @example
 * const ref = useIntersectionObserver((isIntersecting) => {
 *   if (isIntersecting) {
 *     console.log('元素进入可视区域');
 *   }
 * }, { threshold: 0.5 });
 *
 * return <div ref={ref}>内容</div>;
 */
export function useIntersectionObserver(
  callback: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const callbackRef = useRef(callback);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callbackRef.current(entry.isIntersecting, entry);
      });
    }, options);

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return elementRef;
}

/**
 * useLoadMore Hook
 * 滚动加载更多 Hook
 *
 * @param onLoadMore 加载更多回调
 * @param options 配置选项
 * @returns ref 对象
 *
 * @example
 * const ref = useLoadMore(loadMore, { threshold: 200 });
 *
 * return (
 *   <div ref={ref} className="overflow-auto">
 *     {items.map(item => <Item key={item.id} data={item} />)}
 *   </div>
 * );
 */
export function useLoadMore(
  onLoadMore: () => void,
  options: { threshold?: number; hasMore?: boolean; loading?: boolean } = {}
) {
  const { threshold = 200, hasMore = true, loading = false } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onLoadMore);

  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  const handleScroll = useThrottle(() => {
    if (!containerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      callbackRef.current();
    }
  }, 200);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return containerRef;
}

/**
 * usePullToRefresh Hook
 * 下拉刷新 Hook
 *
 * @param onRefresh 刷新回调
 * @param options 配置选项
 * @returns 相关状态和方法
 *
 * @example
 * const { isPulling, isRefreshing, containerRef } = usePullToRefresh(async () => {
 *   await fetchData();
 * }, { threshold: 80 });
 *
 * return (
 *   <div ref={containerRef}>
 *     {isRefreshing && <Spinner />}
 *     {content}
 *   </div>
 * );
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options: { threshold?: number; disabled?: boolean } = {}
) {
  const { threshold = 80, disabled = false } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const pullDistanceRef = useRef(0);
  const [isPulling, setIsPulling] = useCallback((value: boolean) => {
    // Placeholder for state update
  }, []);
  const [isRefreshing, setIsRefreshing] = useCallback((value: boolean) => {
    // Placeholder for state update
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0) {
        pullDistanceRef.current = distance;
        setIsPulling(true);
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistanceRef.current >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      startYRef.current = 0;
      pullDistanceRef.current = 0;
      setIsPulling(false);
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, threshold, onRefresh]);

  return { isPulling, isRefreshing, containerRef };
}

/**
 * useImagePreload Hook
 * 图片预加载 Hook
 *
 * @param urls 图片 URL 数组
 * @returns 加载状态
 *
 * @example
 * const { loaded, progress } = useImagePreload([
 *   '/image1.jpg',
 *   '/image2.jpg',
 * ]);
 *
 * if (!loaded) {
 *   return <div>加载中... {progress}%</div>;
 * }
 */
export function useImagePreload(urls: string[]) {
  const [loaded, setLoaded] = useCallback((value: boolean) => {
    // Placeholder
  }, []);
  const [progress, setProgress] = useCallback((value: number) => {
    // Placeholder
  }, []);

  useEffect(() => {
    if (urls.length === 0) {
      setLoaded(true);
      return;
    }

    let loadedCount = 0;

    const loadImage = (url: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / urls.length) * 100));
          resolve(url);
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    Promise.all(urls.map(loadImage))
      .then(() => {
        setLoaded(true);
      })
      .catch((error) => {
        console.error('图片预加载失败:', error);
      });
  }, [urls]);

  return { loaded, progress };
}
