/**
 * 创建测试用户到数据库
 * 需要数据库服务已启动
 */

const knex = require('knex');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// 数据库配置
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'social_chat_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
});

// 测试用户数据
const testUser = {
  username: 'testuser2025',
  nickname: '测试用户',
  email: 'test2025@example.com',
  password: 'Test123456',
};

async function createTestUser() {
  console.log('='.repeat(60));
  console.log('创建测试用户到数据库');
  console.log('='.repeat(60));

  try {
    // 1. 检查数据库连接
    console.log('\n🔍 检查数据库连接...');
    await db.raw('SELECT 1');
    console.log('✅ 数据库连接成功');

    // 2. 检查用户是否已存在
    console.log('\n🔍 检查用户是否已存在...');
    const existingUser = await db('users')
      .where({ username: testUser.username })
      .orWhere({ email: testUser.email })
      .first();

    if (existingUser) {
      console.log('⚠️  用户已存在！');
      console.log('   用户名:', existingUser.username);
      console.log('   邮箱:', existingUser.email);
      console.log('\n💡 提示: 您可以直接使用这个账号登录');
      console.log('   密码:', testUser.password);
      await db.destroy();
      return;
    }

    // 3. 加密密码
    console.log('\n🔐 加密密码...');
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    console.log('✅ 密码加密完成');

    // 4. 插入用户到数据库
    console.log('\n📝 创建用户...');
    const userId = uuidv4();
    await db('users').insert({
      id: userId,
      username: testUser.username,
      nickname: testUser.nickname,
      email: testUser.email,
      password: hashedPassword,
      avatar: null,
      bio: null,
      gender: 'unknown',
      birthday: null,
      phone: null,
      background_image: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log('✅ 用户创建成功！');

    // 5. 验证用户已创建
    console.log('\n🔍 验证用户...');
    const createdUser = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'nickname', 'email', 'created_at')
      .first();

    console.log('✅ 用户验证成功');
    console.log('   ID:', createdUser.id);
    console.log('   用户名:', createdUser.username);
    console.log('   昵称:', createdUser.nickname);
    console.log('   邮箱:', createdUser.email);
    console.log('   创建时间:', createdUser.created_at);

    // 6. 输出登录信息
    console.log('\n' + '='.repeat(60));
    console.log('✅ 测试账号创建完成！');
    console.log('='.repeat(60));
    console.log('\n📌 登录信息:');
    console.log('─'.repeat(60));
    console.log(`  用户名: ${testUser.username}`);
    console.log(`  邮箱: ${testUser.email}`);
    console.log(`  密码: ${testUser.password}`);
    console.log('');
    console.log('  登录方式:');
    console.log(`    1. 用户名登录: identifier = ${testUser.username}`);
    console.log(`    2. 邮箱登录: identifier = ${testUser.email}`);
    console.log(`    3. 密码: password = ${testUser.password}`);
    console.log('─'.repeat(60));
    console.log('\n💡 现在可以使用这个账号在前端登录了！\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 提示: 请确保 PostgreSQL 数据库已启动');
      console.error('   启动命令: sudo service postgresql start');
    } else if (error.code === '42P01') {
      console.error('\n💡 提示: 数据库表不存在，请先运行迁移');
      console.error('   迁移命令: npm run migrate:latest');
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// 运行脚本
createTestUser();
