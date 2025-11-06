/**
 * ChatRoom - 聊天室页面
 * 显示消息列表、发送消息、实时通信
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { MoreVertical, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { MessageList, MessageInput } from './components';
import { useMessage } from '@/hooks/useMessage';
import { uploadApi } from '@/services/api';
import { SSDialog } from '@/components/SSDialog';
import { SendMessageParams } from '@/types/models';

const ChatRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentConversation,
    messages,
    messagesLoading,
    messagesHasMore,
    loadMessages,
    sendMessage,
    sending,
    markAsRead,
  } = useMessage();

  /**
   * 初始化
   */
  useEffect(() => {
    if (!id) return;

    // 加载消息列表
    loadMessages(id, true);

    // 标记已读
    markAsRead(id);
  }, [id]);

  /**
   * 发送文本消息
   */
  const handleSend = async (params: SendMessageParams) => {
    await sendMessage(params);
  };

  /**
   * 发送图片消息
   */
  const handleImageSelect = async (files: File[]) => {
    if (!id) return;

    const loading = SSDialog.loading('上传中...');

    try {
      // 上传图片
      const urls = await uploadApi.uploadImages(files);

      // 发送图片消息
      for (const url of urls) {
        await sendMessage({
          conversationId: id,
          type: 'image',
          content: '[图片]',
          imageUrl: url,
        });
      }

      loading.close();
    } catch (error) {
      loading.close();
      SSDialog.toast.error('发送失败');
    }
  };

  /**
   * 加载更多历史消息
   */
  const handleLoadMore = () => {
    if (!id) return;
    loadMessages(id);
  };

  /**
   * 处理下拉菜单
   */
  const handleMenuAction = (key: React.Key) => {
    switch (key) {
      case 'clear':
        SSDialog.confirm({
          title: '清空聊天记录',
          content: '确定要清空聊天记录吗？',
          onConfirm: async () => {
            // TODO: 清空聊天记录
            SSDialog.toast.success('清空成功');
          },
        });
        break;
      case 'mute':
        // TODO: 免打扰
        break;
      case 'report':
        // TODO: 举报
        break;
      default:
        break;
    }
  };

  if (!currentConversation) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">会话不存在</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: (
          <div className="flex items-center gap-2">
            <Avatar
              src={currentConversation.avatar}
              alt={currentConversation.name}
              size="sm"
            />
            <div>
              <h3 className="font-medium">{currentConversation.name}</h3>
              {currentConversation.type === 'group' && (
                <p className="text-xs text-gray-400">
                  {currentConversation.memberCount} 人
                </p>
              )}
            </div>
          </div>
        ),
        showBack: true,
        onBack: () => navigate(-1),
        rightContent: (
          <div className="flex items-center gap-2">
            {/* 语音通话 */}
            <Button isIconOnly variant="light" size="sm">
              <PhoneIcon className="w-[18px] h-[18px]" />
            </Button>

            {/* 视频通话 */}
            <Button isIconOnly variant="light" size="sm">
              <VideoCameraIcon className="w-[18px] h-[18px]" />
            </Button>

            {/* 更多菜单 */}
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light" size="sm">
                  <MoreVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={handleMenuAction}>
                <DropdownItem key="clear">清空聊天记录</DropdownItem>
                <DropdownItem key="mute">
                  {currentConversation.isMuted ? '取消免打扰' : '免打扰'}
                </DropdownItem>
                <DropdownItem key="report" className="text-danger" color="danger">
                  举报
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ),
      }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* 消息列表 */}
        <MessageList
          messages={messages}
          loading={messagesLoading}
          hasMore={messagesHasMore}
          onLoadMore={handleLoadMore}
        />

        {/* 消息输入框 */}
        <MessageInput
          conversationId={id!}
          sending={sending}
          onSend={handleSend}
          onImageSelect={handleImageSelect}
        />
      </div>
    </MainLayout>
  );
};

export default ChatRoomPage;
