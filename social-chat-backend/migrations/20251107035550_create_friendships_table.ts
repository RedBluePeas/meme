import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('friendships', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.uuid('friend_id').notNullable();
    table.enum('status', ['pending', 'accepted', 'rejected', 'blocked']).defaultTo('pending');
    table.string('remark', 50); // 好友备注
    table.string('group_name', 50); // 分组
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('friend_id').references('users.id').onDelete('CASCADE');

    // 唯一约束
    table.unique(['user_id', 'friend_id']);

    // 索引
    table.index('user_id');
    table.index('friend_id');
    table.index('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('friendships');
}
