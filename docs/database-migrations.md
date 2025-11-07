# 数据库迁移脚本

## 目录

- [1. 迁移工具选择](#1-迁移工具选择)
- [2. 初始化迁移](#2-初始化迁移)
- [3. 数据表迁移脚本](#3-数据表迁移脚本)
- [4. 种子数据](#4-种子数据)
- [5. 迁移管理](#5-迁移管理)

---

## 1. 迁移工具选择

### Node.js 项目推荐

#### 选项 1: Knex.js

```bash
npm install knex pg
npx knex init
```

#### 选项 2: TypeORM

```bash
npm install typeorm @types/node pg
```

#### 选项 3: Prisma

```bash
npm install -D prisma
npm install @prisma/client
npx prisma init
```

---

## 2. 初始化迁移

### 2.1 创建迁移配置

**knexfile.js**:
```javascript
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'social_chat_dev',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password'
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }
};
```

### 2.2 package.json 脚本

```json
{
  "scripts": {
    "db:migrate": "knex migrate:latest",
    "db:migrate:make": "knex migrate:make",
    "db:migrate:rollback": "knex migrate:rollback",
    "db:migrate:status": "knex migrate:status",
    "db:seed": "knex seed:run",
    "db:seed:make": "knex seed:make"
  }
}
```

---

## 3. 数据表迁移脚本

### 3.1 用户表

**migrations/20240101000001_create_users_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username', 50).notNullable().unique();
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
    table.enu('status', ['active', 'inactive', 'banned']).defaultTo('active');
    table.integer('followers_count').defaultTo(0);
    table.integer('following_count').defaultTo(0);
    table.integer('posts_count').defaultTo(0);
    table.timestamps(true, true);
    table.timestamp('last_login_at');

    // 索引
    table.index('username');
    table.index('email');
    table.index('phone');
    table.index('status');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

### 3.2 好友关系表

**migrations/20240101000002_create_friendships_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('friendships', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('friend_id').notNullable();
    table.enu('status', ['pending', 'accepted', 'rejected', 'blocked']).defaultTo('pending');
    table.string('remark', 50);
    table.string('group_name', 50);
    table.timestamps(true, true);

    // 外键约束
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('friend_id').references('users.id').onDelete('CASCADE');

    // 唯一约束
    table.unique(['user_id', 'friend_id']);

    // 索引
    table.index('user_id');
    table.index('friend_id');
    table.index('status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('friendships');
};
```

### 3.3 关注表

**migrations/20240101000003_create_follows_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('follows', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('follower_id').notNullable();
    table.uuid('following_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // 外键约束
    table.foreign('follower_id').references('users.id').onDelete('CASCADE');
    table.foreign('following_id').references('users.id').onDelete('CASCADE');

    // 唯一约束
    table.unique(['follower_id', 'following_id']);

    // 检查约束（防止自己关注自己）
    table.check('follower_id != following_id');

    // 索引
    table.index('follower_id');
    table.index('following_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('follows');
};
```

### 3.4 动态表

**migrations/20240101000004_create_posts_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('posts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.enu('type', ['text', 'image', 'video']).defaultTo('text');
    table.text('content');
    table.specificType('images', 'TEXT[]');
    table.text('video_url');
    table.enu('visibility', ['public', 'friends', 'private']).defaultTo('public');
    table.string('location_name', 100);
    table.decimal('location_lat', 10, 8);
    table.decimal('location_lng', 11, 8);
    table.integer('like_count').defaultTo(0);
    table.integer('comment_count').defaultTo(0);
    table.integer('share_count').defaultTo(0);
    table.integer('view_count').defaultTo(0);
    table.enu('status', ['draft', 'published', 'deleted']).defaultTo('published');
    table.timestamps(true, true);

    // 外键约束
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 索引
    table.index('user_id');
    table.index('created_at');
    table.index('status');
    table.index(['user_id', 'created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
```

### 3.5 话题表

**migrations/20240101000005_create_topics_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('topics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable().unique();
    table.text('description');
    table.text('cover_image');
    table.integer('posts_count').defaultTo(0);
    table.integer('followers_count').defaultTo(0);
    table.integer('view_count').defaultTo(0);
    table.boolean('is_hot').defaultTo(false);
    table.enu('status', ['active', 'inactive']).defaultTo('active');
    table.timestamps(true, true);

    // 索引
    table.index('name');
    table.index('is_hot');
    table.index('followers_count');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('topics');
};
```

### 3.6 动态-话题关联表

**migrations/20240101000006_create_post_topics_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('post_topics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('post_id').notNullable();
    table.uuid('topic_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // 外键约束
    table.foreign('post_id').references('posts.id').onDelete('CASCADE');
    table.foreign('topic_id').references('topics.id').onDelete('CASCADE');

    // 唯一约束
    table.unique(['post_id', 'topic_id']);

    // 索引
    table.index('post_id');
    table.index('topic_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('post_topics');
};
```

### 3.7 评论表

**migrations/20240101000007_create_comments_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('comments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('post_id').notNullable();
    table.uuid('user_id').notNullable();
    table.uuid('parent_id');
    table.uuid('reply_to_user_id');
    table.text('content').notNullable();
    table.integer('like_count').defaultTo(0);
    table.enu('status', ['published', 'deleted']).defaultTo('published');
    table.timestamps(true, true);

    // 外键约束
    table.foreign('post_id').references('posts.id').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('parent_id').references('comments.id').onDelete('CASCADE');
    table.foreign('reply_to_user_id').references('users.id').onDelete('SET NULL');

    // 索引
    table.index('post_id');
    table.index('user_id');
    table.index('parent_id');
    table.index('created_at');
    table.index(['post_id', 'created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};
```

### 3.8 点赞表

**migrations/20240101000008_create_likes_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('likes', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.enu('target_type', ['post', 'comment']).notNullable();
    table.uuid('target_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // 外键约束
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 唯一约束（一个用户只能对同一目标点赞一次）
    table.unique(['user_id', 'target_type', 'target_id']);

    // 索引
    table.index('user_id');
    table.index(['target_type', 'target_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('likes');
};
```

### 3.9 会话表

**migrations/20240101000009_create_conversations_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('conversations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.enu('type', ['private', 'group']).notNullable();
    table.string('name', 100);
    table.text('avatar');
    table.uuid('creator_id');
    table.uuid('last_message_id');
    table.text('last_message_content');
    table.timestamp('last_message_time');
    table.timestamps(true, true);

    // 外键约束
    table.foreign('creator_id').references('users.id').onDelete('SET NULL');

    // 索引
    table.index('type');
    table.index('last_message_time');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('conversations');
};
```

### 3.10 会话成员表

**migrations/20240101000010_create_conversation_members_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('conversation_members', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('conversation_id').notNullable();
    table.uuid('user_id').notNullable();
    table.enu('role', ['owner', 'admin', 'member']).defaultTo('member');
    table.boolean('is_pinned').defaultTo(false);
    table.boolean('is_muted').defaultTo(false);
    table.integer('unread_count').defaultTo(0);
    table.uuid('last_read_message_id');
    table.timestamp('last_read_time');
    table.timestamp('joined_at').defaultTo(knex.fn.now());

    // 外键约束
    table.foreign('conversation_id').references('conversations.id').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 唯一约束
    table.unique(['conversation_id', 'user_id']);

    // 索引
    table.index('conversation_id');
    table.index('user_id');
    table.index(['user_id', 'is_pinned']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('conversation_members');
};
```

### 3.11 通知表

**migrations/20240101000011_create_notifications_table.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('notifications', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.enu('type', ['message', 'friend_request', 'like', 'comment', 'system']).notNullable();
    table.string('title', 100);
    table.text('content');
    table.jsonb('data');
    table.boolean('is_read').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // 外键约束
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // 索引
    table.index('user_id');
    table.index('is_read');
    table.index('created_at');
    table.index(['user_id', 'is_read', 'created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};
```

---

## 4. 种子数据

### 4.1 测试用户

**seeds/01_users.js**:
```javascript
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // 清空表
  await knex('users').del();

  const passwordHash = await bcrypt.hash('Test123456!', 10);

  // 插入种子数据
  await knex('users').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      username: 'admin',
      email: 'admin@example.com',
      password_hash: passwordHash,
      nickname: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'System administrator',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      username: 'testuser1',
      email: 'test1@example.com',
      password_hash: passwordHash,
      nickname: 'Test User 1',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Hello world!',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      username: 'testuser2',
      email: 'test2@example.com',
      password_hash: passwordHash,
      nickname: 'Test User 2',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Nice to meet you!',
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};
```

### 4.2 测试话题

**seeds/02_topics.js**:
```javascript
exports.seed = async function(knex) {
  await knex('topics').del();

  await knex('topics').insert([
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Technology',
      description: 'Discuss the latest in tech',
      cover_image: 'https://picsum.photos/seed/tech/400/200',
      is_hot: true,
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      name: 'Travel',
      description: 'Share your travel experiences',
      cover_image: 'https://picsum.photos/seed/travel/400/200',
      is_hot: true,
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      name: 'Food',
      description: 'Food lovers unite!',
      cover_image: 'https://picsum.photos/seed/food/400/200',
      is_hot: false,
      status: 'active',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};
```

### 4.3 测试动态

**seeds/03_posts.js**:
```javascript
exports.seed = async function(knex) {
  await knex('posts').del();

  await knex('posts').insert([
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      user_id: '22222222-2222-2222-2222-222222222222',
      type: 'text',
      content: 'Hello everyone! This is my first post.',
      visibility: 'public',
      status: 'published',
      like_count: 10,
      comment_count: 5,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      user_id: '33333333-3333-3333-3333-333333333333',
      type: 'image',
      content: 'Check out this beautiful sunset!',
      images: knex.raw("ARRAY['https://picsum.photos/seed/sunset1/800/600', 'https://picsum.photos/seed/sunset2/800/600']"),
      visibility: 'public',
      status: 'published',
      like_count: 25,
      comment_count: 8,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};
```

---

## 5. 迁移管理

### 5.1 运行迁移

```bash
# 运行所有待执行的迁移
npm run db:migrate

# 查看迁移状态
npm run db:migrate:status

# 回滚上一批迁移
npm run db:migrate:rollback

# 回滚所有迁移
npm run db:migrate:rollback --all
```

### 5.2 创建新迁移

```bash
# 创建新的迁移文件
npm run db:migrate:make add_user_verified_column

# 在生成的文件中编写 up 和 down 方法
```

**migrations/20240101000012_add_user_verified_column.js**:
```javascript
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');

    // 添加索引
    table.index('is_verified');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('is_verified');
    table.dropColumn('verified_at');
  });
};
```

### 5.3 数据迁移

当需要迁移数据时（不仅是结构变更）：

**migrations/20240101000013_migrate_old_avatar_format.js**:
```javascript
exports.up = async function(knex) {
  // 批量更新旧格式的头像 URL
  const users = await knex('users').select('id', 'avatar');

  for (const user of users) {
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const newUrl = `https://cdn.example.com${user.avatar}`;
      await knex('users')
        .where('id', user.id)
        .update({ avatar: newUrl });
    }
  }
};

exports.down = async function(knex) {
  // 回滚：将 CDN URL 转回相对路径
  const users = await knex('users').select('id', 'avatar');

  for (const user of users) {
    if (user.avatar && user.avatar.startsWith('https://cdn.example.com/')) {
      const oldUrl = user.avatar.replace('https://cdn.example.com', '');
      await knex('users')
        .where('id', user.id)
        .update({ avatar: oldUrl });
    }
  }
};
```

### 5.4 生产环境迁移流程

```bash
# 1. 备份数据库
pg_dump -U postgres -d social_chat > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. 运行迁移（在维护窗口期间）
NODE_ENV=production npm run db:migrate

# 3. 验证迁移结果
npm run db:migrate:status

# 4. 如果出现问题，回滚
NODE_ENV=production npm run db:migrate:rollback

# 5. 恢复备份（最坏情况）
psql -U postgres -d social_chat < backup_20240101_120000.sql
```

### 5.5 迁移最佳实践

1. **向后兼容**
   - 新增列时使用默认值或允许 NULL
   - 先添加列再填充数据，最后添加 NOT NULL 约束

2. **分步迁移**
   ```javascript
   // Step 1: 添加新列（允许 NULL）
   exports.up = function(knex) {
     return knex.schema.table('users', function(table) {
       table.string('new_email', 100);
     });
   };

   // Step 2: 迁移数据
   exports.up = async function(knex) {
     await knex.raw(`
       UPDATE users
       SET new_email = email
       WHERE new_email IS NULL
     `);
   };

   // Step 3: 添加约束
   exports.up = function(knex) {
     return knex.schema.alterTable('users', function(table) {
       table.string('new_email', 100).notNullable().alter();
       table.unique('new_email');
     });
   };

   // Step 4: 删除旧列
   exports.up = function(knex) {
     return knex.schema.table('users', function(table) {
       table.dropColumn('email');
     });
   };

   // Step 5: 重命名新列
   exports.up = function(knex) {
     return knex.schema.raw('ALTER TABLE users RENAME COLUMN new_email TO email');
   };
   ```

3. **性能优化**
   - 大表迁移时分批处理
   - 在非高峰期执行
   - 监控迁移进度

4. **测试迁移**
   ```bash
   # 在开发环境测试完整迁移流程
   npm run db:migrate:rollback --all
   npm run db:migrate
   npm run db:seed
   ```

---

## 6. MongoDB 集合初始化

### 6.1 创建集合和索引

**scripts/init-mongodb.js**:
```javascript
const { MongoClient } = require('mongodb');

async function initMongoDB() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    // 创建 messages 集合
    const messagesCollection = db.collection('messages');
    await messagesCollection.createIndexes([
      { key: { conversationId: 1, createdAt: -1 } },
      { key: { senderId: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: 1 }, expireAfterSeconds: 7776000 } // 90天后过期
    ]);
    console.log('Messages collection indexes created');

    // 创建 search_history 集合
    const searchHistoryCollection = db.collection('search_history');
    await searchHistoryCollection.createIndexes([
      { key: { userId: 1, createdAt: -1 } },
      { key: { keyword: 'text' } },
      { key: { createdAt: 1 }, expireAfterSeconds: 2592000 } // 30天后过期
    ]);
    console.log('Search history collection indexes created');

    console.log('MongoDB initialization completed');
  } catch (error) {
    console.error('MongoDB initialization error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initMongoDB();
```

运行初始化脚本：
```bash
node scripts/init-mongodb.js
```

---

## 附录

### A. 完整迁移命令参考

```bash
# 创建迁移
npm run db:migrate:make migration_name

# 运行所有迁移
npm run db:migrate

# 运行到指定版本
npm run db:migrate:up 20240101000005_create_topics_table.js

# 回滚最后一批
npm run db:migrate:rollback

# 回滚到指定版本
npm run db:migrate:rollback --to 20240101000003

# 查看迁移状态
npm run db:migrate:status

# 查看当前版本
npm run db:migrate:currentVersion

# 强制解锁（慎用）
npm run db:migrate:unlock

# 运行种子数据
npm run db:seed

# 创建种子文件
npm run db:seed:make seed_name
```

### B. 故障排查

**问题 1: 迁移卡住**
```bash
# 查看锁定状态
SELECT * FROM knex_migrations_lock;

# 手动解锁
npm run db:migrate:unlock
```

**问题 2: 迁移失败**
```bash
# 查看迁移历史
SELECT * FROM knex_migrations ORDER BY batch DESC;

# 手动回滚
npm run db:migrate:rollback

# 修复后重新运行
npm run db:migrate
```

**问题 3: 索引冲突**
```sql
-- 删除索引
DROP INDEX IF EXISTS idx_users_username;

-- 重新创建
CREATE INDEX idx_users_username ON users(username);
```

---

**文档版本**: v1.0.0
**最后更新**: 2024-01-01
**维护者**: Database Team
