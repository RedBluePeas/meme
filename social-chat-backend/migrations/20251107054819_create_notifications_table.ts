import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.enum('type', ['like', 'comment', 'follow', 'friend_request', 'system']).notNullable();
    table.string('title', 255).notNullable();
    table.text('content').notNullable();
    table.jsonb('data'); // 额外数据，如动态ID、评论ID等
    table.boolean('is_read').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 索引
    table.index('user_id');
    table.index('is_read');
    table.index('created_at');
    table.index(['user_id', 'is_read']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('notifications');
}
