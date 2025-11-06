/**
 * Publish - 发布
 * 发布动态、图文、视频
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea, Select, SelectItem, Chip } from '@heroui/react';
import { MapPinIcon, HashtagIcon, EyeIcon, EyeSlashIcon, UsersIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { usePublish } from '@/hooks/usePublish';
import { ImageUpload } from '@/components/Upload';
import { SSDialog } from '@/components/SSDialog';

const PublishPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    draft,
    uploading,
    uploadProgress,
    publishing,
    updateContent,
    uploadImages,
    removeImage,
    setVisibility,
    publish,
    reset,
  } = usePublish();

  /**
   * 处理图片上传
   */
  const handleUploadImages = async (files: File[]): Promise<string[]> => {
    // TODO: 这里应该调用实际的上传接口
    // 暂时返回本地预览 URL
    const urls = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    return urls;
  };

  /**
   * 处理发布
   */
  const handlePublish = async () => {
    if (!draft.content.trim() && draft.images.length === 0) {
      SSDialog.toast.error('请输入内容或上传图片');
      return;
    }

    // 确定发布类型
    const type = draft.images.length > 0 ? 'image' : 'text';

    const success = await publish(type);
    if (success) {
      // 发布成功会在 hook 中跳转
    }
  };

  /**
   * 取消发布
   */
  const handleCancel = () => {
    if (draft.content || draft.images.length > 0) {
      SSDialog.confirm({
        title: '确认退出',
        content: '当前内容未发布，确定要退出吗？',
        onConfirm: () => {
          reset();
          navigate(-1);
        },
      });
    } else {
      navigate(-1);
    }
  };

  /**
   * 可见性选项
   */
  const visibilityOptions = [
    { value: 'public', label: '公开', icon: <EyeIcon className="w-[18px] h-[18px]" />, desc: '所有人可见' },
    { value: 'friends', label: '好友可见', icon: <UsersIcon className="w-[18px] h-[18px]" />, desc: '仅好友可见' },
    { value: 'private', label: '私密', icon: <LockClosedIcon className="w-[18px] h-[18px]" />, desc: '仅自己可见' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Button
          size="sm"
          variant="light"
          onClick={handleCancel}
        >
          取消
        </Button>
        <h1 className="text-lg font-semibold">发布动态</h1>
        <Button
          size="sm"
          color="primary"
          onClick={handlePublish}
          isLoading={publishing}
          isDisabled={!draft.content.trim() && draft.images.length === 0}
        >
          发布
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="p-4 space-y-4">
        {/* 文本输入 */}
        <Textarea
          placeholder="分享新鲜事..."
          value={draft.content}
          onChange={(e) => updateContent(e.target.value)}
          minRows={5}
          maxRows={10}
          maxLength={500}
          variant="bordered"
          classNames={{
            input: 'text-base',
          }}
        />

        {/* 字数统计 */}
        <div className="text-right text-sm text-gray-500">
          {draft.content.length}/500
        </div>

        {/* 图片上传 */}
        <div>
          <h3 className="text-sm font-medium mb-2">添加图片</h3>
          <ImageUpload
            value={draft.images}
            onChange={(images) => {
              // 更新图片列表
              draft.images.forEach((_, index) => {
                if (!images.includes(_)) {
                  removeImage(index);
                }
              });
            }}
            maxCount={9}
            maxSize={10}
            onUpload={handleUploadImages}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
        </div>

        {/* 发布设置 */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium">发布设置</h3>

          {/* 谁可以看 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              谁可以看
            </label>
            <Select
              selectedKeys={[draft.visibility]}
              onChange={(e) => setVisibility(e.target.value as any)}
              size="sm"
              variant="bordered"
            >
              {visibilityOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  startContent={option.icon}
                  description={option.desc}
                >
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* 添加话题 */}
          <button
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600"
            onClick={() => {
              // TODO: 打开话题选择弹窗
              SSDialog.toast.info('话题选择功能开发中');
            }}
          >
            <div className="flex items-center gap-2">
              <HashtagIcon className="w-[18px] h-[18px]" />
              <span>添加话题</span>
            </div>
            <span className="text-gray-400">
              {draft.topics.length > 0 ? `已选 ${draft.topics.length} 个` : '选择话题'}
            </span>
          </button>

          {/* 添加位置 */}
          <button
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600"
            onClick={() => {
              // TODO: 打开位置选择
              SSDialog.toast.info('位置选择功能开发中');
            }}
          >
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-[18px] h-[18px]" />
              <span>添加位置</span>
            </div>
            <span className="text-gray-400">
              {draft.location ? draft.location.name : '选择位置'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishPage;
