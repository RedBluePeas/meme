# API 测试集合文档

## Postman Collection 配置

### 全局变量设置

```json
{
  "baseUrl": "https://api.example.com/v1",
  "wsUrl": "wss://api.example.com",
  "token": "",
  "refreshToken": "",
  "userId": "",
  "conversationId": "",
  "postId": ""
}
```

---

## 1. 认证模块测试

### 1.1 用户注册

```http
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "username": "testuser{{$randomInt}}",
  "email": "test{{$randomInt}}@example.com",
  "password": "Test123456!",
  "code": "123456"
}

// 测试脚本
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('token');
    pm.environment.set("token", jsonData.data.token);
    pm.environment.set("userId", jsonData.data.user.id);
});
```

### 1.2 用户登录

```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123456!"
}

// 测试脚本
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
    pm.environment.set("userId", jsonData.data.user.id);
});
```

### 1.3 刷新 Token

```http
POST {{baseUrl}}/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}

// 测试脚本
pm.test("Token refreshed", function () {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
});
```

---

## 2. 用户模块测试

### 2.1 获取当前用户信息

```http
GET {{baseUrl}}/auth/me
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get current user", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data).to.have.property('username');
});
```

### 2.2 更新个人资料

```http
PUT {{baseUrl}}/users/me
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nickname": "Updated Nickname",
  "bio": "This is my bio",
  "gender": "male",
  "location": "Beijing"
}

// 测试脚本
pm.test("Profile updated", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.nickname).to.eql("Updated Nickname");
});
```

### 2.3 关注用户

```http
POST {{baseUrl}}/users/{{targetUserId}}/follow
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Follow user successful", function () {
    pm.response.to.have.status(200);
});
```

---

## 3. 动态模块测试

### 3.1 创建文本动态

```http
POST {{baseUrl}}/posts
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "type": "text",
  "content": "This is a test post created at {{$timestamp}}",
  "visibility": "public"
}

// 测试脚本
pm.test("Post created", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.environment.set("postId", jsonData.data.id);
});
```

### 3.2 创建图片动态

```http
POST {{baseUrl}}/posts
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "type": "image",
  "content": "Check out these photos!",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "visibility": "public"
}
```

### 3.3 获取动态流

```http
GET {{baseUrl}}/posts/feeds?page=1&pageSize=20
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get feeds", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
    pm.expect(jsonData.data.pagination).to.have.property('total');
});
```

### 3.4 点赞动态

```http
POST {{baseUrl}}/posts/{{postId}}/like
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Like post successful", function () {
    pm.response.to.have.status(200);
});
```

### 3.5 取消点赞

```http
DELETE {{baseUrl}}/posts/{{postId}}/like
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Unlike post successful", function () {
    pm.response.to.have.status(200);
});
```

### 3.6 创建评论

```http
POST {{baseUrl}}/comments
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "postId": "{{postId}}",
  "content": "This is a test comment"
}

// 测试脚本
pm.test("Comment created", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
});
```

### 3.7 获取评论列表

```http
GET {{baseUrl}}/posts/{{postId}}/comments?page=1&pageSize=20
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get comments", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
});
```

---

## 4. 消息模块测试

### 4.1 创建会话

```http
POST {{baseUrl}}/api/conversations
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "type": "private",
  "memberIds": ["{{targetUserId}}"]
}

// 测试脚本
pm.test("Conversation created", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.environment.set("conversationId", jsonData.data.id);
});
```

### 4.2 获取会话列表

```http
GET {{baseUrl}}/api/conversations?page=1&pageSize=20
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get conversations", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
});
```

### 4.3 发送文本消息

```http
POST {{baseUrl}}/api/messages
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "conversationId": "{{conversationId}}",
  "type": "text",
  "content": "Hello! This is a test message at {{$timestamp}}"
}

// 测试脚本
pm.test("Message sent", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
});
```

### 4.4 获取消息列表

```http
GET {{baseUrl}}/api/conversations/{{conversationId}}/messages?page=1&pageSize=50
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get messages", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
});
```

### 4.5 标记消息已读

```http
PUT {{baseUrl}}/api/conversations/{{conversationId}}/read
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Marked as read", function () {
    pm.response.to.have.status(200);
});
```

---

## 5. 好友模块测试

### 5.1 发送好友申请

```http
POST {{baseUrl}}/api/contacts/requests
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "userId": "{{targetUserId}}",
  "message": "Hi, let's be friends!"
}

// 测试脚本
pm.test("Friend request sent", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.environment.set("friendRequestId", jsonData.data.id);
});
```

### 5.2 获取好友申请列表

```http
GET {{baseUrl}}/api/contacts/requests?status=pending&page=1&pageSize=20
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get friend requests", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
});
```

### 5.3 接受好友申请

```http
PUT {{baseUrl}}/api/contacts/requests/{{friendRequestId}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "action": "accept"
}

// 测试脚本
pm.test("Friend request accepted", function () {
    pm.response.to.have.status(200);
});
```

### 5.4 获取好友列表

