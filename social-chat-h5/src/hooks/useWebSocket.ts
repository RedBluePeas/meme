/**
 * useWebSocket Hook - WebSocket 连接管理
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/store';
import { addMessage, updateMessageStatus } from '@/store/slices/messageSlice';
import { wsService } from '@/services/websocket';
import { Message } from '@/types/models';

export const useWebSocket = () => {
  const dispatch = useAppDispatch();

  /**
   * 连接 WebSocket
   */
  const connect = useCallback(() => {
    wsService.connect();
  }, []);

  /**
   * 断开连接
   */
  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  /**
   * 重新连接
   */
  const reconnect = useCallback(() => {
    wsService.reconnect();
  }, []);

  /**
   * 检查连接状态
   */
  const isConnected = useCallback(() => {
    return wsService.isConnected();
  }, []);

  /**
   * 处理新消息
   */
  const handleNewMessage = useCallback(
    (message: Message) => {
      dispatch(addMessage(message));
    },
    [dispatch]
  );

  /**
   * 处理消息状态更新
   */
  const handleMessageStatus = useCallback(
    (data: { messageId: string; status: Message['status'] }) => {
      dispatch(updateMessageStatus({ id: data.messageId, status: data.status }));
    },
    [dispatch]
  );

  /**
   * 初始化 WebSocket 监听
   */
  useEffect(() => {
    // 订阅新消息
    const unsubscribeMessage = wsService.onMessage(handleNewMessage);

    // 订阅消息状态更新
    const unsubscribeStatus = wsService.onStatus(handleMessageStatus);

    // 订阅连接事件
    const unsubscribeConnect = wsService.onConnect(() => {
      console.log('[useWebSocket] Connected');
    });

    // 订阅断开事件
    const unsubscribeDisconnect = wsService.onDisconnect(() => {
      console.log('[useWebSocket] Disconnected');
    });

    // 订阅错误事件
    const unsubscribeError = wsService.onError((error) => {
      console.error('[useWebSocket] Error:', error);
    });

    // 清理函数
    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
    };
  }, [handleNewMessage, handleMessageStatus]);

  return {
    connect,
    disconnect,
    reconnect,
    isConnected,
  };
};
