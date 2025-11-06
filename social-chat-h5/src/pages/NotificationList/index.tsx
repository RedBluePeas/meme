/**
 * NotificationList - 通知列表页面
 * 性能优化: 使用 VirtualList
 */

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button } from '@heroui/react';
import { BellIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { VirtualList } from '@/components/VirtualList';
import { useNotification } from '@/hooks/useNotification';
import { formatRelativeTime } from '@/utils/format';

const NotificationListPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, loading, hasMore, loadNotifications, markAsRead, deleteNotification } = useNotification();

  useEffect(() => {
    loadNotifications(true);
    markAsRead(); // 全部标记为已读
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadNotifications(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  // 通知列表项渲染函数
  const renderNotificationItem = useMemo(
    () => (notification: any) => (
      <div className="px-4 pb-3">
        <Card className="relative">
          <CardBody>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-medium mb-1">{notification.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                <p className="text-xs text-gray-400">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={(e) => handleDelete(notification.id, e)}
              >
                <TrashIcon className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    ),
    []
  );

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '通知',
        showBack: true,
        onBack: () => navigate(-1),
      }}
    >
      <div className="h-screen bg-gray-50 pt-4">
        <VirtualList
          data={notifications}
          itemHeight={120}
          containerHeight={window.innerHeight - 100}
          renderItem={renderNotificationItem}
          getItemKey={(notification) => notification.id}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          emptyContent={
            <div className="flex flex-col items-center justify-center text-gray-400">
              <BellIcon className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-sm">暂无通知</p>
            </div>
          }
        />
      </div>
    </MainLayout>
  );
};

export default NotificationListPage;
