import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('conversation_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('conversation_id').notNullable();
    table.uuid('user_id').notNullable();
    table.integer('unread_count').defaultTo(0);
    table.boolean('is_muted').defaultTo(false);
    table.boolean('is_pinned').defaultTo(false);
    table.timestamp('last_read_at'); // 最后阅读时间
    table.timestamp('joined_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('conversation_id').references('conversations.id').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 唯一约束
    table.unique(['conversation_id', 'user_id']);

    // 索引
    table.index('conversation_id');
    table.index('user_id');
    table.index(['user_id', 'is_pinned']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('conversation_members');
}
