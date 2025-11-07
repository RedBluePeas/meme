# 社交聊天应用 - 后端开发文档

## 📋 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈](#2-技术栈)
- [3. 系统架构](#3-系统架构)
- [4. 数据库设计](#4-数据库设计)
- [5. API 接口规范](#5-api-接口规范)
- [6. WebSocket 实时通信](#6-websocket-实时通信)
- [7. 安全与认证](#7-安全与认证)
- [8. 部署指南](#8-部署指南)

---

## 1. 项目概述

### 1.1 项目简介

这是一个现代化的社交聊天应用后端系统，提供即时通讯、社交动态、好友管理、话题社区等功能。

### 1.2 核心功能模块

- **用户系统**: 注册、登录、个人资料管理
- **即时通讯**: 单聊、群聊、消息推送
- **社交动态**: 发布、点赞、评论、分享
- **好友系统**: 好友申请、管理、分组
- **话题社区**: 话题创建、关注、讨论
- **通知系统**: 消息通知、系统通知
- **搜索功能**: 全局搜索、历史记录

### 1.3 技术要求

- 支持高并发即时通讯
- 消息可靠传输和持久化
- 实时在线状态同步
- 支持文件上传（图片、视频、文件）
- 支持 Redis 缓存和消息队列
- 支持水平扩展

---

## 2. 技术栈

### 2.1 推荐技术栈（Node.js）

```yaml
运行环境: Node.js 18+
Web框架: Express.js / Fastify / NestJS
数据库:
  - PostgreSQL (主数据库)
  - MongoDB (消息记录、日志)
  - Redis (缓存、会话、消息队列)
实时通信: Socket.IO
认证: JWT (Access Token + Refresh Token)
文件存储:
  - 本地存储 / MinIO
  - 云存储 (阿里云 OSS / 腾讯云 COS / AWS S3)
消息队列: Redis / RabbitMQ / Kafka
监控日志: Winston / Pino + ELK Stack
API文档: Swagger / OpenAPI
测试: Jest / Supertest
```

### 2.2 备选技术栈（Go）

```yaml
语言: Go 1.20+
Web框架: Gin / Echo / Fiber
数据库:
  - PostgreSQL (主数据库)
  - MongoDB (消息记录)
  - Redis (缓存、会话)
实时通信: Gorilla WebSocket / Socket.IO
认证: JWT
ORM: GORM / Ent
消息队列: Redis / NATS
```

### 2.3 备选技术栈（Java）

```yaml
语言: Java 17+
框架: Spring Boot 3.x
数据库:
  - PostgreSQL / MySQL
  - MongoDB
  - Redis
实时通信: Spring WebSocket / Netty
认证: Spring Security + JWT
消息队列: RabbitMQ / Kafka
```

---

## 3. 系统架构

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                          客户端层                            │
│                   (Web / iOS / Android)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Nginx / 负载均衡                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      API Gateway         │    │   WebSocket Server       │
│    (HTTP RESTful API)    │    │   (Socket.IO / WS)       │
└──────────────────────────┘    └──────────────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        应用服务层                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 用户服务  │ │ 消息服务  │ │ 动态服务  │ │ 通知服务  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
┌──────────────────┐ ┌─────────────┐ ┌──────────────┐
│   PostgreSQL     │ │   MongoDB   │ │    Redis     │
│   (业务数据)      │ │  (消息日志)  │ │  (缓存/队列)  │
└──────────────────┘ └─────────────┘ └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   文件存储服务    │
                    │  (OSS / MinIO)   │
                    └──────────────────┘
```

### 3.2 微服务划分（可选）

- **用户服务 (User Service)**: 用户管理、资料、关注
- **消息服务 (Message Service)**: 即时通讯、会话管理
- **动态服务 (Post Service)**: 动态发布、互动
- **话题服务 (Topic Service)**: 话题管理
- **通知服务 (Notification Service)**: 推送通知
- **文件服务 (Upload Service)**: 文件上传、存储

---

## 4. 数据库设计

### 4.1 PostgreSQL 数据表设计

#### 4.1.1 用户表 (users)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    avatar TEXT,
    bio TEXT,
    gender VARCHAR(10),
    birthday DATE,
    location VARCHAR(100),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',  -- active, inactive, banned
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,

    CONSTRAINT check_status CHECK (status IN ('active', 'inactive', 'banned'))
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
```

#### 4.1.2 好友关系表 (friendships)

```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, accepted, rejected, blocked
    remark VARCHAR(50),  -- 好友备注
    group_name VARCHAR(50),  -- 分组
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_friendship_status CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)
);

CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

#### 4.1.3 关注表 (follows)

```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_follow UNIQUE (follower_id, following_id),
    CONSTRAINT check_not_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

#### 4.1.4 动态表 (posts)

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'text',  -- text, image, video
    content TEXT,
    images TEXT[],  -- 图片 URLs 数组
    video_url TEXT,
    visibility VARCHAR(20) DEFAULT 'public',  -- public, friends, private
    location_name VARCHAR(100),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',  -- draft, published, deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_post_type CHECK (type IN ('text', 'image', 'video')),
    CONSTRAINT check_post_visibility CHECK (visibility IN ('public', 'friends', 'private')),
    CONSTRAINT check_post_status CHECK (status IN ('draft', 'published', 'deleted'))
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_status ON posts(status);
```

#### 4.1.5 话题表 (topics)

```sql
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    posts_count INT DEFAULT 0,
    followers_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    is_hot BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_topic_status CHECK (status IN ('active', 'inactive'))
);

CREATE INDEX idx_topics_name ON topics(name);
CREATE INDEX idx_topics_is_hot ON topics(is_hot);
CREATE INDEX idx_topics_followers_count ON topics(followers_count DESC);
```

#### 4.1.6 动态-话题关联表 (post_topics)

```sql
CREATE TABLE post_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_post_topic UNIQUE (post_id, topic_id)
);

CREATE INDEX idx_post_topics_post_id ON post_topics(post_id);
CREATE INDEX idx_post_topics_topic_id ON post_topics(topic_id);
```

#### 4.1.7 评论表 (comments)

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- 回复的评论ID
    reply_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_comment_status CHECK (status IN ('published', 'deleted'))
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

#### 4.1.8 点赞表 (likes)

```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL,  -- post, comment
    target_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_like_target_type CHECK (target_type IN ('post', 'comment')),
    CONSTRAINT unique_like UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
```

#### 4.1.9 会话表 (conversations)

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL,  -- private, group
    name VARCHAR(100),  -- 群聊名称
    avatar TEXT,  -- 群聊头像
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    last_message_id UUID,
    last_message_content TEXT,
    last_message_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_conversation_type CHECK (type IN ('private', 'group'))
);

CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_last_message_time ON conversations(last_message_time DESC);
```

#### 4.1.10 会话成员表 (conversation_members)

```sql
CREATE TABLE conversation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',  -- owner, admin, member
    is_pinned BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    unread_count INT DEFAULT 0,
    last_read_message_id UUID,
    last_read_time TIMESTAMP,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_member_role CHECK (role IN ('owner', 'admin', 'member')),
    CONSTRAINT unique_conversation_member UNIQUE (conversation_id, user_id)
);

CREATE INDEX idx_conversation_members_conversation_id ON conversation_members(conversation_id);
CREATE INDEX idx_conversation_members_user_id ON conversation_members(user_id);
```

#### 4.1.11 通知表 (notifications)

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- message, friend_request, like, comment, system
    title VARCHAR(100),
    content TEXT,
    data JSONB,  -- 额外数据
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_notification_type CHECK (type IN ('message', 'friend_request', 'like', 'comment', 'system'))
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### 4.2 MongoDB 集合设计

#### 4.2.1 消息集合 (messages)

```javascript
{
  _id: ObjectId,
  conversationId: UUID,
  senderId: UUID,
  type: String,  // text, image, video, audio, file, location
  content: String,
  imageUrl: String,
  videoUrl: String,
  audioUrl: String,
  audioDuration: Number,
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  location: {
    name: String,
    latitude: Number,
    longitude: Number
  },
  replyToId: ObjectId,  // 回复的消息ID
  status: String,  // sending, sent, delivered, read, failed
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date  // 软删除
}

// 索引
db.messages.createIndex({ conversationId: 1, createdAt: -1 })
db.messages.createIndex({ senderId: 1 })
db.messages.createIndex({ status: 1 })
```

#### 4.2.2 搜索历史集合 (search_history)

```javascript
{
  _id: ObjectId,
  userId: UUID,
  keyword: String,
  type: String,  // global, user, post, topic
  createdAt: Date
}

// 索引
db.search_history.createIndex({ userId: 1, createdAt: -1 })
db.search_history.createIndex({ keyword: "text" })  // 全文索引
```

### 4.3 Redis 数据结构

#### 4.3.1 会话缓存

```
Key: session:{userId}
Type: String
Value: JWT Token
TTL: 7 days
```

#### 4.3.2 用户在线状态

```
Key: online:{userId}
Type: String
Value: socketId
TTL: 30 minutes (心跳续期)
```

#### 4.3.3 未读消息计数

```
Key: unread:{userId}
Type: Hash
Field: conversationId
Value: unread count
```

#### 4.3.4 消息队列

```
Key: queue:notifications
Type: List
Value: JSON notification data
```

---

## 5. API 接口规范

### 5.1 通用规范

#### 5.1.1 请求格式

```
Base URL: https://api.example.com/v1
Content-Type: application/json
Authorization: Bearer {token}
```

#### 5.1.2 响应格式

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 响应数据
  }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "Invalid request",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### 5.1.3 分页参数

```json
{
  "page": 1,
  "pageSize": 20
}
```

**分页响应**:
```json
{
  "code": 200,
  "data": {
    "list": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  }
}
```

#### 5.1.4 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

### 5.2 认证模块 API

#### 5.2.1 用户注册

```http
POST /auth/register
Content-Type: application/json

Request:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "code": "123456"  // 验证码
}

Response:
{
  "code": 200,
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "nickname": "johndoe",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 5.2.2 用户登录

```http
POST /auth/login
Content-Type: application/json

Request:
{
  "username": "johndoe",  // 或 email/phone
  "password": "Password123!"
}

Response:
{
  "code": 200,
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "nickname": "John Doe",
      "avatar": "https://...",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 5.2.3 刷新 Token

```http
POST /auth/refresh
Content-Type: application/json

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 5.2.4 退出登录

```http
POST /auth/logout
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Logout successful"
}
```

#### 5.2.5 发送验证码

```http
POST /auth/send-code
Content-Type: application/json

Request:
{
  "type": "email",  // email, phone
  "target": "john@example.com",
  "purpose": "register"  // register, reset_password
}

Response:
{
  "code": 200,
  "message": "Verification code sent"
}
```

### 5.3 用户模块 API

#### 5.3.1 获取当前用户信息

```http
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "nickname": "John Doe",
    "avatar": "https://...",
    "bio": "Hello world",
    "gender": "male",
    "birthday": "1990-01-01",
    "location": "Beijing, China",
    "followersCount": 100,
    "followingCount": 50,
    "postsCount": 20,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 5.3.2 获取用户信息

```http
GET /users/:userId
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "nickname": "John Doe",
    "avatar": "https://...",
    "bio": "Hello world",
    "followersCount": 100,
    "followingCount": 50,
    "postsCount": 20,
    "isFollowing": false,  // 当前用户是否关注该用户
    "isFriend": false      // 是否是好友
  }
}
```

#### 5.3.3 更新个人资料

```http
PUT /users/me
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "nickname": "John Doe",
  "bio": "Hello world!",
  "gender": "male",
  "birthday": "1990-01-01",
  "location": "Beijing, China",
  "website": "https://johndoe.com"
}

Response:
{
  "code": 200,
  "data": {
    "id": "uuid",
    "nickname": "John Doe",
    // ... 更新后的用户信息
  }
}
```

#### 5.3.4 上传头像

```http
POST /users/me/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "avatar": File
}

Response:
{
  "code": 200,
  "data": {
    "url": "https://cdn.example.com/avatars/uuid.jpg"
  }
}
```

#### 5.3.5 关注用户

```http
POST /users/:userId/follow
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Followed successfully"
}
```

#### 5.3.6 取消关注

```http
DELETE /users/:userId/follow
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Unfollowed successfully"
}
```

#### 5.3.7 获取关注列表

```http
GET /users/me/following?page=1&pageSize=20
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "uuid",
        "username": "user1",
        "nickname": "User One",
        "avatar": "https://...",
        "bio": "Bio text",
        "isFollowing": true,
        "followedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pageSize": 20,
      "totalPages": 3
    }
  }
}
```

### 5.4 动态模块 API

#### 5.4.1 获取推荐动态流

```http
GET /posts/feeds?page=1&pageSize=20
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "username": "johndoe",
          "nickname": "John Doe",
          "avatar": "https://..."
        },
        "type": "image",
        "content": "Post content",
        "images": ["https://...", "https://..."],
        "topics": [
          {
            "id": "uuid",
            "name": "Technology"
          }
        ],
        "location": {
          "name": "Beijing, China",
          "latitude": 39.9042,
          "longitude": 116.4074
        },
        "likeCount": 100,
        "commentCount": 20,
        "shareCount": 5,
        "isLiked": false,
        "isFavorited": false,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20
    }
  }
}
```

#### 5.4.2 创建动态

```http
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "type": "image",  // text, image, video
  "content": "Post content",
  "images": ["https://...", "https://..."],
  "topicIds": ["uuid1", "uuid2"],
  "visibility": "public",  // public, friends, private
  "location": {
    "name": "Beijing, China",
    "latitude": 39.9042,
    "longitude": 116.4074
  }
}

Response:
{
  "code": 201,
  "data": {
    "id": "uuid",
    "type": "image",
    "content": "Post content",
    // ... 完整动态信息
  }
}
```

#### 5.4.3 点赞动态

```http
POST /posts/:postId/like
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Liked successfully"
}
```

#### 5.4.4 获取评论列表

```http
GET /posts/:postId/comments?page=1&pageSize=20
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "nickname": "User One",
          "avatar": "https://..."
        },
        "content": "Comment text",
        "likeCount": 10,
        "isLiked": false,
        "replies": [
          {
            "id": "uuid",
            "user": {...},
            "replyToUser": {...},
            "content": "Reply text",
            "createdAt": "2024-01-01T00:00:00Z"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### 5.4.5 创建评论

```http
POST /comments
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "postId": "uuid",
  "content": "Comment text",
  "parentId": "uuid",  // 可选，回复评论时提供
  "replyToUserId": "uuid"  // 可选，回复评论时提供
}

Response:
{
  "code": 201,
  "data": {
    "id": "uuid",
    "postId": "uuid",
    "content": "Comment text",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.5 消息模块 API

#### 5.5.1 获取会话列表

```http
GET /api/conversations?page=1&pageSize=20
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "uuid",
        "type": "private",  // private, group
        "name": "Group Name",  // 群聊才有
        "avatar": "https://...",
        "otherUser": {  // 私聊时对方用户信息
          "id": "uuid",
          "nickname": "User Name",
          "avatar": "https://..."
        },
        "lastMessage": {
          "id": "uuid",
          "content": "Last message",
          "type": "text",
          "createdAt": "2024-01-01T00:00:00Z"
        },
        "unreadCount": 3,
        "isPinned": false,
        "isMuted": false,
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### 5.5.2 获取消息列表

```http
GET /api/conversations/:conversationId/messages?page=1&pageSize=50
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "messageId",
        "conversationId": "uuid",
        "sender": {
          "id": "uuid",
          "nickname": "Sender Name",
          "avatar": "https://..."
        },
        "type": "text",  // text, image, video, audio, file, location
        "content": "Message content",
        "imageUrl": "https://...",
        "status": "read",  // sending, sent, delivered, read, failed
        "replyTo": {  // 回复的消息
          "id": "messageId",
          "sender": {...},
          "content": "Original message"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### 5.5.3 发送消息

```http
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "conversationId": "uuid",
  "type": "text",  // text, image, video, audio, file, location
  "content": "Message content",
  "imageUrl": "https://...",
  "replyToId": "messageId"  // 可选
}

Response:
{
  "code": 201,
  "data": {
    "id": "messageId",
    "conversationId": "uuid",
    "type": "text",
    "content": "Message content",
    "status": "sent",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 5.5.4 标记已读

```http
PUT /api/conversations/:conversationId/read
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Marked as read"
}
```

#### 5.5.5 创建会话

```http
POST /api/conversations
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "type": "private",  // private, group
  "memberIds": ["uuid1", "uuid2"],  // 群聊时多个成员
  "name": "Group Name"  // 群聊时提供
}

Response:
{
  "code": 201,
  "data": {
    "id": "uuid",
    "type": "private",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.6 好友模块 API

#### 5.6.1 获取好友列表

```http
GET /api/contacts/friends?group=&page=1&pageSize=50
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "friendshipId",
        "user": {
          "id": "uuid",
          "username": "johndoe",
          "nickname": "John Doe",
          "avatar": "https://...",
          "bio": "Bio text"
        },
        "remark": "My friend",  // 好友备注
        "group": "Colleagues",  // 分组
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### 5.6.2 发送好友申请

```http
POST /api/contacts/requests
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "userId": "uuid",
  "message": "Hello, let's be friends!"
}

Response:
{
  "code": 201,
  "data": {
    "id": "requestId",
    "status": "pending"
  }
}
```

#### 5.6.3 处理好友申请

```http
PUT /api/contacts/requests/:requestId
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "action": "accept"  // accept, reject
}

Response:
{
  "code": 200,
  "message": "Friend request accepted"
}
```

#### 5.6.4 删除好友

```http
DELETE /api/contacts/friends/:friendshipId
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Friend deleted"
}
```

### 5.7 话题模块 API

#### 5.7.1 获取话题列表

```http
GET /api/topics?page=1&pageSize=20&sort=hot
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "uuid",
        "name": "Technology",
        "description": "Tech topics",
        "coverImage": "https://...",
        "postsCount": 1000,
        "followersCount": 500,
        "isFollowing": false,
        "isHot": true
      }
    ],
    "pagination": {...}
  }
}
```

#### 5.7.2 关注话题

```http
POST /api/topics/:topicId/follow
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Topic followed"
}
```

### 5.8 通知模块 API

#### 5.8.1 获取通知列表

```http
GET /api/notifications?type=&page=1&pageSize=20
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "uuid",
        "type": "like",  // message, friend_request, like, comment, system
        "title": "New like",
        "content": "John Doe liked your post",
        "data": {
          "postId": "uuid",
          "userId": "uuid"
        },
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...},
    "unreadCount": 10
  }
}
```

#### 5.8.2 标记通知已读

```http
PUT /api/notifications/:notificationId/read
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "Notification marked as read"
}
```

### 5.9 文件上传 API

#### 5.9.1 上传图片

```http
POST /api/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "file": File
}

