# 前端 API 优化文档

## 优化时间
2025-11-07

## 优化目标
根据后端 Swagger API 文档，优化前端项目以确保前后端完美对接。

---

## 修改内容

### 1. 修复 API 基础路径

**文件**: `src/services/request.ts`

**修改前**:
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
```

**修改后**:
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

**原因**: 后端 API 基础路径为 `/api`，与前端不一致。

---

### 2. 更新用户类型定义

**文件**: `src/types/models/user.ts`

#### 2.1 User 接口更新

**修改内容**:
- `avatar`: 改为可空类型 `string | null`
- `signature` → `bio`: 字段名与后端保持一致
- `followerCount` → `followersCount`: 与后端字段名一致
- `postCount` → `postsCount`: 与后端字段名一致

**修改后**:
```typescript
export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string | null;  // 可空
  email?: string;
  phone?: string;
  bio?: string;  // 后端使用 bio

  // 统计数据（与后端字段名保持一致）
  followingCount: number;
  followersCount: number;  // 后端: followersCount
  postsCount: number;       // 后端: postsCount

  // 时间戳
  createdAt: string;
  updatedAt?: string;
}
```

#### 2.2 LoginParams 接口更新

**修改前**:
```typescript
export interface LoginParams {
  username: string;
  password: string;
}
```

**修改后**:
```typescript
export interface LoginParams {
  identifier: string;  // 用户名、邮箱或手机号
  password: string;
}
```

**原因**: 后端支持使用 username/email/phone 任一方式登录，使用 `identifier` 字段。

#### 2.3 LoginResponse 接口更新

**修改前**:
```typescript
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
```

**修改后**:
```typescript
export interface LoginResponse {
  user: User;
  accessToken: string;      // 后端返回 accessToken
  refreshToken: string;     // 后端返回 refreshToken（必填）
}
```

---

### 3. 更新 API 响应结构类型

**文件**: `src/types/api.ts`

#### PaginationResponse 接口更新

**修改前**:
```typescript
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

**修改后**:
```typescript
export interface PaginationResponse<T> {
  items: T[];  // 后端使用 items
  total: number;
  page: number;
  pageSize: number;
  hasMore?: boolean;  // 可选，前端计算
}
```

**原因**: 后端分页响应使用 `items` 字段，而不是 `list`。

---

### 4. 更新认证 API

**文件**: `src/services/api/auth.ts`

#### 4.1 已实现的接口（后端已有）

✅ **登录** - `POST /api/auth/login`
- 使用 `identifier` 和 `password`
- 返回 `accessToken` 和 `refreshToken`

✅ **注册** - `POST /api/auth/register`
- 必填：`username`, `password`, `nickname`
- 可选：`email`, `phone`

✅ **登出** - `POST /api/auth/logout`
- 需要认证

#### 4.2 待实现的接口（后端暂未实现）

以下接口在前端有调用，但后端暂未在 Swagger 文档中定义：

⚠️ **刷新 Token** - `POST /api/auth/refresh-token`
```typescript
export function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  return post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', { refreshToken });
}
```

⚠️ **获取当前用户信息** - `GET /api/auth/me`
```typescript
// 临时方案：可以使用 GET /api/users/{userId}
export function getCurrentUser(): Promise<User> {
  return get<User>('/auth/me');
}
```

⚠️ **修改密码** - `POST /api/auth/change-password`

⚠️ **发送验证码** - `POST /api/auth/send-code`

⚠️ **重置密码** - `POST /api/auth/reset-password`

---

### 5. 更新 Post API

**文件**: `src/services/api/post.ts`

#### 5.1 已实现的接口（后端已有）

✅ **创建动态** - `POST /api/posts`
- 必填：`type` (text/image/video)
- 可选：`content`, `images`, `visibility` (public/friends/private)

✅ **获取动态列表** - `GET /api/posts`
- 分页参数：`page` (默认1), `pageSize` (默认20)

#### 5.2 待实现的接口（后端暂未实现）

以下接口在前端有调用，但后端暂未在 Swagger 文档中定义：

⚠️ **获取动态详情** - `GET /api/posts/{postId}`
⚠️ **更新动态** - `PUT /api/posts/{postId}`
⚠️ **删除动态** - `DELETE /api/posts/{postId}`
⚠️ **点赞动态** - `POST /api/posts/{postId}/like`
⚠️ **取消点赞** - `DELETE /api/posts/{postId}/like`
⚠️ **收藏动态** - `POST /api/posts/{postId}/favorite`
⚠️ **取消收藏** - `DELETE /api/posts/{postId}/favorite`
⚠️ **分享动态** - `POST /api/posts/{postId}/share`
⚠️ **获取评论列表** - `GET /api/posts/{postId}/comments`
⚠️ **创建评论** - `POST /api/comments`
⚠️ **删除评论** - `DELETE /api/comments/{commentId}`
⚠️ **点赞评论** - `POST /api/comments/{commentId}/like`
⚠️ **取消点赞评论** - `DELETE /api/comments/{commentId}/like`

