/**
 * MessageSlice - 消息模块状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Message,
  Conversation,
  SendMessageParams,
  CreateConversationParams,
} from '@/types/models';
import { PaginationParams } from '@/types/api';
import { messageApi } from '@/services/api';

interface MessageState {
  // 会话列表
  conversations: Conversation[];
  conversationsLoading: boolean;
  conversationsHasMore: boolean;
  conversationsPage: number;

  // 当前会话
  currentConversation: Conversation | null;

  // 消息列表
  messages: Message[];
  messagesLoading: boolean;
  messagesHasMore: boolean;
  messagesPage: number;

  // 未读数
  unreadCount: number;

  // 发送状态
  sending: boolean;
}

const initialState: MessageState = {
  conversations: [],
  conversationsLoading: false,
  conversationsHasMore: true,
  conversationsPage: 1,

  currentConversation: null,

  messages: [],
  messagesLoading: false,
  messagesHasMore: true,
  messagesPage: 1,

  unreadCount: 0,
  sending: false,
};

/**
 * 获取会话列表
 */
export const fetchConversationsAsync = createAsyncThunk(
  'message/fetchConversations',
  async (params: PaginationParams) => {
    const response = await messageApi.getConversations(params);
    return response;
  }
);

/**
 * 获取会话详情
 */
export const fetchConversationAsync = createAsyncThunk(
  'message/fetchConversation',
  async (conversationId: string) => {
    const response = await messageApi.getConversation(conversationId);
    return response;
  }
);

/**
 * 创建会话
 */
export const createConversationAsync = createAsyncThunk(
  'message/createConversation',
  async (params: CreateConversationParams) => {
    const response = await messageApi.createConversation(params);
    return response;
  }
);

/**
 * 删除会话
 */
export const deleteConversationAsync = createAsyncThunk(
  'message/deleteConversation',
  async (conversationId: string) => {
    await messageApi.deleteConversation(conversationId);
    return conversationId;
  }
);

/**
 * 置顶会话
 */
export const pinConversationAsync = createAsyncThunk(
  'message/pinConversation',
  async ({ conversationId, isPinned }: { conversationId: string; isPinned: boolean }) => {
    await messageApi.pinConversation(conversationId, isPinned);
    return { conversationId, isPinned };
  }
);

/**
 * 免打扰
 */
export const muteConversationAsync = createAsyncThunk(
  'message/muteConversation',
  async ({ conversationId, isMuted }: { conversationId: string; isMuted: boolean }) => {
    await messageApi.muteConversation(conversationId, isMuted);
    return { conversationId, isMuted };
  }
);

/**
 * 获取消息列表
 */
export const fetchMessagesAsync = createAsyncThunk(
  'message/fetchMessages',
  async ({ conversationId, params }: { conversationId: string; params: PaginationParams }) => {
    const response = await messageApi.getMessages(conversationId, params);
    return response;
  }
);

/**
 * 发送消息
 */
export const sendMessageAsync = createAsyncThunk(
  'message/sendMessage',
  async (params: SendMessageParams) => {
    const response = await messageApi.sendMessage(params);
    return response;
  }
);

/**
 * 撤回消息
 */
export const recallMessageAsync = createAsyncThunk(
  'message/recallMessage',
  async (messageId: string) => {
    await messageApi.recallMessage(messageId);
    return messageId;
  }
);

/**
 * 删除消息
 */
export const deleteMessageAsync = createAsyncThunk(
  'message/deleteMessage',
  async (messageId: string) => {
    await messageApi.deleteMessage(messageId);
    return messageId;
  }
);

/**
 * 标记已读
 */
export const markAsReadAsync = createAsyncThunk(
  'message/markAsRead',
  async (conversationId: string) => {
    await messageApi.markAsRead(conversationId);
    return conversationId;
  }
);

/**
 * 获取未读数
 */
