/**
 * Empty - 空状态组件
 * 用于列表、搜索结果等为空时的占位显示
 */

import { Button } from '@heroui/react';
import { InboxIcon } from '@heroicons/react/24/outline';

/**
 * 空状态组件属性
 */
export interface EmptyProps {
  /** 描述文字 */
  description?: string;
  /** 图标/图片 */
  icon?: React.ReactNode;
  /** 按钮文字 */
  actionText?: string;
  /** 按钮点击回调 */
  onAction?: () => void;
  /** 自定义类名 */
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  description = '暂无数据',
  icon = <InboxIcon className="w-16 h-16" />,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {/* 图标 */}
      <div className="mb-4 text-gray-300">
        {icon}
      </div>

      {/* 描述文字 */}
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 text-center">
        {description}
      </p>

      {/* 操作按钮 */}
      {actionText && onAction && (
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
