import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.enum('type', ['text', 'image', 'video']).defaultTo('text');
    table.text('content');
    table.specificType('images', 'TEXT[]'); // 图片数组
    table.text('video_url');
    table.enum('visibility', ['public', 'friends', 'private']).defaultTo('public');
    table.string('location_name', 100);
    table.decimal('location_lat', 10, 8);
    table.decimal('location_lng', 11, 8);
    table.integer('like_count').defaultTo(0);
    table.integer('comment_count').defaultTo(0);
    table.integer('share_count').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 索引
    table.index('user_id');
    table.index('created_at');
    table.index('visibility');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('posts');
}
