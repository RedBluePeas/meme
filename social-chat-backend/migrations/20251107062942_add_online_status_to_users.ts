import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.boolean('is_online').defaultTo(false);
    table.timestamp('last_seen_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('is_online');
    table.dropColumn('last_seen_at');
  });
}

