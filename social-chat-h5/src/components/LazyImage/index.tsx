/**
 * LazyImage - 图片懒加载组件
 * 使用 Intersection Observer API 实现图片懒加载
 */

import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from '@nextui-org/react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 图片 URL */
  src: string;
  /** 占位图 URL */
  placeholder?: string;
  /** 加载失败时的占位图 */
  fallback?: string;
  /** 根元素的 margin，用于提前加载 */
  rootMargin?: string;
  /** 是否显示加载指示器 */
  showLoading?: boolean;
  /** 图片容器类名 */
  containerClassName?: string;
  /** 图片加载成功回调 */
  onLoad?: () => void;
  /** 图片加载失败回调 */
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholder,
  fallback = '/assets/image-placeholder.png',
  alt = '',
  rootMargin = '50px',
  showLoading = false,
  containerClassName = '',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer 监听图片是否进入可视区域
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  // 当图片进入可视区域时，开始加载真实图片
  useEffect(() => {
    if (!isInView || !src) return;

    setIsLoading(true);
    setIsError(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      onLoad?.();
    };

    img.onerror = () => {
      setImageSrc(fallback);
      setIsLoading(false);
      setIsError(true);
      onError?.();
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, src, fallback, onLoad, onError]);

  return (
    <div className={`relative inline-block ${containerClassName}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />

      {/* 加载指示器 */}
      {showLoading && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Spinner size="sm" />
        </div>
      )}

      {/* 错误状态 */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          加载失败
        </div>
      )}
    </div>
  );
};

export default LazyImage;
