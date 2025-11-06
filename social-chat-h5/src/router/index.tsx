/**
 * 路由配置
 * 使用 React Router v6 进行路由管理
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loading } from '@/components/common';
import { useAppSelector } from '@/store';

/**
 * 懒加载页面组件
 */
// 认证相关
const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));

// 主要页面
const HomePage = lazy(() => import('@/pages/Home'));
const CommunityPage = lazy(() => import('@/pages/Community'));
const PublishPage = lazy(() => import('@/pages/Publish'));
const MessagePage = lazy(() => import('@/pages/Message'));
const ProfilePage = lazy(() => import('@/pages/Profile'));

// 消息相关
const ChatRoomPage = lazy(() => import('@/pages/ChatRoom'));

// 联系人相关
const ContactPage = lazy(() => import('@/pages/Contact'));
const AddFriendPage = lazy(() => import('@/pages/AddFriend'));
const FriendRequestPage = lazy(() => import('@/pages/FriendRequest'));

// 个人中心相关
const EditProfilePage = lazy(() => import('@/pages/EditProfile'));
const SettingsPage = lazy(() => import('@/pages/Settings'));

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
  // 从 Redux 获取登录状态
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 路由配置
 */
export const router = createBrowserRouter([
  // 根路径重定向到首页
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },

  // ==================== 认证相关 ====================
  {
    path: '/login',
    element: (
      <LazyLoad>
        <LoginPage />
      </LazyLoad>
    ),
  },
  {
    path: '/register',
    element: (
      <LazyLoad>
        <RegisterPage />
      </LazyLoad>
    ),
  },

  // ==================== 主要页面（需要登录） ====================
  {
    path: '/home',
    element: (
      <LazyLoad>
        <AuthGuard>
          <HomePage />
        </AuthGuard>
      </LazyLoad>
    ),
  },
  {
    path: '/community',
    element: (
      <LazyLoad>
        <AuthGuard>
          <CommunityPage />
        </AuthGuard>
      </LazyLoad>
    ),
  },
  {
    path: '/publish',
    element: (
      <LazyLoad>
        <AuthGuard>
          <PublishPage />
        </AuthGuard>
      </LazyLoad>
    ),
  },
  {
    path: '/message',
    element: (
      <LazyLoad>
        <AuthGuard>
          <MessagePage />
        </AuthGuard>
      </LazyLoad>
    ),
  },
  {
    path: '/profile',
    element: (
      <LazyLoad>
        <AuthGuard>
          <ProfilePage />
        </AuthGuard>
      </LazyLoad>
    ),
  },

  // ==================== 消息相关 ====================
  {
    path: '/message/chat/:id',
    element: (
      <LazyLoad>
        <AuthGuard>
          <ChatRoomPage />
        </AuthGuard>
      </LazyLoad>
    ),
  },

  // ==================== 联系人相关 ====================
  {
    path: '/contact',
    element: (
      <LazyLoad>
        <AuthGuard>
          <ContactPage />
        </AuthGuard>
      </LazyLoad>
    ),
  },
  {
    path: '/contact/add',
    element: (
      <LazyLoad>
        <AuthGuard>
          <AddFriendPage />
        </AuthGuard>
      </LazyLoad>
    ),
  },
  {
    path: '/contact/requests',
    element: (
      <LazyLoad>
        <AuthGuard>
          <FriendRequestPage />
        </AuthGuard>
      </LazyLoad>
    ),
  },

  // ==================== 个人中心相关 ====================
  {
    path: '/profile/edit',
    element: (
      <LazyLoad>
        <AuthGuard>
          <EditProfilePage />
        </AuthGuard>
      </LazyLoad>
    ),
  },
  {
    path: '/settings',
    element: (
      <LazyLoad>
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      </LazyLoad>
    ),
  },

  // ==================== 404 ====================
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);