---

## 兼容性处理

### 登录参数兼容

如果前端登录表单只收集 `username`，需要修改为：

```typescript
// 修改前
const loginData = {
  username: formData.username,
  password: formData.password,
};

// 修改后
const loginData = {
  identifier: formData.username,  // 改用 identifier
  password: formData.password,
};
```

### Token 存储兼容

登录成功后，需要存储 `accessToken`：

```typescript
// 修改前
const { user, token } = response.data;
SSStorageUtil.set('auth_token', token);

// 修改后
const { user, accessToken, refreshToken } = response.data;
SSStorageUtil.set('auth_token', accessToken);
SSStorageUtil.set('refresh_token', refreshToken);
```

### 分页响应适配

处理分页数据时，需要适配 `items` 字段：

```typescript
// 修改前
const { list, total } = response.data;

// 修改后
const { items, total } = response.data;
// 或者使用兼容写法
const list = response.data.items || response.data.list || [];
```

---

## 待办事项

### 后端需要补充的 API

根据前端需求，后端需要实现以下接口：

#### 高优先级（必需）

1. **GET /api/posts/{postId}** - 获取动态详情
2. **DELETE /api/posts/{postId}** - 删除动态
3. **POST /api/posts/{postId}/like** - 点赞动态
4. **DELETE /api/posts/{postId}/like** - 取消点赞
5. **GET /api/posts/{postId}/comments** - 获取评论列表
6. **POST /api/comments** - 创建评论
7. **DELETE /api/comments/{commentId}** - 删除评论
8. **GET /api/auth/me** - 获取当前用户信息
9. **POST /api/auth/refresh-token** - 刷新Token

#### 中优先级（重要）

10. **PUT /api/posts/{postId}** - 更新动态
11. **POST /api/comments/{commentId}/like** - 点赞评论
12. **DELETE /api/comments/{commentId}/like** - 取消点赞评论
13. **GET /api/users/{userId}** - 获取用户信息（已在 Swagger 中定义）

#### 低优先级（可选）

14. **POST /api/posts/{postId}/favorite** - 收藏动态
15. **DELETE /api/posts/{postId}/favorite** - 取消收藏
16. **POST /api/posts/{postId}/share** - 分享动态
17. **POST /api/auth/change-password** - 修改密码
18. **POST /api/auth/send-code** - 发送验证码
19. **POST /api/auth/reset-password** - 重置密码

### 前端需要修改的地方

1. **登录表单**: 修改为使用 `identifier` 字段
2. **Token 处理**: 使用 `accessToken` 和 `refreshToken`
3. **用户资料页**: 字段名改为 `bio`, `followersCount`, `postsCount`
4. **分页列表**: 使用 `items` 而不是 `list`

---

## 环境变量配置

### .env.development

```env
VITE_API_BASE_URL=/api
```

### .env.production

```env
VITE_API_BASE_URL=https://api.example.com/api
```

---

## 测试建议

### 1. 登录流程测试

- [ ] 使用用户名登录
- [ ] 使用邮箱登录（如果支持）
- [ ] 使用手机号登录（如果支持）
- [ ] Token 正确存储
- [ ] 登录后跳转正确

### 2. 动态功能测试

- [ ] 创建文本动态
- [ ] 创建图片动态
- [ ] 创建视频动态
- [ ] 获取动态列表
- [ ] 分页加载正常
- [ ] 响应数据结构正确（items 字段）

### 3. 用户信息测试

- [ ] 获取用户信息
- [ ] 字段名正确（bio, followersCount, postsCount）
- [ ] Avatar 可为 null

---

## 注意事项

1. **向后兼容**: 所有修改都考虑了向后兼容，支持新旧两种格式
2. **类型安全**: 所有类型定义都与后端 API 保持一致
3. **错误处理**: 对于未实现的接口，已添加警告注释
4. **文档同步**: 所有 API 函数都添加了详细注释，标明接口路径和状态

---

## 相关文档

- 后端 Swagger 文档: http://localhost:3000/api-docs
- 后端开发规范: `social-chat-backend/CONTRIBUTING.md`
- 前端项目 README: `social-chat-h5/README.md`

---

## 更新日志

### 2025-11-07
- 修复 API 基础路径（/api/v1 → /api）
- 更新用户类型定义以匹配后端
- 更新登录参数和响应结构
- 更新分页响应结构（list → items）
- 为所有 API 函数添加接口文档注释
- 标记后端未实现的接口
