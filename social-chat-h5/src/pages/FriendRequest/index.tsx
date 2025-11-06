/**
 * FriendRequest - 好友请求页面
 * 显示收到的好友请求，支持接受或拒绝
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, CardBody, Spinner } from '@heroui/react';
import { ClockIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { PullRefresh, InfiniteScroll } from '@/components/common';
import { useContact } from '@/hooks/useContact';
import { FriendRequest } from '@/types/models';
import { formatRelativeTime } from '@/utils/format';

const FriendRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    friendRequests,
    friendRequestsLoading,
    friendRequestsHasMore,
    loadFriendRequests,
    refreshFriendRequests,
    handleFriendRequest,
  } = useContact();

  /**
   * 初始化
   */
  useEffect(() => {
    loadFriendRequests(true);
  }, []);

  /**
   * 处理下拉刷新
   */
  const handleRefresh = async () => {
    await refreshFriendRequests();
  };

  /**
   * 处理加载更多
   */
  const handleLoadMore = () => {
    loadFriendRequests();
  };

  /**
   * 接受好友请求
   */
  const handleAccept = async (request: FriendRequest) => {
    await handleFriendRequest({
      requestId: request.id,
      accept: true,
    });
  };

  /**
   * 拒绝好友请求
   */
  const handleReject = async (request: FriendRequest) => {
    await handleFriendRequest({
      requestId: request.id,
      accept: false,
    });
  };

  /**
   * 渲染请求状态标签
   */
  const renderStatusBadge = (status: FriendRequest['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded">
            已接受
          </span>
        );
      case 'rejected':
        return (
          <span className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded">
            已拒绝
          </span>
        );
      case 'expired':
        return (
          <span className="text-xs text-gray-600 px-2 py-1 bg-gray-50 rounded">
            已过期
          </span>
        );
      default:
        return null;
    }
  };

  /**
   * 渲染空状态
   */
  if (!friendRequestsLoading && friendRequests.length === 0) {
    return (
      <MainLayout
        showTabBar={false}
        showNavBar={true}
        navBarProps={{
          title: '好友请求',
          showBack: true,
          onBack: () => navigate(-1),
        }}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-400 text-sm">暂无好友请求</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '好友请求',
        showBack: true,
        onBack: () => navigate(-1),
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <PullRefresh onRefresh={handleRefresh}>
          <div className="p-4 space-y-3">
            {/* 请求列表 */}
            {friendRequests.map((request) => (
              <Card key={request.id} className="shadow-sm">
                <CardBody>
                  <div className="flex items-start gap-3">
                    {/* 头像 */}
                    <Avatar
                      src={request.sender.avatar}
                      alt={request.sender.nickname}
                      size="lg"
                      className="flex-shrink-0 mt-1"
                    />

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      {/* 用户名和时间 */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {request.sender.nickname}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <ClockIcon className="w-3 h-3" />
                          <span>{formatRelativeTime(request.createdAt)}</span>
                        </div>
                      </div>

                      {/* 验证消息 */}
                      {request.message && (
                        <p className="text-sm text-gray-600 mb-3">
                          验证消息：{request.message}
                        </p>
                      )}

                      {/* 来源 */}
                      {request.source && (
                        <p className="text-xs text-gray-400 mb-3">
                          来源：{request.source}
                        </p>
                      )}

                      {/* 操作按钮 */}
                      {request.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            startContent={<CheckIcon className="w-3.5 h-3.5" />}
                            onClick={() => handleAccept(request)}
                            className="flex-1"
                          >
                            接受
                          </Button>
                          <Button
                            size="sm"
                            variant="bordered"
                            startContent={<XMarkIcon className="w-3.5 h-3.5" />}
                            onClick={() => handleReject(request)}
                            className="flex-1"
                          >
                            拒绝
                          </Button>
                        </div>
                      ) : (
                        renderStatusBadge(request.status)
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* 无限滚动 */}
            {friendRequestsHasMore && (
              <InfiniteScroll
                onLoad={handleLoadMore}
                loading={friendRequestsLoading}
              >
                <div className="flex items-center justify-center py-4">
                  <Spinner size="sm" />
                </div>
              </InfiniteScroll>
            )}

            {/* 没有更多 */}
            {!friendRequestsHasMore && friendRequests.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                没有更多请求了
              </div>
            )}
          </div>
        </PullRefresh>
      </div>
    </MainLayout>
  );
};

export default FriendRequestPage;