```http
GET {{baseUrl}}/api/contacts/friends?page=1&pageSize=50
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get friends list", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
});
```

---

## 6. 文件上传测试

### 6.1 上传图片

```http
POST {{baseUrl}}/api/upload/image
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

file: [binary file]

// 测试脚本
pm.test("Image uploaded", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('url');
    pm.environment.set("uploadedImageUrl", jsonData.data.url);
});
```

### 6.2 上传头像

```http
POST {{baseUrl}}/users/me/avatar
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

avatar: [binary file]

// 测试脚本
pm.test("Avatar uploaded", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('url');
});
```

---

## 7. 搜索模块测试

### 7.1 全局搜索

```http
GET {{baseUrl}}/api/search?keyword=test&type=all&page=1&pageSize=20
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Search successful", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('object');
});
```

### 7.2 搜索用户

```http
GET {{baseUrl}}/users/search?keyword=john&page=1&pageSize=20
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Search users", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
});
```

---

## 8. 通知模块测试

### 8.1 获取通知列表

```http
GET {{baseUrl}}/api/notifications?page=1&pageSize=20
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Get notifications", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.be.an('array');
    pm.expect(jsonData.data).to.have.property('unreadCount');
});
```

### 8.2 标记通知已读

```http
PUT {{baseUrl}}/api/notifications/{{notificationId}}/read
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Notification marked as read", function () {
    pm.response.to.have.status(200);
});
```

---

## 9. 错误场景测试

### 9.1 未授权访问

```http
GET {{baseUrl}}/auth/me

// 测试脚本
pm.test("Unauthorized access", function () {
    pm.response.to.have.status(401);
});
```

### 9.2 无效 Token

```http
GET {{baseUrl}}/auth/me
Authorization: Bearer invalid_token

// 测试脚本
pm.test("Invalid token", function () {
    pm.response.to.have.status(401);
});
```

### 9.3 资源不存在

```http
GET {{baseUrl}}/posts/non-existent-id
Authorization: Bearer {{token}}

// 测试脚本
pm.test("Resource not found", function () {
    pm.response.to.have.status(404);
});
```

### 9.4 参数验证错误

```http
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "username": "",
  "email": "invalid-email",
  "password": "123"
}

// 测试脚本
pm.test("Validation error", function () {
    pm.response.to.have.status(400);
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('errors');
});
```

---

## 10. 性能测试场景

### 10.1 并发用户登录

```javascript
// 使用 k6 进行压力测试
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const payload = JSON.stringify({
    username: `user${__VU}`,
    password: 'Test123456!',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('https://api.example.com/v1/auth/login', payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### 10.2 消息发送压测

```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 50,
  duration: '2m',
};

export default function () {
  const token = 'your_test_token';
  const payload = JSON.stringify({
    conversationId: 'test-conversation-id',
    type: 'text',
    content: `Test message ${Date.now()}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.post('https://api.example.com/v1/api/messages', payload, params);

  check(res, {
    'message sent': (r) => r.status === 201,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
}
```

---

## 11. 自动化测试流程

### 完整测试流程

```javascript
// Newman 运行脚本
const newman = require('newman');

newman.run({
    collection: require('./social-chat-api-collection.json'),
    environment: require('./environment.json'),
    reporters: ['cli', 'html'],
    reporter: {
        html: {
            export: './test-results.html'
        }
    }
}, function (err) {
    if (err) { throw err; }
    console.log('collection run complete!');
});
```

### CI/CD 集成

```yaml
# .github/workflows/api-test.yml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install Newman
        run: npm install -g newman

      - name: Run API Tests
        run: newman run social-chat-api-collection.json -e environment.json

      - name: Upload Results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-results.html
```

---

## 12. 测试数据管理

### 测试用户账号

```json
{
  "testUsers": [
    {
      "username": "test_user_1",
      "email": "test1@example.com",
      "password": "Test123456!",
      "role": "user"
    },
    {
      "username": "test_user_2",
      "email": "test2@example.com",
      "password": "Test123456!",
      "role": "user"
    },
    {
      "username": "test_admin",
      "email": "admin@example.com",
      "password": "Admin123456!",
      "role": "admin"
    }
  ]
}
```

### 清理测试数据

```http
DELETE {{baseUrl}}/test/cleanup
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "tables": ["posts", "comments", "messages"],
  "testUsersOnly": true
}
```

---

## 附录

### A. Postman Collection 导出格式

```json
{
  "info": {
    "name": "Social Chat API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [...]
    },
    {
      "name": "Users",
      "item": [...]
    }
  ]
}
```

### B. 测试覆盖率目标

- API 接口覆盖率: ≥ 95%
- 成功场景测试: 100%
- 错误场景测试: ≥ 80%
- 边界条件测试: ≥ 70%

### C. 性能指标

- 平均响应时间: < 200ms
- P95 响应时间: < 500ms
- P99 响应时间: < 1000ms
- 错误率: < 0.1%
- 并发支持: ≥ 1000 RPS

---

**文档版本**: v1.0.0
**最后更新**: 2024-01-01
**维护者**: QA Team
