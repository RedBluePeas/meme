/**
 * NavBar - 顶部导航栏组件
 * 支持标题、返回按钮、右侧操作按钮等配置
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';

/**
 * 导航栏属性接口
 */
export interface NavBarProps {
  /** 标题 */
  title?: string;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 返回按钮点击回调 */
  onBack?: () => void;
  /** 右侧内容 */
  rightContent?: React.ReactNode;
  /** 是否固定在顶部 */
  fixed?: boolean;
  /** 是否透明背景 */
  transparent?: boolean;
  /** 自定义类名 */
  className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightContent,
  fixed = true,
  transparent = false,
  className = ''
}) => {
  const navigate = useNavigate();

  /**
   * 处理返回按钮点击
   */
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const bgClass = transparent
    ? 'bg-transparent'
    : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800';

  const positionClass = fixed ? 'fixed top-0 left-0 right-0 z-40' : 'relative';

  return (
    <nav
      className={`${positionClass} ${bgClass} ${className} safe-area-top`}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-lg mx-auto">
        {/* 左侧：返回按钮 */}
        <div className="flex-shrink-0 w-16">
          {showBack && (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={handleBack}
              aria-label="返回"
            >
              <span className="text-xl">←</span>
            </Button>
          )}
        </div>

        {/* 中间：标题 */}
        <div className="flex-1 text-center px-2">
          {title && (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
          )}
        </div>

        {/* 右侧：自定义内容 */}
        <div className="flex-shrink-0 w-16 flex justify-end">
          {rightContent}
        </div>
      </div>
    </nav>
  );
};
