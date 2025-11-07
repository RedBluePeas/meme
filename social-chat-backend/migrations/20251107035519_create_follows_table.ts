import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('follows', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('follower_id').notNullable();
    table.uuid('following_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('follower_id').references('users.id').onDelete('CASCADE');
    table.foreign('following_id').references('users.id').onDelete('CASCADE');

    // 唯一约束：防止重复关注
    table.unique(['follower_id', 'following_id']);

    // 检查约束：不能关注自己
    table.check('follower_id != following_id', [], 'check_not_self_follow');

    // 索引
    table.index('follower_id');
    table.index('following_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('follows');
}
