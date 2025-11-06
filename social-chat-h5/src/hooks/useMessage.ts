/**
 * useMessage Hook - 消息管理逻辑
 */

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchConversationsAsync,
  fetchMessagesAsync,
  sendMessageAsync,
  createConversationAsync,
  deleteConversationAsync,
  pinConversationAsync,
  muteConversationAsync,
  markAsReadAsync,
  fetchUnreadCountAsync,
  clearMessages,
  setCurrentConversation,
} from '@/store/slices/messageSlice';
import {
  Conversation,
  SendMessageParams,
  CreateConversationParams,
} from '@/types/models';
import { SSDialog } from '@/components/SSDialog';

export const useMessage = () => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    conversationsLoading,
    conversationsHasMore,
    conversationsPage,
    currentConversation,
    messages,
    messagesLoading,
    messagesHasMore,
    messagesPage,
    unreadCount,
    sending,
  } = useAppSelector((state) => state.message);

  /**
   * 加载会话列表
   */
  const loadConversations = useCallback(
    async (refresh = false) => {
      const page = refresh ? 1 : conversationsPage + 1;

      if (!refresh && !conversationsHasMore) {
        return;
      }

      try {
        await dispatch(
          fetchConversationsAsync({
            page,
            pageSize: 20,
          })
        ).unwrap();
      } catch (error) {
        SSDialog.toast.error('加载会话列表失败');
      }
    },
    [dispatch, conversationsPage, conversationsHasMore]
  );

  /**
   * 刷新会话列表
   */
  const refreshConversations = useCallback(async () => {
    return loadConversations(true);
  }, [loadConversations]);

  /**
   * 创建会话
   */
  const createConversation = useCallback(
    async (params: CreateConversationParams): Promise<Conversation | null> => {
      try {
        const conversation = await dispatch(
          createConversationAsync(params)
        ).unwrap();
        return conversation;
      } catch (error) {
        SSDialog.toast.error('创建会话失败');
        return null;
      }
    },
    [dispatch]
  );

  /**
   * 删除会话
   */
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        await dispatch(deleteConversationAsync(conversationId)).unwrap();
        SSDialog.toast.success('删除成功');
      } catch (error) {
        SSDialog.toast.error('删除失败');
      }
    },
    [dispatch]
  );

  /**
   * 置顶/取消置顶
   */
  const togglePin = useCallback(
    async (conversationId: string, isPinned: boolean) => {
      try {
        await dispatch(
          pinConversationAsync({ conversationId, isPinned })
        ).unwrap();
      } catch (error) {
        SSDialog.toast.error('操作失败');
      }
    },
    [dispatch]
  );

  /**
   * 免打扰/取消免打扰
   */
  const toggleMute = useCallback(
    async (conversationId: string, isMuted: boolean) => {
      try {
        await dispatch(
          muteConversationAsync({ conversationId, isMuted })
        ).unwrap();
      } catch (error) {
        SSDialog.toast.error('操作失败');
      }
    },
    [dispatch]
  );

  /**
   * 加载消息列表
   */
  const loadMessages = useCallback(
    async (conversationId: string, refresh = false) => {
      const page = refresh ? 1 : messagesPage + 1;

      if (!refresh && !messagesHasMore) {
        return;
      }

      try {
        await dispatch(
          fetchMessagesAsync({
            conversationId,
            params: {
              page,
              pageSize: 20,
            },
          })
        ).unwrap();
      } catch (error) {
        SSDialog.toast.error('加载消息失败');
      }
    },
    [dispatch, messagesPage, messagesHasMore]
  );

  /**
   * 刷新消息列表
   */
  const refreshMessages = useCallback(
    async (conversationId: string) => {
      return loadMessages(conversationId, true);
    },
    [loadMessages]
  );

  /**
   * 发送消息
   */
  const sendMessage = useCallback(
    async (params: SendMessageParams) => {
      try {
        await dispatch(sendMessageAsync(params)).unwrap();
      } catch (error) {
        SSDialog.toast.error('发送失败');
      }
    },
    [dispatch]
  );

  /**
   * 标记已读
   */
  const markAsRead = useCallback(
    async (conversationId: string) => {
      try {
        await dispatch(markAsReadAsync(conversationId)).unwrap();
      } catch (error) {
        console.error('标记已读失败:', error);
      }
    },
    [dispatch]
  );

  /**
   * 设置当前会话
   */
  const selectConversation = useCallback(
    (conversation: Conversation | null) => {
      dispatch(setCurrentConversation(conversation));

      // 清空消息列表
      if (conversation) {
        dispatch(clearMessages());
      }
    },
    [dispatch]
  );

  /**
   * 获取未读数
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      await dispatch(fetchUnreadCountAsync()).unwrap();
    } catch (error) {
      console.error('获取未读数失败:', error);
    }
  }, [dispatch]);

  /**
   * 初始化时加载未读数
   */
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    // 会话列表
    conversations,
    conversationsLoading,
    conversationsHasMore,
    loadConversations,
    refreshConversations,

    // 会话操作
    currentConversation,
    selectConversation,
    createConversation,
    deleteConversation,
    togglePin,
    toggleMute,

    // 消息列表
    messages,
    messagesLoading,
    messagesHasMore,
    loadMessages,
    refreshMessages,

    // 消息操作
    sendMessage,
    sending,
    markAsRead,

    // 未读数
    unreadCount,
    fetchUnreadCount,
  };
};
