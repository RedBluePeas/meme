# Claude AI 开发规则文档

> 本文档是社交聊天H5应用项目的开发规范和约定，Claude AI在每次对话中都应严格遵循这些规则。

**版本**: v1.0
**更新日期**: 2025-11-06
**适用范围**: 所有项目开发任务

---

## 📋 目录

1. [项目基本信息](#1-项目基本信息)
2. [技术栈约束](#2-技术栈约束)
3. [代码规范](#3-代码规范)
4. [文件组织规范](#4-文件组织规范)
5. [命名规范](#5-命名规范)
6. [Git使用规范](#6-git使用规范)
7. [API开发规范](#7-api开发规范)
8. [数据库规范](#8-数据库规范)
9. [前端开发规范](#9-前端开发规范)
10. [后端开发规范](#10-后端开发规范)
11. [测试规范](#11-测试规范)
12. [安全规范](#12-安全规范)
13. [性能优化规范](#13-性能优化规范)
14. [文档规范](#14-文档规范)
15. [错误处理规范](#15-错误处理规范)
16. [开发流程](#16-开发流程)
17. [禁止事项](#17-禁止事项)

---

## 1. 项目基本信息

### 1.1 项目概述
- **项目名称**: 社交聊天H5应用
- **项目类型**: Web Application (H5)
- **主要功能**: 即时通讯、社交互动、内容分享

### 1.2 仓库信息
- **主分支**: main
- **开发分支**: claude/social-chat-app-docs-*
- **分支命名**: 必须以 `claude/` 开头并包含session ID

### 1.3 相关文档
- 产品需求文档: `docs/产品需求文档-PRD.md`
- 技术架构文档: `docs/技术架构文档.md`
- API文档: 待创建
- 数据库设计文档: 见技术架构文档第3.2节

---

## 2. 技术栈约束

### 2.1 前端技术栈（强制）
```json
{
  "框架": "React 18.2+",
  "状态管理": "Redux Toolkit 或 Zustand",
  "UI组件库": "Ant Design Mobile 5.x 或 Vant 4.x",
  "路由": "React Router v6",
  "HTTP客户端": "Axios 1.x",
  "WebSocket": "Socket.io-client 4.x",
  "构建工具": "Vite 5.x",
  "包管理器": "pnpm",
  "语言": "TypeScript 5.x",
  "CSS方案": "CSS Modules 或 Styled-Components 或 TailwindCSS"
}
```

### 2.2 后端技术栈（强制）
```json
{
  "运行时": "Node.js 18+ LTS",
  "框架": "NestJS 10.x 或 Express 4.x",
  "WebSocket": "Socket.io 4.x",
  "ORM": "Sequelize (MySQL) 或 Mongoose (MongoDB)",
  "数据库": "MySQL 8.0 或 MongoDB 6.0",
  "缓存": "Redis 7.0",
  "认证": "JWT + bcrypt",
  "验证": "class-validator 或 Joi",
  "语言": "TypeScript 5.x"
}
```

### 2.3 开发工具（推荐）
- 代码格式化: Prettier
- 代码检查: ESLint
- Git钩子: Husky
- 提交规范: commitlint
- API测试: Postman/Insomnia
- API文档: Swagger/OpenAPI

---

## 3. 代码规范

### 3.1 通用规范

#### 3.1.1 代码风格
- **缩进**: 2个空格（不使用Tab）
- **分号**: 必须使用分号
- **引号**: 统一使用单引号 `'`（JSX除外）
- **行宽**: 最大100字符
- **空行**: 函数之间保留一个空行

#### 3.1.2 注释规范
```typescript
// ❌ 错误：注释太简单
// get user
function getUser() {}

// ✅ 正确：清晰的注释
/**
 * 根据用户ID获取用户详细信息
 * @param userId - 用户ID
 * @returns 用户对象，如果未找到返回null
 */
async function getUserById(userId: string): Promise<User | null> {}

// ✅ 正确：复杂逻辑的行内注释
// 使用Redis缓存避免频繁查询数据库，缓存时间为1小时
const cachedUser = await redis.get(`user:${userId}`);
```

#### 3.1.3 函数规范
```typescript
// ❌ 错误：函数过长、职责不清
function processUserData(user: any) {
  // 100+ 行代码...
}

// ✅ 正确：单一职责、小函数
function validateUser(user: User): boolean {
  return !!user.email && !!user.username;
}

function formatUserData(user: User): FormattedUser {
  return {
    id: user.id,
    name: user.nickname || user.username,
    avatar: user.avatar || DEFAULT_AVATAR
  };
}

function processUserData(user: User): FormattedUser | null {
  if (!validateUser(user)) return null;
  return formatUserData(user);
}
```

#### 3.1.4 变量声明
```typescript
// ❌ 错误：使用var
var count = 0;

// ❌ 错误：可以用const但使用了let
let PI = 3.14159;

// ✅ 正确：优先使用const
const MAX_RETRY = 3;
const config = { timeout: 5000 };

// ✅ 正确：需要重新赋值时使用let
let retryCount = 0;
retryCount += 1;
```

### 3.2 TypeScript规范

#### 3.2.1 类型定义
```typescript
// ❌ 错误：使用any
function processData(data: any) {}

// ❌ 错误：隐式any
function getData() {
  return fetchData();
}

// ✅ 正确：明确的类型定义
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

function processUser(user: User): FormattedUser {
  // ...
}

// ✅ 正确：泛型使用
async function fetchData<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}
```

#### 3.2.2 接口vs类型别名
```typescript
// ✅ 优先使用interface定义对象结构
interface User {
  id: string;
  name: string;
}

// ✅ 使用type定义联合类型、工具类型
type Status = 'pending' | 'success' | 'error';
type ReadonlyUser = Readonly<User>;

// ✅ interface支持声明合并
interface User {
  email: string; // 扩展User接口
}
```

#### 3.2.3 严格模式配置
```json
// tsconfig.json 必须包含
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 4. 文件组织规范

### 4.1 前端项目结构（强制）

```
src/
├── assets/              # 静态资源
├── components/          # 通用组件（大写开头）
│   ├── Button/
│   │   ├── index.tsx
│   │   ├── Button.module.css
│   │   └── types.ts
│   └── index.ts         # 统一导出
├── views/              # 页面组件（大写开头）
│   └── Chat/
│       ├── index.tsx
│       ├── ChatList.tsx
│       ├── ChatRoom.tsx
│       └── types.ts
├── store/              # 状态管理
│   ├── slices/
│   └── index.ts
├── services/           # API服务（小写）
│   ├── api/
│   └── socket/
├── hooks/              # 自定义Hooks（use开头）
├── utils/              # 工具函数（小写）
├── types/              # 类型定义
├── constants/          # 常量定义（大写）
├── router/             # 路由配置
└── config/             # 配置文件
```

### 4.2 后端项目结构（强制）

```
src/
├── modules/            # 业务模块
│   └── user/
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.module.ts
│       ├── entities/
│       │   └── user.entity.ts
│       └── dto/
│           ├── create-user.dto.ts
│           └── update-user.dto.ts
├── common/             # 公共模块
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── config/             # 配置
└── database/           # 数据库
    ├── migrations/
    └── seeds/
```

### 4.3 文件命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 组件文件 | PascalCase | `UserProfile.tsx` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量文件 | UPPER_CASE | `API_ENDPOINTS.ts` |
| 类型文件 | camelCase + .d.ts | `user.types.ts` |
| 样式文件 | 同组件名 | `UserProfile.module.css` |
| 测试文件 | 原文件名 + .test | `utils.test.ts` |

---

## 5. 命名规范

### 5.1 变量命名

```typescript
// ❌ 错误命名
const d = new Date();           // 过于简短
const user_name = 'John';       // 使用下划线
const MAXCOUNT = 100;           // 普通变量大写

// ✅ 正确命名
const currentDate = new Date();
const userName = 'John';
const maxRetryCount = 100;

// ✅ 常量命名（全大写+下划线）
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

// ✅ 布尔值命名（is/has/can开头）
const isAuthenticated = true;
const hasPermission = false;
const canEdit = true;
```

### 5.2 函数命名

```typescript
// ❌ 错误命名
function user() {}              // 不清晰
function get() {}               // 过于简单
function DataProcess() {}       // 大写开头（不是组件）

// ✅ 正确命名（动词开头）
function getUser() {}
function createUser() {}
function updateUserProfile() {}
function deleteMessage() {}
function validateEmail() {}
function formatDate() {}

// ✅ 事件处理函数（handle开头）
function handleClick() {}
function handleSubmit() {}
function handleInputChange() {}
```

### 5.3 组件命名

```typescript
// ❌ 错误
const userlist = () => {}       // 小写
const user_list = () => {}      // 下划线

// ✅ 正确（PascalCase）
const UserList = () => {}
const ChatMessage = () => {}
const ProfileHeader = () => {}
```

### 5.4 接口和类型命名

```typescript
// ✅ Interface（PascalCase，可选I前缀）
interface User {}
interface IUserProfile {}

// ✅ Type（PascalCase）
type Status = 'active' | 'inactive';
type UserRole = 'admin' | 'user';

// ✅ Enum（PascalCase，成员大写）
enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

// ✅ DTO（PascalCase + Dto后缀）
class CreateUserDto {}
class UpdateProfileDto {}
```

### 5.5 CSS类名命名（BEM规范）

```css
/* ✅ 正确：Block__Element--Modifier */
.chat-message {}
.chat-message__content {}
.chat-message__content--highlighted {}
.chat-message__avatar {}
.chat-message--sent {}
.chat-message--received {}
```

---

## 6. Git使用规范

### 6.1 分支管理

```bash
# ✅ 开发分支命名（强制以claude/开头）
claude/feature-chat-system-{sessionId}
claude/fix-message-bug-{sessionId}
claude/docs-api-documentation-{sessionId}

# ❌ 禁止的分支名
feature/chat        # 缺少claude前缀
main               # 禁止直接在main开发
```

### 6.2 提交规范（Conventional Commits）

#### 6.2.1 提交格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 6.2.2 Type类型（必须使用）
```bash
feat:     新功能
fix:      Bug修复
docs:     文档更新
style:    代码格式（不影响代码运行）
refactor: 重构（既不是新增功能，也不是修复bug）
perf:     性能优化
test:     测试相关
chore:    构建过程或辅助工具的变动
ci:       CI/CD相关
revert:   回退提交
```

#### 6.2.3 提交示例

```bash
# ✅ 正确示例
git commit -m "feat(chat): 添加消息撤回功能

- 支持2分钟内撤回消息
- 撤回后显示提示文本
- 更新消息状态为已撤回

Closes #123"

git commit -m "fix(auth): 修复登录token过期问题"

git commit -m "docs: 更新API文档"

git commit -m "refactor(user): 重构用户服务代码结构"

# ❌ 错误示例
git commit -m "update"              # 不清晰
git commit -m "fix bug"             # 缺少scope和详细说明
git commit -m "添加功能"             # 应使用英文type
```

### 6.3 提交频率
- ✅ 完成一个独立功能点立即提交
- ✅ 修复一个bug立即提交
- ❌ 禁止一次提交包含多个不相关的修改
- ❌ 禁止提交未完成的代码（除非使用WIP标记）

### 6.4 推送规范
```bash
# ✅ 首次推送使用-u设置upstream
git push -u origin claude/feature-name-{sessionId}

# ✅ 后续推送
git push

# ❌ 禁止强制推送到共享分支
git push -f origin main  # 禁止！
```

---

## 7. API开发规范

### 7.1 RESTful API设计原则

#### 7.1.1 URL设计
```bash
# ✅ 正确：使用复数名词
GET    /api/v1/users
GET    /api/v1/users/123
POST   /api/v1/users
PUT    /api/v1/users/123
DELETE /api/v1/users/123

# ✅ 正确：资源嵌套（不超过2层）
GET    /api/v1/users/123/posts
GET    /api/v1/groups/456/members

# ❌ 错误：使用动词
GET    /api/v1/getUsers
POST   /api/v1/createUser

# ❌ 错误：URL过深
GET    /api/v1/users/123/posts/456/comments/789/likes
```

#### 7.1.2 HTTP方法使用
```typescript
GET     # 获取资源（幂等、安全）
POST    # 创建资源
PUT     # 完整更新资源（幂等）
PATCH   # 部分更新资源
DELETE  # 删除资源（幂等）

// ✅ 正确使用
GET    /api/v1/users          # 获取用户列表
POST   /api/v1/users          # 创建新用户
PUT    /api/v1/users/123      # 完整更新用户
PATCH  /api/v1/users/123      # 部分更新用户
DELETE /api/v1/users/123      # 删除用户
```

#### 7.1.3 状态码规范
```typescript
// 成功响应
200 OK                  # 请求成功
201 Created            # 创建成功
204 No Content         # 删除成功（无返回内容）

// 客户端错误
400 Bad Request        # 请求参数错误
401 Unauthorized       # 未认证
403 Forbidden          # 无权限
404 Not Found          # 资源不存在
409 Conflict           # 资源冲突
422 Unprocessable Entity  # 验证失败

// 服务器错误
500 Internal Server Error  # 服务器错误
502 Bad Gateway           # 网关错误
503 Service Unavailable   # 服务不可用
```

### 7.2 统一响应格式（强制）

```typescript
// ✅ 成功响应格式
interface SuccessResponse<T> {
  code: 200;
  message: string;
  data: T;
  timestamp: number;
}

// 示例
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "123",
    "username": "john"
  },
  "timestamp": 1699267200000
}

// ✅ 错误响应格式
interface ErrorResponse {
  code: number;
  message: string;
  error?: string;
  details?: any;
  timestamp: number;
}

// 示例
{
  "code": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": {
    "email": "Invalid email format"
  },
  "timestamp": 1699267200000
}

// ✅ 分页响应格式
interface PaginatedResponse<T> {
  code: 200;
  message: string;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  timestamp: number;
}
```

### 7.3 请求参数验证

```typescript
// ✅ 使用DTO进行验证（NestJS示例）
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// ✅ Controller中使用
@Post('users')
async createUser(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
```

### 7.4 API版本控制

```typescript
// ✅ URL版本控制（推荐）
/api/v1/users
/api/v2/users

// ✅ NestJS配置
app.setGlobalPrefix('api/v1');
```

---

## 8. 数据库规范

### 8.1 表命名规范

```sql
-- ✅ 正确：复数、小写、下划线分隔
users
user_profiles
friend_requests
chat_messages

-- ❌ 错误
User                 # 大写
user                 # 单数
UserProfile          # 驼峰
user-profile         # 连字符
```

### 8.2 字段命名规范

```sql
-- ✅ 正确：小写、下划线分隔、见名知意
id
user_id
created_at
updated_at
is_deleted
email_verified

-- ❌ 错误
ID                   # 大写
userId               # 驼峰
create_time          # 不一致（应该是created_at）
del                  # 过于简短
```

### 8.3 字段类型选择

```sql
-- ✅ ID字段
id BIGINT PRIMARY KEY AUTO_INCREMENT

-- ✅ 字符串字段（根据长度选择）
username VARCHAR(50)        # 短字符串
email VARCHAR(100)          # 中等长度
description TEXT            # 长文本
content LONGTEXT            # 超长文本

-- ✅ 时间字段（统一使用TIMESTAMP）
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

-- ✅ 布尔字段
is_active BOOLEAN DEFAULT TRUE
is_deleted BOOLEAN DEFAULT FALSE

-- ✅ 枚举字段
status ENUM('pending', 'active', 'inactive')

-- ✅ JSON字段（MySQL 5.7+）
metadata JSON
```

### 8.4 索引规范

```sql
-- ✅ 主键
PRIMARY KEY (id)

-- ✅ 唯一索引（命名：uk_字段名）
UNIQUE KEY uk_email (email)
UNIQUE KEY uk_username (username)
UNIQUE KEY uk_user_friend (user_id, friend_id)

-- ✅ 普通索引（命名：idx_字段名）
INDEX idx_created_at (created_at)
INDEX idx_user_id (user_id)
INDEX idx_status (status)

-- ✅ 复合索引（最常查询的字段在前）
INDEX idx_user_status (user_id, status)
```

### 8.5 外键约束

```sql
-- ✅ 使用外键确保数据完整性
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
```

### 8.6 表设计最佳实践

```sql
-- ✅ 标准表结构模板
CREATE TABLE users (
  -- 主键
  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  -- 业务字段
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  -- 状态字段
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',

  -- 软删除
  is_deleted BOOLEAN DEFAULT FALSE,

  -- 时间戳（必须字段）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- 索引
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 9. 前端开发规范

### 9.1 React组件规范

#### 9.1.1 函数组件（优先使用）
```typescript
// ✅ 正确：使用函数组件 + Hooks
import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await userApi.getById(userId);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      {/* ... */}
    </div>
  );
};
```

#### 9.1.2 组件文件结构
```typescript
// ✅ 推荐的组件文件组织
// components/UserCard/index.tsx
import React from 'react';
import { UserCardProps } from './types';
import styles from './UserCard.module.css';

export const UserCard: React.FC<UserCardProps> = (props) => {
  // ...
};

// components/UserCard/types.ts
export interface UserCardProps {
  user: User;
  onClick?: () => void;
}

// components/UserCard/UserCard.module.css
.container {
  padding: 16px;
}
```

#### 9.1.3 Props解构
```typescript
// ❌ 错误：不解构props
const UserCard = (props) => {
  return <div>{props.user.name}</div>;
};

// ✅ 正确：解构props
const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return <div onClick={onClick}>{user.name}</div>;
};
```

### 9.2 Hooks使用规范

```typescript
// ✅ 自定义Hook命名（use开头）
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ...
  return { isAuthenticated, login, logout };
};

// ✅ useEffect依赖项完整
useEffect(() => {
  fetchData(userId);
}, [userId]); // 包含所有使用的外部变量

// ✅ useCallback优化性能
const handleClick = useCallback(() => {
  console.log(userId);
}, [userId]);

// ✅ useMemo优化计算
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 9.3 状态管理规范（Redux Toolkit）

```typescript
// ✅ Slice定义
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
```

### 9.4 样式规范

```typescript
// ✅ CSS Modules
import styles from './Button.module.css';

const Button = () => {
  return <button className={styles.button}>Click</button>;
};

// ✅ 条件类名（使用classnames库）
import classNames from 'classnames';

const Button = ({ primary, disabled }) => {
  return (
    <button
      className={classNames(styles.button, {
        [styles.primary]: primary,
        [styles.disabled]: disabled
      })}
    >
      Click
    </button>
  );
};
```

---

## 10. 后端开发规范

### 10.1 Controller规范（NestJS）

```typescript
// ✅ 正确的Controller结构
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: 200, description: '成功' })
  async findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
```

### 10.2 Service规范

```typescript
// ✅ Service应该包含业务逻辑
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cacheService: CacheService
  ) {}

  async findOne(id: string): Promise<User> {
    // 1. 先查缓存
    const cached = await this.cacheService.get(`user:${id}`);
    if (cached) return JSON.parse(cached);

    // 2. 查数据库
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // 3. 写入缓存
    await this.cacheService.set(`user:${id}`, JSON.stringify(user), 3600);

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. 验证用户是否存在
    const exists = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });
    if (exists) {
      throw new ConflictException('Email already exists');
    }

    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3. 创建用户
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    return this.userRepository.save(user);
  }
}
```

### 10.3 错误处理

```typescript
// ✅ 使用NestJS内置异常
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException
} from '@nestjs/common';

// 资源不存在
throw new NotFoundException('User not found');

// 请求参数错误
throw new BadRequestException('Invalid email format');

// 未认证
throw new UnauthorizedException('Invalid credentials');

// 无权限
throw new ForbiddenException('Access denied');

// 资源冲突
throw new ConflictException('Email already exists');
```

### 10.4 异步处理

```typescript
// ✅ 始终使用async/await
async function fetchUser(id: string): Promise<User> {
  try {
    const user = await userRepository.findOne(id);
    return user;
  } catch (error) {
    logger.error('Failed to fetch user:', error);
    throw error;
  }
}

// ❌ 避免使用回调
// ❌ 避免混用Promise.then()和async/await
```

---

## 11. 测试规范

### 11.1 单元测试

```typescript
// ✅ 测试文件命名：*.test.ts 或 *.spec.ts
// utils.test.ts
import { formatDate, validateEmail } from './utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-11-06');
      expect(formatDate(date)).toBe('2025-11-06');
    });

    it('should handle invalid date', () => {
      expect(formatDate(null)).toBe('Invalid Date');
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

### 11.2 测试覆盖率要求

```bash
# ✅ 目标覆盖率
Overall Coverage:    > 80%
Statements:          > 80%
Branches:            > 75%
Functions:           > 80%
Lines:               > 80%
```

---

## 12. 安全规范

### 12.1 密码安全

```typescript
// ✅ 使用bcrypt加密密码
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ❌ 禁止明文存储密码
// ❌ 禁止使用简单的MD5或SHA1
```

### 12.2 SQL注入防护

```typescript
// ✅ 使用参数化查询
const user = await userRepository.findOne({
  where: { email: userInput.email }
});

// ❌ 禁止字符串拼接SQL
const query = `SELECT * FROM users WHERE email = '${userInput.email}'`;
```

### 12.3 XSS防护

```typescript
// ✅ 输入验证和转义
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);

// ✅ React自动转义（使用{}插值）
<div>{userInput}</div>  // 自动转义

// ❌ 避免使用dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 12.4 敏感信息处理

```typescript
// ✅ 不在响应中返回敏感信息
const user = await userService.findOne(id);
const { password, ...safeUser } = user;
return safeUser;

// ✅ 手机号脱敏
function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

// ✅ 环境变量存储敏感配置
const config = {
  jwtSecret: process.env.JWT_SECRET,
  dbPassword: process.env.DB_PASSWORD
};

// ❌ 禁止硬编码敏感信息
const apiKey = 'sk-1234567890';  // 禁止！
```

---

## 13. 性能优化规范

### 13.1 前端性能优化

```typescript
// ✅ 路由懒加载
const ChatRoom = lazy(() => import('./views/Chat/ChatRoom'));

// ✅ 组件懒加载
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));

// ✅ 图片懒加载
<img src={url} loading="lazy" alt="description" />

// ✅ 虚拟列表（大量数据）
import { FixedSizeList } from 'react-window';

// ✅ 防抖节流
import { debounce, throttle } from 'lodash';

const handleSearch = debounce((value) => {
  search(value);
}, 300);

// ✅ useMemo缓存计算
const sortedList = useMemo(() => {
  return list.sort((a, b) => a.name.localeCompare(b.name));
}, [list]);
```

### 13.2 后端性能优化

```typescript
// ✅ 使用Redis缓存热点数据
async function getUser(id: string) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findOne(id);
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  return user;
}

// ✅ 数据库查询优化
// 使用索引、避免N+1查询、使用join代替多次查询

// ✅ 分页查询（必须）
async function getUsers(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;
  const users = await userRepository.find({
    skip,
    take: pageSize
  });
  return users;
}

// ✅ 使用连接池
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});
```

---

## 14. 文档规范

### 14.1 代码注释

```typescript
/**
 * 发送消息到指定会话
 *
 * @param conversationId - 会话ID
 * @param content - 消息内容
 * @param type - 消息类型（text/image/video等）
 * @returns 返回创建的消息对象
 * @throws {NotFoundException} 会话不存在时抛出
 * @throws {ForbiddenException} 无权限发送消息时抛出
 *
 * @example
 * ```typescript
 * const message = await sendMessage('conv123', 'Hello', 'text');
 * ```
 */
async function sendMessage(
  conversationId: string,
  content: string,
  type: MessageType
): Promise<Message> {
  // 实现...
}
```

### 14.2 README文档（必须包含）

```markdown
# 项目名称

## 项目简介
简要描述项目功能和用途

## 技术栈
- React 18
- Node.js 18
- MySQL 8.0
- Redis 7.0

## 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MySQL >= 8.0
- Redis >= 7.0

## 快速开始

### 安装依赖
\`\`\`bash
pnpm install
\`\`\`

### 环境变量配置
复制 `.env.example` 到 `.env` 并配置

### 启动开发服务器
\`\`\`bash
pnpm dev
\`\`\`

## 项目结构
...

## 部署
...

## 许可证
MIT
```

---

## 15. 错误处理规范

### 15.1 前端错误处理

```typescript
// ✅ 统一错误处理
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // HTTP错误
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 未认证，跳转登录
            router.push('/login');
            break;
          case 403:
            Toast.show('无权限访问');
            break;
          case 404:
            Toast.show('资源不存在');
            break;
          default:
            Toast.show('请求失败');
        }
      } else if (error.request) {
        // 网络错误
        Toast.show('网络连接失败');
      }
    } else {
      // 其他错误
      console.error('Unexpected error:', error);
      Toast.show('发生未知错误');
    }
    throw error;
  }
}

// ✅ React Error Boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // 发送错误到监控服务
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 15.2 后端错误处理

```typescript
// ✅ 全局异常过滤器
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // 记录日志
    logger.error({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      stack: exception instanceof Error ? exception.stack : undefined
    });

    // 返回统一错误格式
    response.status(status).json({
      code: status,
      message,
      timestamp: Date.now()
    });
  }
}
```

---

## 16. 开发流程

### 16.1 功能开发流程

```bash
1. 理解需求
   - 阅读需求文档
   - 明确功能边界
   - 设计技术方案

2. 创建分支
   git checkout -b claude/feature-name-{sessionId}

3. 编写代码
   - 遵循本文档所有规范
   - 编写单元测试
   - 添加必要注释

4. 自测
   - 功能测试
   - 边界测试
   - 错误处理测试

5. 提交代码
   git add .
   git commit -m "feat(scope): description"
   git push -u origin claude/feature-name-{sessionId}

6. 创建Pull Request
   - 填写PR描述
   - 关联相关Issue
   - 请求代码审查
```

### 16.2 Bug修复流程

```bash
1. 复现问题
   - 确认bug描述
   - 定位问题代码

2. 创建分支
   git checkout -b claude/fix-bug-description-{sessionId}

3. 修复问题
   - 修改代码
   - 添加测试用例
   - 验证修复效果

4. 提交代码
   git commit -m "fix(scope): description"

5. 推送并创建PR
   git push -u origin claude/fix-bug-description-{sessionId}
```

---

## 17. 禁止事项

### 17.1 代码禁止事项

```typescript
// ❌ 禁止使用any（除非特殊情况）
const data: any = fetchData();

// ❌ 禁止使用var
var count = 0;

// ❌ 禁止使用eval
eval(userInput);

// ❌ 禁止在循环中使用await（应使用Promise.all）
for (const item of items) {
  await processItem(item);  // 禁止！
}
// ✅ 正确做法
await Promise.all(items.map(item => processItem(item)));

// ❌ 禁止硬编码配置
const apiUrl = 'https://api.example.com';  // 禁止！
// ✅ 使用环境变量
const apiUrl = process.env.REACT_APP_API_URL;

// ❌ 禁止console.log在生产代码中（开发调试除外）
console.log('user data:', user);  // 应该使用logger

// ❌ 禁止过深的嵌套（超过3层）
if (a) {
  if (b) {
    if (c) {
      if (d) {  // 禁止！
        // ...
      }
    }
  }
}
```

### 17.2 Git禁止事项

```bash
# ❌ 禁止直接在main分支开发
git checkout main
# 编辑文件...
git commit -m "update"  # 禁止！

# ❌ 禁止强制推送到共享分支
git push -f origin main  # 禁止！

# ❌ 禁止提交敏感信息
git add .env  # 禁止！
git add config/secrets.json  # 禁止！

# ❌ 禁止提交大文件（>10MB）
git add large-video.mp4  # 禁止！

# ❌ 禁止无意义的提交信息
git commit -m "update"  # 禁止！
git commit -m "fix"     # 禁止！
git commit -m "aaa"     # 禁止！
```

### 17.3 安全禁止事项

```typescript
// ❌ 禁止明文存储密码
const user = {
  username: 'john',
  password: '123456'  // 禁止！
};

// ❌ 禁止SQL拼接
const sql = `SELECT * FROM users WHERE id = ${userId}`;  // 禁止！

// ❌ 禁止使用dangerouslySetInnerHTML（除非必要且已消毒）
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // 危险！

// ❌ 禁止在客户端存储敏感信息
localStorage.setItem('password', password);  // 禁止！
```

---

## 18. 检查清单

### 18.1 代码提交前检查

- [ ] 代码符合ESLint规范
- [ ] TypeScript无类型错误
- [ ] 所有测试通过
- [ ] 已添加必要的注释
- [ ] 已删除console.log
- [ ] 已删除无用代码和注释
- [ ] Git commit message符合规范
- [ ] 无敏感信息泄露
- [ ] 代码已自测

### 18.2 功能开发完成检查

- [ ] 功能符合需求文档
- [ ] 已处理边界情况
- [ ] 已处理错误情况
- [ ] 界面友好美观
- [ ] 性能满足要求
- [ ] 已编写单元测试
- [ ] 已更新相关文档
- [ ] 已通过代码审查

### 18.3 API开发完成检查

- [ ] 接口符合RESTful规范
- [ ] 请求参数已验证
- [ ] 响应格式统一
- [ ] 状态码使用正确
- [ ] 已添加API文档
- [ ] 已添加错误处理
- [ ] 已添加接口测试

---

## 19. 常见问题FAQ

### Q1: 什么时候使用any类型？
A: 尽量避免使用any。如果确实需要，可以考虑：
- 与第三方库交互且类型定义缺失
- 使用unknown代替any，然后类型守卫

### Q2: 如何处理异步错误？
A: 使用try-catch包裹async函数，或使用.catch()处理Promise

### Q3: 何时使用useCallback和useMemo？
A:
- useCallback: 当函数作为props传递给子组件，避免子组件重渲染
- useMemo: 当计算成本高，且依赖项不常变化时

### Q4: 数据库迁移如何管理？
A: 使用ORM提供的migration工具，所有schema变更都通过migration文件

### Q5: 如何处理跨域问题？
A:
- 开发环境：配置Vite proxy
- 生产环境：后端配置CORS

---

## 20. 更新日志

### v1.0 - 2025-11-06
- 初始版本
- 包含所有基础开发规范

---

## 附录

### A. 快速参考

#### 常用命令
```bash
# 开发
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

#### 常用Git命令
```bash
# 创建分支
git checkout -b claude/feature-name-{sessionId}

# 提交代码
git add .
git commit -m "feat(scope): description"

# 推送代码
git push -u origin claude/feature-name-{sessionId}

# 查看状态
git status

# 查看日志
git log --oneline
```

---

**请在每次开发前仔细阅读本规范，确保代码质量和项目一致性！**
