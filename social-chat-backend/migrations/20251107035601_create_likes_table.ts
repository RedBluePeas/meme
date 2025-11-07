import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('likes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.uuid('target_id').notNullable(); // 目标ID（动态或评论）
    table.enum('target_type', ['post', 'comment']).notNullable(); // 目标类型
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 唯一约束：防止重复点赞
    table.unique(['user_id', 'target_id', 'target_type']);

    // 索引
    table.index('user_id');
    table.index('target_id');
    table.index(['target_id', 'target_type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('likes');
}