Response:
{
  "code": 200,
  "data": {
    "url": "https://cdn.example.com/images/uuid.jpg",
    "width": 1920,
    "height": 1080,
    "size": 1024000
  }
}
```

#### 5.9.2 上传视频

```http
POST /api/upload/video
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "file": File
}

Response:
{
  "code": 200,
  "data": {
    "url": "https://cdn.example.com/videos/uuid.mp4",
    "duration": 60,
    "size": 10240000,
    "thumbnail": "https://cdn.example.com/thumbs/uuid.jpg"
  }
}
```

### 5.10 搜索模块 API

#### 5.10.1 全局搜索

```http
GET /api/search?keyword=hello&type=all&page=1&pageSize=20
Authorization: Bearer {token}

Parameters:
- keyword: 搜索关键词
- type: user / post / topic / all
- page, pageSize: 分页参数

Response:
{
  "code": 200,
  "data": {
    "users": [...],
    "posts": [...],
    "topics": [...],
    "pagination": {...}
  }
}
```

---

## 6. WebSocket 实时通信

### 6.1 连接建立

```javascript
// 客户端连接
const socket = io('wss://api.example.com', {
  auth: {
    token: 'jwt_token'
  },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

### 6.2 事件规范

#### 6.2.1 客户端 → 服务器事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `message:send` | `{ conversationId, type, content }` | 发送消息 |
| `message:typing` | `{ conversationId }` | 正在输入 |
| `message:read` | `{ conversationId, messageId }` | 标记已读 |
| `online:heartbeat` | `{}` | 心跳包 |

#### 6.2.2 服务器 → 客户端事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `message:new` | `{ message }` | 新消息 |
| `message:status` | `{ messageId, status }` | 消息状态更新 |
| `message:typing` | `{ conversationId, user }` | 对方正在输入 |
| `conversation:update` | `{ conversation }` | 会话更新 |
| `notification:new` | `{ notification }` | 新通知 |
| `user:online` | `{ userId }` | 用户上线 |
| `user:offline` | `{ userId }` | 用户离线 |

### 6.3 消息发送示例

```javascript
// 客户端发送消息
socket.emit('message:send', {
  conversationId: 'uuid',
  type: 'text',
  content: 'Hello!'
}, (response) => {
  if (response.success) {
    console.log('Message sent:', response.message);
  }
});

// 接收新消息
socket.on('message:new', (data) => {
  console.log('New message:', data.message);
  // 更新 UI
});

// 接收消息状态更新
socket.on('message:status', (data) => {
  console.log('Message status:', data.messageId, data.status);
  // 更新消息状态（已送达、已读等）
});
```

### 6.4 在线状态管理

```javascript
// 心跳包保持在线
setInterval(() => {
  socket.emit('online:heartbeat');
}, 30000);  // 每30秒

// 监听用户在线状态
socket.on('user:online', (data) => {
  console.log('User online:', data.userId);
});

socket.on('user:offline', (data) => {
  console.log('User offline:', data.userId);
});
```

### 6.5 WebSocket 服务器实现（Node.js + Socket.IO）

```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 认证中间件
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = await verifyToken(token);
    socket.userId = user.id;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  // 用户上线
  redis.set(`online:${socket.userId}`, socket.id, 'EX', 1800);
  socket.broadcast.emit('user:online', { userId: socket.userId });

  // 加入用户房间
  socket.join(`user:${socket.userId}`);

  // 发送消息
  socket.on('message:send', async (data, callback) => {
    try {
      // 保存消息到数据库
      const message = await saveMessage(data);

      // 发送给接收者
      const conversation = await getConversation(data.conversationId);
      conversation.members.forEach(memberId => {
        if (memberId !== socket.userId) {
          io.to(`user:${memberId}`).emit('message:new', { message });
        }
      });

      // 回调确认
      callback({ success: true, message });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // 正在输入
  socket.on('message:typing', (data) => {
    socket.to(`conversation:${data.conversationId}`).emit('message:typing', {
      conversationId: data.conversationId,
      user: { id: socket.userId }
    });
  });

  // 心跳包
  socket.on('online:heartbeat', () => {
    redis.expire(`online:${socket.userId}`, 1800);
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
    redis.del(`online:${socket.userId}`);
    socket.broadcast.emit('user:offline', { userId: socket.userId });
  });
});
```

---

## 7. 安全与认证

### 7.1 JWT 认证

#### 7.1.1 Token 结构

**Access Token** (15分钟有效期):
```json
{
  "userId": "uuid",
  "username": "johndoe",
  "type": "access",
  "iat": 1704067200,
  "exp": 1704068100
}
```

**Refresh Token** (7天有效期):
```json
{
  "userId": "uuid",
  "type": "refresh",
  "iat": 1704067200,
  "exp": 1704672000
}
```

#### 7.1.2 Token 刷新流程

```
Client                    Server
  |                         |
  |-- Access Token -------->|
  |<-- 401 Unauthorized ----|
  |                         |
  |-- Refresh Token ------->|
  |<-- New Access Token ----|
  |<-- New Refresh Token ---|
  |                         |
  |-- Request with New ---->|
  |    Access Token         |
  |<-- Response ------------|
```

### 7.2 密码安全

```javascript
// 密码哈希（bcrypt）
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 注册时哈希密码
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// 登录时验证密码
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 7.3 安全措施

#### 7.3.1 请求限流

```javascript
// 使用 rate-limiter-flexible
const { RateLimiterRedis } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit',
  points: 10,  // 请求次数
  duration: 1,  // 1秒
});

