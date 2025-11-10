# 数据库脚本使用说明

## 创建测试用户

### 快速使用

```bash
# 1. 确保数据库服务已启动
sudo service postgresql start
sudo service redis-server start

# 2. 运行数据库迁移（如果还没运行过）
npm run migrate:latest

# 3. 创建测试用户
node scripts/create-test-user.js
```

### 测试账号信息

脚本会创建以下测试账号：

```
用户名: testuser2025
昵称:   测试用户
邮箱:   test2025@example.com
密码:   Test123456
```

### 登录方式

支持三种登录方式：

1. **使用用户名**:
   ```json
   {
     "identifier": "testuser2025",
     "password": "Test123456"
   }
   ```

2. **使用邮箱**:
   ```json
   {
     "identifier": "test2025@example.com",
     "password": "Test123456"
   }
   ```

3. **使用手机号**（如果注册时提供）

### 脚本功能

- ✅ 检查数据库连接
- ✅ 检查用户是否已存在（避免重复创建）
- ✅ 使用 bcrypt 加密密码
- ✅ 插入用户到 PostgreSQL
- ✅ 验证用户创建成功
- ✅ 输出登录信息

### 环境变量

可以通过环境变量自定义数据库连接：

```bash
DB_HOST=localhost \
DB_PORT=5432 \
DB_NAME=social_chat_dev \
DB_USER=postgres \
DB_PASSWORD=password \
node scripts/create-test-user.js
```

### 常见问题

#### 1. 数据库连接失败

**错误**: `ECONNREFUSED`

**解决**:
```bash
# 启动 PostgreSQL
sudo service postgresql start

# 检查状态
sudo service postgresql status
```

#### 2. 表不存在

**错误**: `relation "users" does not exist`

**解决**:
```bash
# 运行数据库迁移
npm run migrate:latest
```

#### 3. 用户已存在

**提示**: `用户已存在！`

**说明**: 不需要重复创建，可以直接使用现有账号登录。

#### 4. 删除测试用户

如果需要删除测试用户：

```bash
# 使用 psql 连接数据库
psql -U postgres -d social_chat_dev

# 删除用户
DELETE FROM users WHERE username = 'testuser2025';
```

### 生产环境注意

⚠️ **此脚本仅用于开发和测试环境**

不要在生产环境使用此脚本：
- 密码为明文硬编码
- 没有安全验证
- 用于快速测试目的

生产环境应该：
- 通过正式的注册 API 创建用户
- 使用强密码策略
- 启用邮箱验证
- 添加审计日志
