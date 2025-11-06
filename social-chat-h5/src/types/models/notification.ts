/**
 * Notification - 通知相关类型定义
 */

/**
 * 通知类型
 */
export type NotificationType =
  | 'system'           // 系统通知
  | 'like'             // 点赞通知
  | 'comment'          // 评论通知
  | 'follow'           // 关注通知
  | 'friend_request'   // 好友请求
  | 'group_invite'     // 群组邀请
  | 'message';         // 消息通知

/**
 * 通知
 */
export interface Notification {
  // 通知ID
  id: string;

  // 通知类型
  type: NotificationType;

  // 标题
  title: string;

  // 内容
  content: string;

  // 关联数据（JSON格式）
  data?: {
    userId?: string;
    postId?: string;
    commentId?: string;
    groupId?: string;
    conversationId?: string;
    [key: string]: any;
  };

  // 是否已读
  isRead: boolean;

  // 创建时间
  createdAt: string;
}

/**
 * 通知统计
 */
export interface NotificationStats {
  // 未读总数
  unreadCount: number;

  // 各类型未读数
  unreadByType: {
    [key in NotificationType]?: number;
  };
}

/**
 * 标记已读参数
 */
export interface MarkAsReadParams {
  // 通知ID列表（不传表示全部已读）
  notificationIds?: string[];
}
