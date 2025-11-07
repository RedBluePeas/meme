/**
 * TabBar - 底部导航栏组件
 * 提供5个主要模块的导航：首页、社区、发布、消息、我的
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@heroui/react';
import {
  HomeIcon,
  UsersIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

/**
 * 导航项配置接口
 */
interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  path: string;
}

/**
 * 导航项配置
 */
const TAB_ITEMS: TabItem[] = [
  {
    key: 'home',
    label: '首页',
    icon: <HomeIcon className="w-6 h-6" />,
    activeIcon: <HomeIconSolid className="w-6 h-6" />,
    path: '/home'
  },
  {
    key: 'community',
    label: '社区',
    icon: <UsersIcon className="w-6 h-6" />,
    activeIcon: <UsersIconSolid className="w-6 h-6" />,
    path: '/community'
  },
  {
    key: 'publish',
    label: '发布',
    icon: <PlusCircleIcon className="w-6 h-6" />,
    activeIcon: <PlusCircleIconSolid className="w-6 h-6" />,
    path: '/publish'
  },
  {
    key: 'message',
    label: '消息',
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
    activeIcon: <ChatBubbleLeftRightIconSolid className="w-6 h-6" />,
    path: '/message'
  },
  {
    key: 'profile',
    label: '我的',
    icon: <UserIcon className="w-6 h-6" />,
    activeIcon: <UserIconSolid className="w-6 h-6" />,
    path: '/profile'
  }
];

export const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 判断是否是当前激活的标签
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  /**
   * 处理标签点击
   */
  const handleTabClick = (item: TabItem) => {
    // 发布页特殊处理：总是可以点击
    if (item.key === 'publish') {
      navigate(item.path);
      return;
    }

    // 其他页面：如果不是当前页才跳转
    if (!isActive(item.path)) {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around h-14 max-w-screen-lg mx-auto">
        {TAB_ITEMS.map((item) => {
          const active = isActive(item.path);

          return (
            <Button
              key={item.key}
              variant="light"
              className="flex-1 h-full rounded-none"
              onPress={() => handleTabClick(item)}
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <div className={active ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}>
                  {active ? item.activeIcon : item.icon}
                </div>
                <span
                  className={`text-xs leading-none transition-colors ${
                    active
                      ? 'text-primary font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
