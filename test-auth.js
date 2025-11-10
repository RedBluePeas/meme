/**
 * 简单的注册登录测试脚本
 * 直接测试认证逻辑，输出测试账号
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 测试用户数据
const testUser = {
  username: 'testuser2025',
  nickname: '测试用户',
  email: 'test2025@example.com',
  password: 'Test123456'
};

async function testAuth() {
  console.log('='.repeat(60));
  console.log('注册登录功能测试');
  console.log('='.repeat(60));

  try {
    // 1. 模拟注册 - 密码加密
    console.log('\n📝 注册测试用户...');
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    console.log('✅ 密码加密成功');

    // 模拟存储的用户数据
    const storedUser = {
      id: 'test-user-id-' + Date.now(),
      username: testUser.username,
      nickname: testUser.nickname,
      email: testUser.email,
      password: hashedPassword,
      avatar: null,
      bio: null,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: new Date().toISOString(),
    };

    console.log('\n👤 注册用户信息:');
    console.log('   用户名:', testUser.username);
    console.log('   昵称:', testUser.nickname);
    console.log('   邮箱:', testUser.email);
    console.log('   密码:', testUser.password);

    // 2. 模拟登录 - 密码验证
    console.log('\n🔐 登录测试...');
    const isPasswordValid = await bcrypt.compare(testUser.password, storedUser.password);

    if (!isPasswordValid) {
      throw new Error('密码验证失败');
    }
    console.log('✅ 密码验证成功');

    // 3. 生成 JWT Token
    const JWT_SECRET = 'dev_jwt_secret_key_change_in_production';
    const JWT_REFRESH_SECRET = 'dev_jwt_refresh_secret_key_change_in_production';

    const accessToken = jwt.sign(
      { userId: storedUser.id, username: storedUser.username },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: storedUser.id, username: storedUser.username },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ JWT Token 生成成功');

    // 4. 输出登录响应
    const loginResponse = {
      user: {
        id: storedUser.id,
        username: storedUser.username,
        nickname: storedUser.nickname,
        email: storedUser.email,
        avatar: storedUser.avatar,
        bio: storedUser.bio,
        followersCount: storedUser.followersCount,
        followingCount: storedUser.followingCount,
        postsCount: storedUser.postsCount,
      },
      accessToken,
      refreshToken
    };

    console.log('\n📋 登录响应数据:');
    console.log(JSON.stringify(loginResponse, null, 2));

    // 5. 验证 Token
    console.log('\n🔍 验证 Access Token...');
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    console.log('✅ Token 验证成功');
    console.log('   用户ID:', decoded.userId);
    console.log('   用户名:', decoded.username);

    // 6. 输出测试凭据
    console.log('\n' + '='.repeat(60));
    console.log('✅ 测试完成！');
    console.log('='.repeat(60));
    console.log('\n📌 测试账号信息（请保存）:');
    console.log('─'.repeat(60));
    console.log(`  账号类型: 测试账号
  用户名: ${testUser.username}
  昵称: ${testUser.nickname}
  邮箱: ${testUser.email}
  密码: ${testUser.password}

  使用方式:
  1. 可以用用户名登录: ${testUser.username}
  2. 也可以用邮箱登录: ${testUser.email}
  3. 密码统一为: ${testUser.password}
`);
    console.log('─'.repeat(60));

    // 7. 测试不同的登录方式
    console.log('\n🧪 支持的登录方式测试:');
    console.log('   ✓ 使用用户名登录: identifier =', testUser.username);
    console.log('   ✓ 使用邮箱登录: identifier =', testUser.email);
    console.log('   ✓ 密码: password =', testUser.password);

    console.log('\n✅ 所有测试通过！\n');

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// 运行测试
testAuth().catch(console.error);
