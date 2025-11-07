import { Knex } from 'knex';
import config from './index';

// PostgreSQL 连接配置
export const knexConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
  },
  pool: {
    min: config.database.poolMin,
    max: config.database.poolMax,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
};

export default knexConfig;
