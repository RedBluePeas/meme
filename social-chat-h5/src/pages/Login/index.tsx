/**
 * Login Page - 登录页面
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@heroui/react';
import { useAuth } from '@/hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  /**
   * 表单验证
   */
  const validate = (): boolean => {
    const newErrors = {
      username: '',
      password: '',
    };

    // 验证用户名/邮箱/手机号
    if (!form.username.trim()) {
      newErrors.username = '请输入用户名、邮箱或手机号';
    } else if (form.username.trim().length < 3) {
      newErrors.username = '输入内容过短';
    }

    // 验证密码
    if (!form.password) {
      newErrors.password = '请输入密码';
    } else if (form.password.length < 6) {
      newErrors.password = '密码长度不能少于 6 位';
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // 调用真实 API 登录
    await login({
      identifier: form.username.trim(), // 可以是用户名、邮箱或手机号
      password: form.password,
    });
    // 登录成功会在 useAuth hook 中跳转到 /home
  };

  /**
   * 处理输入变化
   */
  const handleChange = (field: 'username' | 'password', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 区域 */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full p-4 shadow-lg mb-4">
            <div className="text-4xl">💬</div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">社交聊天</h1>
          <p className="text-white/80">连接你我，分享生活</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            欢迎回来
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名/邮箱/手机号输入 */}
            <Input
              type="text"
              label="账号"
              placeholder="用户名 / 邮箱 / 手机号"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              isInvalid={!!errors.username}
              errorMessage={errors.username}
              size="lg"
              variant="bordered"
            />

            {/* 密码输入 */}
            <Input
              type="password"
              label="密码"
              placeholder="请输入密码"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              size="lg"
              variant="bordered"
            />

            {/* 忘记密码链接 */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                忘记密码？
              </Link>
            </div>

            {/* 登录按钮 */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              登录
            </Button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center text-sm text-gray-600">
            还没有账号？
            <Link
              to="/register"
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              立即注册
            </Link>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>登录即表示同意我们的</p>
          <div className="mt-1">
            <Link to="/terms" className="hover:text-white">
              服务条款
            </Link>
            <span className="mx-2">·</span>
            <Link to="/privacy" className="hover:text-white">
              隐私政策
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
