/**
 * MainLayout - 主布局组件
 * 包含顶部导航栏和底部标签栏的通用布局
 */

import { ReactNode } from 'react';
import { TabBar } from './TabBar';
import { NavBar, NavBarProps } from './NavBar';

/**
 * 主布局属性接口
 */
export interface MainLayoutProps {
  /** 子内容 */
  children: ReactNode;
  /** 是否显示底部标签栏 */
  showTabBar?: boolean;
  /** 是否显示顶部导航栏 */
  showNavBar?: boolean;
  /** 导航栏配置 */
  navBarProps?: NavBarProps;
  /** 自定义类名 */
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showTabBar = true,
  showNavBar = false,
  navBarProps,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 顶部导航栏 */}
      {showNavBar && <NavBar {...navBarProps} />}

      {/* 主内容区域 */}
      <main
        className={`
          ${className}
          ${showNavBar ? 'pt-14' : ''}
          ${showTabBar ? 'pb-14' : ''}
        `}
      >
        <div className="max-w-screen-lg mx-auto">
          {children}
        </div>
      </main>

      {/* 底部标签栏 */}
      {showTabBar && <TabBar />}
    </div>
  );
};
