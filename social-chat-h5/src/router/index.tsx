/**
 * 路由配置
 * 使用 React Router v6 进行路由管理
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loading } from '@/components/common';

/**
 * 懒加载页面组件
 */
const HomePage = lazy(() => import('@/pages/Home'));
const CommunityPage = lazy(() => import('@/pages/Community'));
const PublishPage = lazy(() => import('@/pages/Publish'));
const MessagePage = lazy(() => import('@/pages/Message'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const LoginPage = lazy(() => import('@/pages/Login'));

/**
 * 懒加载包装组件
 */
const LazyLoad: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Suspense fallback={<Loading fullscreen text="加载中..." />}>{children}</Suspense>;
};

/**
 * 路由守卫 - 需要登录的路由
 */
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TODO: 从 Redux 或 Context 获取登录状态
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 路由配置
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />
  },
  {
    path: '/login',
    element: (
      <LazyLoad>
        <LoginPage />
      </LazyLoad>
    )
  },
  {
    path: '/home',
    element: (
      <LazyLoad>
        <AuthGuard>
          <HomePage />
        </AuthGuard>
      </LazyLoad>
    )
  },
  {
    path: '/community',
    element: (
      <LazyLoad>
        <AuthGuard>
          <CommunityPage />
        </AuthGuard>
      </LazyLoad>
    )
  },
  {
    path: '/publish',
    element: (
      <LazyLoad>
        <AuthGuard>
          <PublishPage />
        </AuthGuard>
      </LazyLoad>
    )
  },
  {
    path: '/message',
    element: (
      <LazyLoad>
        <AuthGuard>
          <MessagePage />
        </AuthGuard>
      </LazyLoad>
    )
  },
  {
    path: '/profile',
    element: (
      <LazyLoad>
        <AuthGuard>
          <ProfilePage />
        </AuthGuard>
      </LazyLoad>
    )
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />
  }
]);
