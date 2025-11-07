/**
 * WebSocket 服务
 * 处理实时消息推送
 */

import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/models';
import { SSStorageUtil } from '@/utils';

type MessageHandler = (message: Message) => void;
type StatusHandler = (data: { messageId: string; status: Message['status'] }) => void;
type ConnectHandler = () => void;
type DisconnectHandler = () => void;
type ErrorHandler = (error: Error) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private connectHandlers: Set<ConnectHandler> = new Set();
  private disconnectHandlers: Set<DisconnectHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      console.log('[WebSocket] Already connected or connecting');
      return;
    }

    const token = SSStorageUtil.get<string>('auth_token');
    if (!token) {
      console.error('[WebSocket] No token found');
      return;
    }

    this.isConnecting = true;

    // 创建 socket 连接
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

    this.socket = io(wsUrl, {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    // 监听连接事件
    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.connectHandlers.forEach((handler) => handler());
    });

    // 监听断开事件
    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      this.isConnecting = false;
      this.disconnectHandlers.forEach((handler) => handler());
    });

    // 监听连接错误
    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      this.isConnecting = false;
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WebSocket] Max reconnect attempts reached');
        this.disconnect();
      }

      this.errorHandlers.forEach((handler) => handler(error));
    });

    // 监听新消息
    this.socket.on('message:new', (message: Message) => {
      console.log('[WebSocket] New message:', message);
      this.messageHandlers.forEach((handler) => handler(message));
    });

    // 监听消息状态更新
    this.socket.on('message:status', (data: { messageId: string; status: Message['status'] }) => {
      console.log('[WebSocket] Message status update:', data);
      this.statusHandlers.forEach((handler) => handler(data));
    });

    // 监听其他事件...
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.socket) {
      console.log('[WebSocket] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  /**
   * 发送消息（通过 WebSocket）
   */
  sendMessage(message: Message): void {
    if (!this.socket?.connected) {
      console.error('[WebSocket] Not connected');
      return;
    }

    this.socket.emit('message:send', message);
  }

  /**
   * 标记消息为已读
   */
  markAsRead(conversationId: string): void {
    if (!this.socket?.connected) {
      console.error('[WebSocket] Not connected');
      return;
    }

    this.socket.emit('message:read', { conversationId });
  }

  /**
   * 订阅新消息
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * 订阅消息状态更新
   */
  onStatus(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  /**
   * 订阅连接事件
   */
  onConnect(handler: ConnectHandler): () => void {
    this.connectHandlers.add(handler);
    return () => this.connectHandlers.delete(handler);
  }

  /**
   * 订阅断开事件
   */
  onDisconnect(handler: DisconnectHandler): () => void {
    this.disconnectHandlers.add(handler);
    return () => this.disconnectHandlers.delete(handler);
  }

  /**
   * 订阅错误事件
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * 重新连接
   */
  reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

/**
 * 导出单例
 */
export const wsService = new WebSocketService();
