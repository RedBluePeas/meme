import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 启用 UUID 扩展
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // 创建用户表
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username', 50).unique().notNullable();
    table.string('email', 100).unique();
    table.string('phone', 20).unique();
    table.string('password_hash', 255).notNullable();
    table.string('nickname', 50).notNullable();
    table.text('avatar');
    table.text('bio');
    table.string('gender', 10);
    table.date('birthday');
    table.string('location', 100);
    table.string('website', 255);
    table.enum('status', ['active', 'inactive', 'banned']).defaultTo('active');
    table.integer('followers_count').defaultTo(0);
    table.integer('following_count').defaultTo(0);
    table.integer('posts_count').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('last_login_at');

    // 索引
    table.index('username');
    table.index('email');
    table.index('phone');
    table.index('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
