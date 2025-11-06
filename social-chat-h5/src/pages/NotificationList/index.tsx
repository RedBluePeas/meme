/**
 * NotificationList - 通知列表页面
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Bell, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/Layout';
import { PullRefresh } from '@/components/common';
import { useNotification } from '@/hooks/useNotification';
import { formatRelativeTime } from '@/utils/format';

const NotificationListPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, loadNotifications, markAsRead, deleteNotification } = useNotification();

  useEffect(() => {
    loadNotifications(true);
    markAsRead(); // 全部标记为已读
  }, []);

  const handleRefresh = async () => {
    await loadNotifications(true);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

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
      <div className="min-h-screen bg-gray-50">
        <PullRefresh onRefresh={handleRefresh}>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Bell size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-400 text-sm">暂无通知</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <Card key={notification.id} className="relative">
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
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 size={16} className="text-gray-400" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </PullRefresh>
      </div>
    </MainLayout>
  );
};

export default NotificationListPage;