export const fetchUnreadCountAsync = createAsyncThunk(
  'message/fetchUnreadCount',
  async () => {
    const response = await messageApi.getUnreadCount();
    return response.count;
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    /**
     * 清空消息列表（切换会话时）
     */
    clearMessages: (state) => {
      state.messages = [];
      state.messagesPage = 1;
      state.messagesHasMore = true;
    },

    /**
     * 添加新消息（WebSocket推送）
     */
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      // 添加到消息列表
      state.messages.push(message);

      // 更新会话列表
      const conversation = state.conversations.find(
        (c) => c.id === message.conversationId
      );
      if (conversation) {
        conversation.lastMessage = message.content;
        conversation.lastMessageAt = message.createdAt;
        conversation.lastMessageType = message.type;

        // 如果不是当前会话，增加未读数
        if (state.currentConversation?.id !== message.conversationId) {
          conversation.unreadCount += 1;
          state.unreadCount += 1;
        }

        // 移动到列表顶部
        state.conversations = [
          conversation,
          ...state.conversations.filter((c) => c.id !== conversation.id),
        ];
      }
    },

    /**
     * 更新消息状态（WebSocket确认）
     */
    updateMessageStatus: (
      state,
      action: PayloadAction<{ id: string; status: Message['status'] }>
    ) => {
      const { id, status } = action.payload;
      const message = state.messages.find((m) => m.id === id);
      if (message) {
        message.status = status;
      }
    },

    /**
     * 设置当前会话
     */
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },

    /**
     * 重置状态
     */
    resetMessageState: () => initialState,
  },
  extraReducers: (builder) => {
    // 获取会话列表
    builder
      .addCase(fetchConversationsAsync.pending, (state) => {
        state.conversationsLoading = true;
      })
      .addCase(fetchConversationsAsync.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        const { list, pagination } = action.payload;

        if (pagination.page === 1) {
          state.conversations = list;
        } else {
          state.conversations = [...state.conversations, ...list];
        }

        state.conversationsPage = pagination.page;
        state.conversationsHasMore = pagination.hasMore;
      })
      .addCase(fetchConversationsAsync.rejected, (state) => {
        state.conversationsLoading = false;
      });

    // 获取会话详情
    builder
      .addCase(fetchConversationAsync.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
      });

    // 创建会话
    builder
      .addCase(createConversationAsync.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.currentConversation = action.payload;
      });

    // 删除会话
    builder
      .addCase(deleteConversationAsync.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (c) => c.id !== action.payload
        );
        if (state.currentConversation?.id === action.payload) {
          state.currentConversation = null;
        }
      });

    // 置顶会话（乐观更新）
    builder
      .addCase(pinConversationAsync.pending, (state, action) => {
        const { conversationId, isPinned } = action.meta.arg;
        const conversation = state.conversations.find((c) => c.id === conversationId);
        if (conversation) {
          conversation.isPinned = isPinned;

          // 重新排序：置顶的在前面
          state.conversations.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
          });
        }
      })
      .addCase(pinConversationAsync.rejected, (state, action) => {
        // 回滚
        const { conversationId, isPinned } = action.meta.arg;
        const conversation = state.conversations.find((c) => c.id === conversationId);
        if (conversation) {
          conversation.isPinned = !isPinned;
        }
      });

    // 免打扰（乐观更新）
    builder
      .addCase(muteConversationAsync.pending, (state, action) => {
        const { conversationId, isMuted } = action.meta.arg;
        const conversation = state.conversations.find((c) => c.id === conversationId);
        if (conversation) {
          conversation.isMuted = isMuted;
        }
      })
      .addCase(muteConversationAsync.rejected, (state, action) => {
        // 回滚
        const { conversationId, isMuted } = action.meta.arg;
        const conversation = state.conversations.find((c) => c.id === conversationId);
        if (conversation) {
          conversation.isMuted = !isMuted;
        }
      });

    // 获取消息列表
    builder
      .addCase(fetchMessagesAsync.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessagesAsync.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const { list, pagination } = action.payload;

        if (pagination.page === 1) {
          state.messages = list.reverse(); // 消息从旧到新
        } else {
          state.messages = [...list.reverse(), ...state.messages];
        }

        state.messagesPage = pagination.page;
        state.messagesHasMore = pagination.hasMore;
      })
      .addCase(fetchMessagesAsync.rejected, (state) => {
        state.messagesLoading = false;
      });

    // 发送消息
    builder
      .addCase(sendMessageAsync.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.sending = false;
        // 消息通过 WebSocket 推送，这里不需要手动添加
      })
      .addCase(sendMessageAsync.rejected, (state) => {
        state.sending = false;
      });

    // 撤回消息
    builder
      .addCase(recallMessageAsync.fulfilled, (state, action) => {
        const message = state.messages.find((m) => m.id === action.payload);
        if (message) {
          message.type = 'system';
          message.content = '你撤回了一条消息';
        }
      });

    // 删除消息
    builder
      .addCase(deleteMessageAsync.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m.id !== action.payload);
      });

    // 标记已读
    builder
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const conversation = state.conversations.find(
          (c) => c.id === action.payload
        );
        if (conversation && conversation.unreadCount > 0) {
          state.unreadCount -= conversation.unreadCount;
          conversation.unreadCount = 0;
        }
      });

    // 获取未读数
    builder
      .addCase(fetchUnreadCountAsync.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {
  clearMessages,
  addMessage,
  updateMessageStatus,
  setCurrentConversation,
  resetMessageState,
} = messageSlice.actions;

export default messageSlice.reducer;