// 中间件
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (err) {
    res.status(429).json({
      code: 429,
      message: 'Too many requests'
    });
  }
});
```

#### 7.3.2 XSS 防护

- 使用 `helmet` 中间件
- Content-Security-Policy 头部
- 输入验证和清理

```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### 7.3.3 CSRF 防护

- 使用 CSRF Token
- SameSite Cookie 设置

#### 7.3.4 SQL 注入防护

- 使用参数化查询
- ORM/查询构建器
- 输入验证

### 7.4 敏感数据处理

```javascript
// 返回用户数据时移除敏感字段
function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}
```

---

## 8. 部署指南

### 8.1 环境要求

```yaml
服务器:
  - CPU: 4核以上
  - 内存: 8GB以上
  - 存储: 100GB以上 SSD

软件环境:
  - Node.js: 18.x LTS
  - PostgreSQL: 14.x
  - MongoDB: 6.x
  - Redis: 7.x
  - Nginx: 1.24.x
```

### 8.2 环境变量配置

创建 `.env` 文件:

```env
# 应用配置
NODE_ENV=production
PORT=3000
APP_NAME=Social Chat App
APP_URL=https://api.example.com

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/social_chat
MONGODB_URI=mongodb://localhost:27017/social_chat
REDIS_URL=redis://localhost:6379

# JWT 密钥
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# 文件存储
UPLOAD_DIR=/var/www/uploads
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp
ALLOWED_VIDEO_TYPES=mp4,mov,avi

# OSS 配置（可选）
OSS_REGION=cn-beijing
OSS_ACCESS_KEY_ID=your-access-key
OSS_ACCESS_KEY_SECRET=your-secret-key
OSS_BUCKET=social-chat

# 邮件配置
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=your-password
SMTP_FROM=Social Chat <noreply@example.com>

# 短信配置
SMS_PROVIDER=aliyun
SMS_ACCESS_KEY=your-key
SMS_SECRET_KEY=your-secret
SMS_SIGN_NAME=社交聊天
SMS_TEMPLATE_CODE=SMS_123456

# 日志配置
LOG_LEVEL=info
LOG_DIR=/var/log/social-chat
```

