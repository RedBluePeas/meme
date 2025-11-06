/**
 * Settings - 设置页面
 * 应用相关设置
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/Layout';
import { SSDialog } from '@/components/SSDialog';
import { SSStorageUtil } from '@/utils';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  /**
   * 清理缓存
   */
  const handleClearCache = async () => {
    await SSDialog.confirm({
      title: '清理缓存',
      content: '确定要清理缓存吗？这不会删除你的聊天记录。',
      onConfirm: () => {
        // TODO: 清理缓存逻辑
        SSDialog.toast.success('缓存已清理');
      },
    });
  };

  /**
   * 检查更新
   */
  const handleCheckUpdate = () => {
    SSDialog.toast.info('当前已是最新版本');
  };

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '设置',
        showBack: true,
        onBack: () => navigate(-1),
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* 通用设置 */}
        <div className="bg-white mt-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm text-gray-600">通用设置</h3>
          </div>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            onClick={() => SSDialog.toast.info('功能开发中')}
          >
            <span className="text-gray-900">语言</span>
            <span className="text-sm text-gray-500">简体中文</span>
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100"
            onClick={() => SSDialog.toast.info('功能开发中')}
          >
            <span className="text-gray-900">字体大小</span>
            <span className="text-sm text-gray-500">标准</span>
          </button>
        </div>

        {/* 隐私设置 */}
        <div className="bg-white mt-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm text-gray-600">隐私设置</h3>
          </div>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            onClick={() => SSDialog.toast.info('功能开发中')}
          >
            <span className="text-gray-900">黑名单</span>
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100"
            onClick={() => SSDialog.toast.info('功能开发中')}
          >
            <span className="text-gray-900">添加好友方式</span>
            <span className="text-sm text-gray-500">所有人</span>
          </button>
        </div>

        {/* 其他 */}
        <div className="bg-white mt-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm text-gray-600">其他</h3>
          </div>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            onClick={handleClearCache}
          >
            <span className="text-gray-900">清理缓存</span>
            <span className="text-sm text-gray-500">256 MB</span>
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100"
            onClick={handleCheckUpdate}
          >
            <span className="text-gray-900">检查更新</span>
            <span className="text-sm text-gray-500">v1.0.0</span>
          </button>
        </div>

        {/* 版本信息 */}
        <div className="text-center py-8 text-sm text-gray-400">
          <p>Social Chat H5</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
