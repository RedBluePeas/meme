/**
 * Profile - 我的页面
 * 个人信息、设置、统计数据
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import {
  Heart,
  Star,
  Clock,
  Settings,
  Shield,
  Bell,
  Moon,
  Info,
  LogOut,
} from 'lucide-react';
import { MainLayout } from '@/components/Layout';
import { ProfileHeader, ProfileStats, SettingsList, SettingItem } from './components';
import { useAppSelector, useAppDispatch } from '@/store';
import { logoutAsync } from '@/store/slices/authSlice';
import { SSDialog } from '@/components/SSDialog';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  /**
   * 编辑资料
   */
  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  /**
   * 二维码名片
   */
  const handleQRCode = () => {
    SSDialog.toast.info('功能开发中');
  };

  /**
   * 设置项配置
   */
  const accountSettings: SettingItem[] = [
    {
      id: 'favorites',
      icon: <Heart size={20} />,
      title: '我的收藏',
      onClick: () => SSDialog.toast.info('功能开发中'),
    },
    {
      id: 'likes',
      icon: <Star size={20} />,
      title: '我的点赞',
      onClick: () => SSDialog.toast.info('功能开发中'),
    },
    {
      id: 'history',
      icon: <Clock size={20} />,
      title: '浏览历史',
      onClick: () => SSDialog.toast.info('功能开发中'),
    },
  ];

  const systemSettings: SettingItem[] = [
    {
      id: 'settings',
      icon: <Settings size={20} />,
      title: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      id: 'security',
      icon: <Shield size={20} />,
      title: '账号与安全',
      onClick: () => SSDialog.toast.info('功能开发中'),
    },
    {
      id: 'notifications',
      icon: <Bell size={20} />,
      title: '通知设置',
      onClick: () => SSDialog.toast.info('功能开发中'),
    },
    {
      id: 'theme',
      icon: <Moon size={20} />,
      title: '深色模式',
      onClick: () => SSDialog.toast.info('功能开发中'),
    },
    {
      id: 'about',
      icon: <Info size={20} />,
      title: '关于我们',
      onClick: () => SSDialog.toast.info('功能开发中'),
    },
  ];

  /**
   * 退出登录
   */
  const handleLogout = async () => {
    await SSDialog.confirm({
      title: '退出登录',
      content: '确定要退出登录吗？',
      onConfirm: async () => {
        await dispatch(logoutAsync()).unwrap();
        navigate('/login');
        SSDialog.toast.success('已退出登录');
      },
    });
  };

  if (!user) {
    return (
      <MainLayout
        showTabBar={true}
        showNavBar={true}
        navBarProps={{
          title: '我的',
          showBack: false,
        }}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-400 text-sm mb-4">未登录</p>
          <Button color="primary" onClick={() => navigate('/login')}>
            去登录
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      showTabBar={true}
      showNavBar={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* 个人信息头部 */}
        <ProfileHeader
          user={user}
          onEdit={handleEditProfile}
          onQRCode={handleQRCode}
        />

        {/* 统计数据 */}
        <ProfileStats
          user={user}
          onFollowing={() => SSDialog.toast.info('功能开发中')}
          onFollowers={() => SSDialog.toast.info('功能开发中')}
          onLikes={() => SSDialog.toast.info('功能开发中')}
        />

        {/* 账号设置 */}
        <div className="mt-4">
          <SettingsList items={accountSettings} title="我的内容" />
        </div>

        {/* 系统设置 */}
        <div className="mt-4">
          <SettingsList items={systemSettings} title="系统设置" />
        </div>

        {/* 退出登录 */}
        <div className="p-4">
          <Button
            fullWidth
            variant="bordered"
            color="danger"
            startContent={<LogOut size={18} />}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
