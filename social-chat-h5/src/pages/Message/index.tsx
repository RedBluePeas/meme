/**
 * Message - 消息页面
 * 显示会话列表，点击进入聊天室
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { PullRefresh } from '@/components/common';
import { ConversationList } from './components';
import { useMessage } from '@/hooks/useMessage';
import { useWebSocket } from '@/hooks/useWebSocket';

const MessagePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    conversations,
    conversationsLoading,
    conversationsHasMore,
    loadConversations,
    refreshConversations,
    selectConversation,
  } = useMessage();

  const { connect, disconnect } = useWebSocket();

  /**
   * 初始化
   */
  useEffect(() => {
    // 加载会话列表
    loadConversations(true);

    // 连接 WebSocket
    connect();

    // 清理函数
    return () => {
      disconnect();
    };
  }, []);

  /**
   * 处理点击会话
   */
  const handleClickConversation = (conversation: any) => {
    selectConversation(conversation);
    navigate(`/message/chat/${conversation.id}`);
  };

  /**
   * 处理创建会话
   */
  const handleCreateConversation = () => {
    navigate('/message/new');
  };

  /**
   * 处理下拉刷新
   */
  const handleRefresh = async () => {
    await refreshConversations();
  };

  /**
   * 处理加载更多
   */
  const handleLoadMore = () => {
    loadConversations();
  };

  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '消息',
        showBack: false,
        rightContent: (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={handleCreateConversation}
          >
            <PlusIcon className="w-5 h-5" />
          </Button>
        ),
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        {/* 下拉刷新 */}
        <PullRefresh onRefresh={handleRefresh}>
          <div className="bg-white">
            <ConversationList
              conversations={conversations}
              loading={conversationsLoading}
              hasMore={conversationsHasMore}
              onLoadMore={handleLoadMore}
              onClick={handleClickConversation}
            />
          </div>
        </PullRefresh>
      </div>
    </MainLayout>
  );
};

export default MessagePage;