### 8.3 Docker 部署

#### 8.3.1 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建（如果需要）
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 8.3.2 docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/social_chat
      - MONGODB_URI=mongodb://mongodb:27017/social_chat
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - mongodb
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=social_chat
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  mongodb:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
```

### 8.4 Nginx 配置

```nginx
upstream api_backend {
    server api:3000;
}

server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # 文件上传大小限制
    client_max_body_size 50M;

    # API 请求
    location /v1/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    # 静态文件
    location /uploads/ {
        alias /var/www/uploads/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 8.5 PM2 进程管理

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'social-chat-api',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
};
```

```bash
# 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启
pm2 restart social-chat-api

# 停止
pm2 stop social-chat-api
```

### 8.6 数据库迁移

```bash
# 初始化数据库
npm run db:migrate

# 创建新迁移
npm run db:migrate:create -- add_user_table

# 回滚
npm run db:migrate:rollback

# 查看状态
npm run db:migrate:status
```

### 8.7 监控与日志

#### 8.7.1 健康检查端点

```javascript
// GET /health
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      mongodb: await checkMongoDB()
    }
  };

  const status = Object.values(health.services).every(s => s.status === 'ok')
    ? 200
    : 503;

  res.status(status).json(health);
});
```

#### 8.7.2 日志配置

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 8.8 性能优化建议

1. **数据库优化**
   - 添加适当的索引
   - 使用连接池
   - 查询优化和分页
   - 读写分离

2. **缓存策略**
   - Redis 缓存热点数据
   - CDN 加速静态资源
   - HTTP 缓存头

3. **负载均衡**
   - Nginx 负载均衡
   - 多实例部署
   - 会话共享（Redis）

4. **消息队列**
   - 异步任务处理
   - 削峰填谷
   - 解耦服务

---

## 附录

### A. 错误码表

| 错误码 | 说明 |
|--------|------|
| 10001 | 用户名已存在 |
| 10002 | 邮箱已存在 |
| 10003 | 手机号已存在 |
| 10004 | 用户不存在 |
| 10005 | 密码错误 |
| 10006 | 验证码错误 |
| 10007 | 验证码已过期 |
| 20001 | Token 无效 |
| 20002 | Token 已过期 |
| 20003 | 无权限 |
| 30001 | 动态不存在 |
| 30002 | 评论不存在 |
| 40001 | 会话不存在 |
| 40002 | 消息发送失败 |
| 50001 | 文件上传失败 |
| 50002 | 文件格式不支持 |
| 50003 | 文件大小超限 |

### B. 开发工具推荐

- **API 测试**: Postman / Insomnia
- **数据库管理**: DBeaver / TablePlus
- **Redis 管理**: RedisInsight
- **日志查看**: Kibana / Grafana
- **性能监控**: New Relic / Datadog
- **API 文档**: Swagger UI / Redoc

### C. 参考资源

- [Socket.IO Documentation](https://socket.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [JWT Best Practices](https://jwt.io/introduction)

---

**文档版本**: v1.0.0
**最后更新**: 2024-01-01
**维护者**: Backend Team
