/**
 * Contact - 联系人页面
 * 显示好友列表、好友请求、添加好友
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '@heroui/react';
import { UserPlusIcon, UsersIcon, BellIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { PullRefresh } from '@/components/common';
import { FriendList } from './components';
import { useContact } from '@/hooks/useContact';
import { Friend } from '@/types/models';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    friends,
    friendsLoading,
    loadFriends,
    friendGroups,
    loadFriendGroups,
    pendingRequestCount,
  } = useContact();

  /**
   * 初始化
   */
  useEffect(() => {
    // 加载好友列表
    loadFriends();
    // 加载分组
    loadFriendGroups();
  }, []);

  /**
   * 处理下拉刷新
   */
  const handleRefresh = async () => {
    await Promise.all([loadFriends(), loadFriendGroups()]);
  };

  /**
   * 点击好友
   */
  const handleClickFriend = (friend: Friend) => {
    navigate(`/contact/${friend.friendshipId}`);
  };

  /**
   * 添加好友
   */
  const handleAddFriend = () => {
    navigate('/contact/add');
  };

  /**
   * 好友请求列表
   */
  const handleFriendRequests = () => {
    navigate('/contact/requests');
  };

  /**
   * 群组列表
   */
  const handleGroupList = () => {
    navigate('/groups');
  };

  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '联系人',
        showBack: false,
        rightContent: (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={handleAddFriend}
          >
            <UserPlusIcon className="w-5 h-5" />
          </Button>
        ),
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        {/* 功能入口 */}
        <div className="bg-white mb-2">
          {/* 好友请求 */}
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100"
            onClick={handleFriendRequests}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-orange-500" />
              </div>
              <span className="font-medium text-gray-900">好友请求</span>
            </div>
            {pendingRequestCount > 0 && (
              <Badge content={pendingRequestCount} color="danger" />
            )}
          </div>

          {/* 群组列表 */}
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
            onClick={handleGroupList}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-medium text-gray-900">我的群组</span>
            </div>
          </div>
        </div>

        {/* 好友统计 */}
        {friends.length > 0 && (
          <div className="px-4 py-2 bg-gray-50">
            <p className="text-sm text-gray-500">
              好友 ({friends.length})
            </p>
          </div>
        )}

        {/* 下拉刷新 */}
        <PullRefresh onRefresh={handleRefresh}>
          <div className="bg-white">
            <FriendList
              friends={friends}
              groups={friendGroups}
              loading={friendsLoading}
              onClick={handleClickFriend}
            />
          </div>
        </PullRefresh>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
