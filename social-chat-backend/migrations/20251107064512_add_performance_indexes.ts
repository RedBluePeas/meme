import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 为 posts 表添加复合索引
  await knex.schema.alterTable('posts', (table) => {
    // 按用户和创建时间查询（用户动态列表）
    table.index(['user_id', 'created_at'], 'idx_posts_user_created');
    // 按可见性和创建时间查询（动态流）
    table.index(['visibility', 'created_at'], 'idx_posts_visibility_created');
    // 按点赞数排序（热门动态）
    table.index(['likes_count', 'created_at'], 'idx_posts_likes_created');
  });

  // 为 comments 表添加复合索引
  await knex.schema.alterTable('comments', (table) => {
    // 按帖子和创建时间查询（帖子评论列表）
    table.index(['post_id', 'created_at'], 'idx_comments_post_created');
    // 按父评论和创建时间查询（回复列表）
    table.index(['parent_id', 'created_at'], 'idx_comments_parent_created');
    // 按用户查询（用户评论）
    table.index('user_id', 'idx_comments_user');
  });

  // 为 likes 表添加复合索引
  await knex.schema.alterTable('likes', (table) => {
    // 按目标类型和目标ID查询（某个帖子/评论的点赞列表）
    table.index(['target_type', 'target_id', 'created_at'], 'idx_likes_target_created');
  });

  // 为 follows 表添加索引
  await knex.schema.alterTable('follows', (table) => {
    // 按关注者查询（我关注的人）
    table.index(['follower_id', 'created_at'], 'idx_follows_follower_created');
    // 按被关注者查询（关注我的人）
    table.index(['following_id', 'created_at'], 'idx_follows_following_created');
  });

  // 为 friendships 表添加复合索引
  await knex.schema.alterTable('friendships', (table) => {
    // 按用户和状态查询（好友列表、请求列表）
    table.index(['user_id', 'status'], 'idx_friendships_user_status');
    table.index(['friend_id', 'status'], 'idx_friendships_friend_status');
    // 按状态和创建时间查询（待处理的好友请求）
    table.index(['status', 'created_at'], 'idx_friendships_status_created');
  });

  // 为 notifications 表添加复合索引
  await knex.schema.alterTable('notifications', (table) => {
    // 按用户、是否已读和创建时间查询（通知列表）
    table.index(['user_id', 'is_read', 'created_at'], 'idx_notifications_user_read_created');
    // 按类型和创建时间查询（某种类型的通知）
    table.index(['type', 'created_at'], 'idx_notifications_type_created');
  });

  // 为 conversations 表添加索引
  await knex.schema.alterTable('conversations', (table) => {
    // 按类型查询
    table.index('type', 'idx_conversations_type');
    // 按最后消息时间排序
    table.index('last_message_at', 'idx_conversations_last_message');
  });

  // 为 conversation_members 表添加复合索引
  await knex.schema.alterTable('conversation_members', (table) => {
    // 按用户查询（用户的会话列表）
    table.index('user_id', 'idx_conversation_members_user');
    // 按会话查询（会话的成员列表）
    table.index('conversation_id', 'idx_conversation_members_conversation');
    // 按用户和置顶状态查询
    table.index(['user_id', 'is_pinned'], 'idx_conversation_members_user_pinned');
  });

  // 为 messages 表添加复合索引
  await knex.schema.alterTable('messages', (table) => {
    // 按会话和创建时间查询（消息列表）
    table.index(['conversation_id', 'created_at'], 'idx_messages_conversation_created');
    // 按发送者查询
    table.index('sender_id', 'idx_messages_sender');
    // 按回复查询（查找某条消息的回复）
    table.index('reply_to', 'idx_messages_reply_to');
    // 按状态查询（未读消息等）
    table.index(['conversation_id', 'status'], 'idx_messages_conversation_status');
  });
}

export async function down(knex: Knex): Promise<void> {
  // 删除 posts 表索引
  await knex.schema.alterTable('posts', (table) => {
    table.dropIndex(['user_id', 'created_at'], 'idx_posts_user_created');
    table.dropIndex(['visibility', 'created_at'], 'idx_posts_visibility_created');
    table.dropIndex(['likes_count', 'created_at'], 'idx_posts_likes_created');
  });

  // 删除 comments 表索引
  await knex.schema.alterTable('comments', (table) => {
    table.dropIndex(['post_id', 'created_at'], 'idx_comments_post_created');
    table.dropIndex(['parent_id', 'created_at'], 'idx_comments_parent_created');
    table.dropIndex('user_id', 'idx_comments_user');
  });

  // 删除 likes 表索引
  await knex.schema.alterTable('likes', (table) => {
    table.dropIndex(['target_type', 'target_id', 'created_at'], 'idx_likes_target_created');
  });

  // 删除 follows 表索引
  await knex.schema.alterTable('follows', (table) => {
    table.dropIndex(['follower_id', 'created_at'], 'idx_follows_follower_created');
    table.dropIndex(['following_id', 'created_at'], 'idx_follows_following_created');
  });

  // 删除 friendships 表索引
  await knex.schema.alterTable('friendships', (table) => {
    table.dropIndex(['user_id', 'status'], 'idx_friendships_user_status');
    table.dropIndex(['friend_id', 'status'], 'idx_friendships_friend_status');
    table.dropIndex(['status', 'created_at'], 'idx_friendships_status_created');
  });

  // 删除 notifications 表索引
  await knex.schema.alterTable('notifications', (table) => {
    table.dropIndex(['user_id', 'is_read', 'created_at'], 'idx_notifications_user_read_created');
    table.dropIndex(['type', 'created_at'], 'idx_notifications_type_created');
  });

  // 删除 conversations 表索引
  await knex.schema.alterTable('conversations', (table) => {
    table.dropIndex('type', 'idx_conversations_type');
    table.dropIndex('last_message_at', 'idx_conversations_last_message');
  });

  // 删除 conversation_members 表索引
  await knex.schema.alterTable('conversation_members', (table) => {
    table.dropIndex('user_id', 'idx_conversation_members_user');
    table.dropIndex('conversation_id', 'idx_conversation_members_conversation');
    table.dropIndex(['user_id', 'is_pinned'], 'idx_conversation_members_user_pinned');
  });

  // 删除 messages 表索引
  await knex.schema.alterTable('messages', (table) => {
    table.dropIndex(['conversation_id', 'created_at'], 'idx_messages_conversation_created');
    table.dropIndex('sender_id', 'idx_messages_sender');
    table.dropIndex('reply_to', 'idx_messages_reply_to');
    table.dropIndex(['conversation_id', 'status'], 'idx_messages_conversation_status');
  });
}
