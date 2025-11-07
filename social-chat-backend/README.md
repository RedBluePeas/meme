# 社交聊天应用 - 后端 API

基于 Node.js + Express + TypeScript 开发的社交聊天应用后端服务。

## 技术栈

- **运行环境**: Node.js 18+
- **Web 框架**: Express.js
- **语言**: TypeScript
- **数据库**:
  - PostgreSQL (业务数据)
  - MongoDB (消息记录)
  - Redis (缓存/会话)
- **实时通信**: Socket.IO
- **认证**: JWT (Access Token + Refresh Token)
- **文件上传**: Multer
- **日志**: Winston
- **测试**: Jest + Supertest

## 功能模块

- ✅ 用户系统 (注册、登录、个人资料)
- ✅ 即时通讯 (单聊、群聊、实时消息)
- ✅ 社交动态 (发布、点赞、评论)
- ✅ 好友系统 (申请、管理、分组)
- ✅ 话题社区 (话题、关注、讨论)
- ✅ 通知系统 (消息通知、系统通知)
- ✅ 搜索功能 (全局搜索、用户搜索)
- ✅ 文件上传 (图片、视频)

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 14
- MongoDB >= 6.0
- Redis >= 7.0

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入实际配置
```

### 数据库迁移

```bash
# 运行迁移
npm run migrate:latest

# 填充种子数据
npm run seed:run
```

### 启动开发服务器

```bash
npm run dev
```

服务将运行在 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
npm run start:prod
```

## 项目结构

```
social-chat-backend/
├── src/
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器层
│   ├── middleware/      # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由定义
│   ├── services/        # 业务逻辑层
│   ├── utils/           # 工具函数
│   ├── validators/      # 数据验证
│   ├── types/           # TypeScript 类型
│   ├── websocket/       # WebSocket 处理
│   ├── app.ts           # Express 应用配置
│   └── server.ts        # 服务器入口
├── migrations/          # 数据库迁移文件
├── seeds/               # 数据库种子文件
├── tests/               # 测试文件
├── uploads/             # 文件上传目录
├── logs/                # 日志目录
└── dist/                # 编译输出目录
```

## API 文档

启动服务后访问 Swagger 文档：
- 开发环境: `http://localhost:3000/api-docs`

## 可用脚本

```bash
npm run dev              # 开发模式
npm run build            # 构建项目
npm run start            # 启动生产服务
npm run test             # 运行测试
npm run test:coverage    # 测试覆盖率
npm run lint             # 代码检查
npm run lint:fix         # 自动修复代码问题
npm run format           # 格式化代码
npm run migrate:latest   # 运行数据库迁移
npm run migrate:rollback # 回滚数据库迁移
npm run seed:run         # 运行种子数据
```

## 环境变量

查看 `.env.example` 文件了解所有可配置的环境变量。

## 数据库设计

详细的数据库设计文档请参考：
- [数据库迁移文档](../docs/database-migrations.md)
- [后端开发指南](../docs/backend-development-guide.md)

## API 测试

详细的 API 测试文档请参考：
- [API 测试集合](../docs/api-testing-collection.md)

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t social-chat-backend .

# 运行容器
docker run -p 3000:3000 --env-file .env social-chat-backend
```

### Docker Compose

```bash
docker-compose up -d
```

## 许可证

MIT License
