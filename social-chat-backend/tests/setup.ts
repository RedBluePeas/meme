import dotenv from 'dotenv';

// 加载测试环境变量
dotenv.config({ path: '.env.test' });

// 设置测试超时时间
jest.setTimeout(10000);

// Mock logger to avoid console output during tests
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// 全局测试清理
afterAll(async () => {
  // 关闭所有数据库连接
  // 这里可以添加数据库连接清理逻辑
});
