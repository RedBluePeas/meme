# 开发规范文档

## 目录
- [代码提交规范](#代码提交规范)
- [API 开发规范](#api-开发规范)
- [数据库变更规范](#数据库变更规范)
- [测试规范](#测试规范)
- [代码审查清单](#代码审查清单)

---

## API 开发规范

### ⚠️ 重要规则：API 改动必须同步更新文档

**任何对 API 的改动（新增、修改、删除）都必须同步更新 Swagger 文档。**

### API 开发流程

当你需要添加或修改 API 接口时，必须按以下顺序完成：

```
1. 设计 API 接口
   ↓
2. 更新 Swagger 文档（src/config/swagger.ts）
   ↓
3. 实现 Service 层
   ↓
4. 实现 Controller 层
   ↓
5. 创建 Validator
   ↓
6. 创建 Route
   ↓
7. 编写测试
   ↓
8. 验证 Swagger 文档正确性
```

### 必须更新 Swagger 文档的场景

#### 1. 新增 API 接口

**示例：添加删除动态接口**

```typescript
// src/config/swagger.ts

paths: {
  // ... 其他接口

  '/posts/{postId}': {
    delete: {
      tags: ['Posts'],
      summary: '删除动态',
      description: '删除指定的动态内容',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: '动态ID',
        },
      ],
      responses: {
        '200': {
          description: '删除成功',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'integer', example: 200 },
                  message: { type: 'string', example: '删除成功' },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError',
        },
        '404': {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
}
```

#### 2. 修改现有接口

**场景：修改请求参数或响应格式**

```typescript
// 错误示例 ❌
// 只修改了代码，没有更新文档

// 正确示例 ✅
// 1. 修改代码
// 2. 同时更新 Swagger 文档中的 requestBody 或 responses
```

#### 3. 删除接口

从 `src/config/swagger.ts` 的 `paths` 中移除对应的接口定义。

#### 4. 修改数据模型

**示例：User 模型新增字段**

```typescript
// src/config/swagger.ts

components: {
  schemas: {
    User: {
      type: 'object',
      properties: {
        // ... 现有字段

        // 新增字段
        isOnline: {
          type: 'boolean',
          description: '用户是否在线',
          example: true,
        },
        lastSeenAt: {
          type: 'string',
          format: 'date-time',
          description: '最后活跃时间',
          nullable: true,
        },
      },
    },
  },
}
```

### Swagger 文档更新检查清单

在提交代码前，确保完成以下检查：

- [ ] 新增/修改的接口已添加到 `paths` 中
- [ ] 接口的 `tags` 正确分类
- [ ] `summary` 和 `description` 清晰描述接口用途
- [ ] `parameters` 定义完整（path、query、header）
- [ ] `requestBody` 包含所有必填和可选字段
- [ ] `responses` 覆盖所有可能的响应状态码（200, 400, 401, 404, 500）
- [ ] 使用 `$ref` 引用公共的 schema 和 response
- [ ] 需要认证的接口添加 `security: [{ bearerAuth: [] }]`
- [ ] 所有自定义数据模型已在 `components.schemas` 中定义
- [ ] 示例数据（example）准确反映实际返回格式

### 验证文档正确性

#### 1. 本地启动服务

```bash
npm run dev
```

#### 2. 访问 Swagger UI

打开浏览器访问：http://localhost:3000/api-docs

#### 3. 测试接口

在 Swagger UI 中：
- 点击 "Authorize" 按钮，输入测试 Token
- 展开你新增/修改的接口
- 点击 "Try it out"
- 填写参数并执行
- 验证响应格式是否与文档一致

#### 4. 检查 JSON 格式

访问：http://localhost:3000/api-docs/swagger.json

确保 JSON 格式正确，没有语法错误。

### 常见错误及修复

#### ❌ 错误 1：忘记更新文档

```bash
# 修改了 API，但没有更新 Swagger
git diff src/routes/post.ts  # 有改动
git diff src/config/swagger.ts  # 无改动 ⚠️
```

**修复：** 在提交前补充 Swagger 文档更新

#### ❌ 错误 2：文档与实际不符

```typescript
// 实际代码中是必填参数
body('title').notEmpty()

// 但文档中标记为可选
requestBody: {
  required: false,  // ❌ 错误！
  // ...
}
```

**修复：** 确保文档的 `required` 与代码验证器一致

#### ❌ 错误 3：缺少响应状态码

```typescript
// 代码中可能抛出 404 错误
if (!post) {
  throw new AppError(404, '动态不存在');
}

// 但文档中没有定义 404 响应
responses: {
  '200': { /* ... */ },
  // 缺少 '404' ❌
}
```

**修复：** 添加所有可能的响应状态码

### 文档模板

#### 基础 CRUD 接口模板

```typescript
// 创建资源
post: {
  tags: ['ResourceName'],
  summary: '创建资源',
  description: '详细描述',
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['field1', 'field2'],
          properties: {
            field1: { type: 'string', example: 'value1' },
            field2: { type: 'string', example: 'value2' },
          },
        },
      },
    },
  },
  responses: {
    '201': {
      description: '创建成功',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: { type: 'integer', example: 201 },
              message: { type: 'string', example: '创建成功' },
              data: { $ref: '#/components/schemas/ResourceName' },
            },
          },
        },
      },
    },
    '400': { $ref: '#/components/responses/ValidationError' },
    '401': { $ref: '#/components/responses/UnauthorizedError' },
  },
},

// 查询列表
get: {
  tags: ['ResourceName'],
  summary: '获取资源列表',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'page',
      in: 'query',
      schema: { type: 'integer', default: 1 },
    },
    {
      name: 'pageSize',
      in: 'query',
      schema: { type: 'integer', default: 20 },
    },
  ],
  responses: {
    '200': {
      description: '成功',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: { type: 'integer', example: 200 },
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ResourceName' },
                  },
                  total: { type: 'integer' },
                  page: { type: 'integer' },
                  pageSize: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
    '401': { $ref: '#/components/responses/UnauthorizedError' },
  },
},

// 更新资源
put: {
  tags: ['ResourceName'],
  summary: '更新资源',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' },
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            field1: { type: 'string' },
            field2: { type: 'string' },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: '更新成功',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: { type: 'integer', example: 200 },
              data: { $ref: '#/components/schemas/ResourceName' },
            },
          },
        },
      },
    },
    '400': { $ref: '#/components/responses/ValidationError' },
    '401': { $ref: '#/components/responses/UnauthorizedError' },
    '404': { $ref: '#/components/responses/NotFoundError' },
  },
},

// 删除资源
delete: {
  tags: ['ResourceName'],
  summary: '删除资源',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' },
    },
  ],
  responses: {
    '200': {
      description: '删除成功',
    },
    '401': { $ref: '#/components/responses/UnauthorizedError' },
    '404': { $ref: '#/components/responses/NotFoundError' },
  },
},
```

---

## 代码提交规范

### Commit Message 格式

使用约定式提交（Conventional Commits）规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新（**包括 Swagger 文档**）
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（既不是新增功能，也不是修复 Bug）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

#### Scope 范围

- `auth`: 认证模块
- `user`: 用户模块
- `post`: 动态模块
- `comment`: 评论模块
- `friend`: 好友模块
- `message`: 消息模块
- `notification`: 通知模块
- `cache`: 缓存
- `db`: 数据库
- `api-docs`: API 文档
- `docker`: Docker 配置
- `test`: 测试

#### 示例

```bash
# 新增 API 接口
feat(post): 添加删除动态接口

- 实现 PostService.deletePost 方法
- 添加 PostController.deletePost 控制器
- 创建 DELETE /api/posts/:postId 路由
- 更新 Swagger API 文档
- 添加单元测试

# 修复 Bug 并更新文档
fix(message): 修复消息未读数统计错误

- 修正 MessageService.getUnreadCount 逻辑
- 更新 Swagger 响应示例
- 添加测试用例

# 仅更新文档
docs(api-docs): 完善好友模块 API 文档

- 添加好友请求接口文档
- 补充响应示例
- 修正参数说明
```

---

## 数据库变更规范

### 创建迁移文件

```bash
npm run migrate:make <migration_name>
```

### 迁移文件规范

- 必须实现 `up` 和 `down` 方法
- `up` 方法：应用变更
- `down` 方法：回滚变更（确保可逆）
- 添加必要的注释说明

### 示例

```typescript
export async function up(knex: Knex): Promise<void> {
  // 添加新字段
  return knex.schema.alterTable('users', (table) => {
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // 回滚：删除字段
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('is_verified');
    table.dropColumn('verified_at');
  });
}
```

### 注意事项

- 生产环境迁移前先在测试环境验证
- 大表变更考虑性能影响
- 不要直接修改已应用的迁移文件

---

## 测试规范

### 测试覆盖率要求

- 语句覆盖率: ≥ 80%
- 分支覆盖率: ≥ 75%
- 函数覆盖率: ≥ 80%
- 行覆盖率: ≥ 80%

### 必须编写测试的场景

1. **新增 Service 方法** - 必须编写单元测试
2. **新增 API 接口** - 必须编写集成测试
3. **修复 Bug** - 添加回归测试防止再次出现
4. **复杂业务逻辑** - 覆盖所有分支

### 测试文件命名

- 单元测试: `*.test.ts` 或 `*.spec.ts`
- 集成测试: `*.integration.test.ts`
- E2E 测试: `*.e2e.test.ts`

---

## 代码审查清单

### 提交前自检

#### 功能实现
- [ ] 功能符合需求
- [ ] 代码逻辑正确
- [ ] 错误处理完善
- [ ] 边界条件考虑

#### API 文档（重要！）
- [ ] **Swagger 文档已同步更新**
- [ ] 接口路径、方法、参数正确
- [ ] 响应格式与实际一致
- [ ] 在 Swagger UI 中测试通过

#### 代码质量
- [ ] 遵循 TypeScript 类型规范
- [ ] 无明显的代码重复
- [ ] 变量命名清晰
- [ ] 添加必要注释

#### 性能
- [ ] 数据库查询优化（使用索引）
- [ ] 缓存策略合理
- [ ] 避免 N+1 查询

#### 安全
- [ ] 输入验证完善
- [ ] 敏感信息不暴露
- [ ] SQL 注入防护
- [ ] XSS 防护

#### 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 测试覆盖率达标

#### 文档
- [ ] API 文档更新
- [ ] 代码注释完善
- [ ] README 更新（如需要）

---

## 开发工作流

### 1. 接到开发任务

```bash
# 创建功能分支
git checkout -b feat/add-user-verification

# 或 Bug 修复分支
git checkout -b fix/message-count-error
```

### 2. 开发功能

按照 API 开发流程：
1. 设计接口
2. **更新 Swagger 文档**
3. 实现代码
4. 编写测试

### 3. 本地验证

```bash
# 运行测试
npm test

# 检查 TypeScript 编译
npm run build

# 启动服务
npm run dev

# 在浏览器中验证 Swagger 文档
# http://localhost:3000/api-docs
```

### 4. 提交代码

```bash
# 添加文件
git add .

# 提交（遵循 Commit Message 规范）
git commit -m "feat(user): 添加用户邮箱验证功能

- 实现邮箱验证 Service 和 Controller
- 添加验证状态数据库字段
- 更新 Swagger API 文档
- 添加单元测试和集成测试
"

# 推送
git push origin feat/add-user-verification
```

### 5. 创建 Pull Request

PR 描述应包含：
- 功能说明
- 测试情况
- **API 文档更新说明**
- 截图（如有 UI 变化）

### 6. Code Review

审查者检查：
- API 文档是否同步更新
- 测试是否完善
- 代码质量

---

## 常见问题

### Q: 只是修改了内部逻辑，没有改 API，还需要更新文档吗？

**A:** 如果 API 的请求/响应格式没有变化，不需要更新 Swagger 文档。但如果响应中的数据结构、字段、状态码有任何变化，都必须更新。

### Q: 我新增了一个内部使用的 API（前端不调用），需要写文档吗？

**A:** 是的。所有对外暴露的 HTTP 接口都应该有文档，即使暂时只内部使用。这有助于：
- 团队协作
- 未来维护
- 系统集成

### Q: Swagger 文档写起来很麻烦，有快捷方式吗？

**A:**
1. 使用本文档提供的模板
2. 复制相似接口的定义并修改
3. 使用 `$ref` 引用公共组件，避免重复
4. 先写代码再补文档往往更麻烦，建议先写文档（API 设计优先）

### Q: 如何处理文档和代码不一致的情况？

**A:**
1. 立即修复，优先级高
2. 提交一个 `docs` 类型的 commit
3. 在 Code Review 中严格检查文档一致性

---

## 附录：开发命令速查

```bash
# 开发
npm run dev                    # 启动开发服务器
npm run build                  # 构建生产代码
npm start                      # 启动生产服务器

# 测试
npm test                       # 运行测试
npm run test:watch             # 监听模式
npm run test:coverage          # 覆盖率报告

# 数据库
npm run migrate:latest         # 运行迁移
npm run migrate:rollback       # 回滚迁移
npm run migrate:make <name>    # 创建迁移

# Docker
docker-compose up -d           # 启动所有服务
docker-compose down            # 停止所有服务
docker-compose logs -f backend # 查看后端日志
docker-compose exec backend sh # 进入容器

# 代码质量
npm run lint                   # 代码检查
npm run lint:fix               # 自动修复
npm run format                 # 代码格式化
```

---

## 重要提醒 ⚠️

**再次强调：任何 API 的改动（新增、修改、删除）都必须同步更新 Swagger 文档！**

这不是可选项，而是强制要求。文档过期会导致：
- 前端开发困难
- 接口调试低效
- 团队协作成本增加
- 系统维护困难

保持文档与代码同步是每个开发者的责任。
