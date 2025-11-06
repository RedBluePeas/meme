/**
 * Avatar - 头像组件
 * 支持图片、文字、在线状态显示
 */

import { Avatar as NextAvatar, AvatarProps as NextAvatarProps } from '@nextui-org/react';

/**
 * 头像组件属性
 */
export interface AvatarProps extends Omit<NextAvatarProps, 'src'> {
  /** 头像图片URL */
  src?: string;
  /** 用户名（用于显示首字母） */
  name?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示在线状态 */
  showOnline?: boolean;
  /** 在线状态 */
  isOnline?: boolean;
  /** 点击回调 */
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  showOnline = false,
  isOnline = false,
  onClick,
  className = '',
  ...props
}) => {
  /**
   * 获取用户名首字母
   */
  const getInitials = (name: string): string => {
    if (!name) return '?';

    // 如果是中文，取第一个字
    if (/[\u4e00-\u9fa5]/.test(name)) {
      return name.charAt(0);
    }

    // 如果是英文，取首字母
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className="relative inline-block">
      <NextAvatar
        src={src}
        name={!src ? getInitials(name) : undefined}
        size={size}
        className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        {...props}
      />

      {/* 在线状态指示器 */}
      {showOnline && (
        <span
          className={`
            absolute bottom-0 right-0
            ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-2.5 h-2.5' : 'w-3 h-3'}
            rounded-full border-2 border-white dark:border-gray-900
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
          `}
        />
      )}
    </div>
  );
};
