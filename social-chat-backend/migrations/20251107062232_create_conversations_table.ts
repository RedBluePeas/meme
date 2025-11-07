import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('conversations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.enum('type', ['private', 'group']).notNullable().defaultTo('private');
    table.string('name', 100); // 群聊名称
    table.text('avatar'); // 群聊头像
    table.uuid('created_by'); // 创建者（仅群聊）
    table.uuid('last_message_id'); // 最后一条消息ID
    table.timestamp('last_message_at'); // 最后消息时间
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // 外键
    table.foreign('created_by').references('users.id').onDelete('SET NULL');

    // 索引
    table.index('type');
    table.index('created_by');
    table.index('last_message_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('conversations');
}
