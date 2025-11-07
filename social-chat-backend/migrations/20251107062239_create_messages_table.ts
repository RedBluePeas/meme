import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('conversation_id').notNullable();
    table.uuid('sender_id').notNullable();
    table.enum('type', ['text', 'image', 'video', 'file', 'audio']).defaultTo('text');
    table.text('content'); // 文本内容
    table.text('file_url'); // 文件URL
    table.string('file_name', 255); // 文件名
    table.integer('file_size'); // 文件大小（字节）
    table.integer('duration'); // 音视频时长（秒）
    table.enum('status', ['sent', 'delivered', 'read']).defaultTo('sent');
    table.uuid('reply_to'); // 回复的消息ID
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('conversation_id').references('conversations.id').onDelete('CASCADE');
    table.foreign('sender_id').references('users.id').onDelete('CASCADE');
    table.foreign('reply_to').references('messages.id').onDelete('SET NULL');

    // 索引
    table.index('conversation_id');
    table.index('sender_id');
    table.index(['conversation_id', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('messages');
}
