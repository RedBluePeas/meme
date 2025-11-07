# 测试文档

## 测试结构

```
tests/
├── setup.ts              # 测试环境设置
├── unit/                 # 单元测试
│   └── cache.test.ts     # 缓存服务测试
└── integration/          # 集成测试
    └── auth.test.ts      # 认证 API 测试
```

## 运行测试

### 运行所有测试
```bash
npm test
```

### 运行测试并监听变化
```bash
npm run test:watch
```

### 运行测试并生成覆盖率报告
```bash
npm run test:coverage
```

## 测试类型

### 单元测试
单元测试专注于测试单个函数或类的行为，不依赖外部服务。

示例：
- `tests/unit/cache.test.ts` - 测试缓存服务的各个方法

### 集成测试
集成测试测试多个组件的协作，包括 API 端点测试。

示例：
- `tests/integration/auth.test.ts` - 测试认证 API 端点

## 编写测试

### 单元测试示例

```typescript
import { CacheService } from '../../src/utils/cache';

describe('CacheService', () => {
  it('should get cached data', async () => {
    const data = await CacheService.get('test-key');
    expect(data).toBeDefined();
  });
});
```

### 集成测试示例

```typescript
import request from 'supertest';
import app from '../../src/app';

describe('POST /api/auth/login', () => {
  it('should login successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'testuser',
        password: 'Test123456!',
      })
      .expect(200);

    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

## Mock 策略

### Mock 数据库
```typescript
jest.mock('../../src/config/db', () => ({
  db: jest.fn(),
  redisClient: {
    get: jest.fn(),
    setEx: jest.fn(),
  },
}));
```

### Mock 外部服务
```typescript
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));
```

## 测试覆盖率目标

- 语句覆盖率: > 80%
- 分支覆盖率: > 75%
- 函数覆盖率: > 80%
- 行覆盖率: > 80%

## 注意事项

1. 每个测试应该是独立的，不依赖其他测试的状态
2. 使用 `beforeEach` 和 `afterEach` 清理测试数据
3. Mock 所有外部依赖（数据库、Redis、第三方 API）
4. 测试应该快速运行（< 100ms per test）
5. 使用描述性的测试名称

## 持续集成

测试会在以下情况下自动运行：
- 提交代码时（pre-commit hook）
- 推送到远程仓库时（CI/CD pipeline）
- Pull Request 时

## 调试测试

### 运行单个测试文件
```bash
npm test -- tests/unit/cache.test.ts
```

### 运行匹配特定名称的测试
```bash
npm test -- -t "should get cached data"
```

### 启用调试模式
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```
