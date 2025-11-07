import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('post_id').notNullable();
    table.uuid('user_id').notNullable();
    table.uuid('parent_id'); // 父评论ID，用于回复
    table.text('content').notNullable();
    table.integer('like_count').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('post_id').references('posts.id').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('parent_id').references('comments.id').onDelete('CASCADE');

    // 索引
    table.index('post_id');
    table.index('user_id');
    table.index('parent_id');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('comments');
}
