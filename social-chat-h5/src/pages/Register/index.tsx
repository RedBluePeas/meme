/**
 * Register Page - 注册页面
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@nextui-org/react';
import { useAuth } from '@/hooks/useAuth';
import { SSValidateUtil } from '@/utils';
import { SSDialog } from '@/components/SSDialog';

const RegisterPage: React.FC = () => {
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  /**
   * 表单验证
   */
  const validate = (): boolean => {
    const newErrors = {
      username: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      email: '',
    };

    // 验证用户名
    if (!form.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (form.username.length < 3 || form.username.length > 20) {
      newErrors.username = '用户名长度为 3-20 个字符';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }

    // 验证昵称
    if (!form.nickname.trim()) {
      newErrors.nickname = '请输入昵称';
    } else if (form.nickname.length < 2 || form.nickname.length > 20) {
      newErrors.nickname = '昵称长度为 2-20 个字符';
    }

    // 验证密码
    if (!form.password) {
      newErrors.password = '请输入密码';
    } else if (form.password.length < 6) {
      newErrors.password = '密码长度不能少于 6 位';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = '密码必须包含字母和数字';
    }

    // 验证确认密码
    if (!form.confirmPassword) {
      newErrors.confirmPassword = '请再次输入密码';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 验证邮箱（可选）
    if (form.email && !SSValidateUtil.isEmail(form.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    setErrors(newErrors);
    return (
      !newErrors.username &&
      !newErrors.nickname &&
      !newErrors.password &&
      !newErrors.confirmPassword &&
      !newErrors.email
    );
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const success = await register({
      username: form.username.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
      email: form.email.trim() || undefined,
    });

    if (success) {
      // 注册成功会在 useAuth 中跳转
    }
  };

  /**
   * 处理输入变化
   */
  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
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
          <p className="text-white/80">创建账号，开启精彩</p>
        </div>

        {/* 注册表单 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            注册账号
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名输入 */}
            <Input
              type="text"
              label="用户名"
              placeholder="字母、数字或下划线"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              isInvalid={!!errors.username}
              errorMessage={errors.username}
              size="lg"
              variant="bordered"
            />

            {/* 昵称输入 */}
            <Input
              type="text"
              label="昵称"
              placeholder="请输入昵称"
              value={form.nickname}
              onChange={(e) => handleChange('nickname', e.target.value)}
              isInvalid={!!errors.nickname}
              errorMessage={errors.nickname}
              size="lg"
              variant="bordered"
            />

            {/* 密码输入 */}
            <Input
              type="password"
              label="密码"
              placeholder="至少6位，包含字母和数字"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              size="lg"
              variant="bordered"
            />

            {/* 确认密码输入 */}
            <Input
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              size="lg"
              variant="bordered"
            />

            {/* 邮箱输入（可选） */}
            <Input
              type="email"
              label="邮箱（选填）"
              placeholder="用于找回密码"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              size="lg"
              variant="bordered"
            />

            {/* 注册按钮 */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              注册
            </Button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center text-sm text-gray-600">
            已有账号？
            <Link
              to="/login"
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              立即登录
            </Link>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>注册即表示同意我们的</p>
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

export default RegisterPage;
