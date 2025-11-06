/**
 * ImageUpload - 图片上传组件
 * 支持多图上传、预览、删除
 */

import React, { useRef } from 'react';
import { Button, Image, Progress } from '@nextui-org/react';
import { X, Plus } from 'lucide-react';
import { SSDialog } from '../SSDialog';

interface ImageUploadProps {
  value?: string[];
  onChange?: (images: string[]) => void;
  maxCount?: number;
  maxSize?: number; // MB
  onUpload?: (files: File[]) => Promise<string[]>;
  uploading?: boolean;
  uploadProgress?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxCount = 9,
  maxSize = 10,
  onUpload,
  uploading = false,
  uploadProgress = 0,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 验证文件
   */
  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        SSDialog.toast.error(`${file.name} 不是图片文件`);
        continue;
      }

      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        SSDialog.toast.error(`${file.name} 超过 ${maxSize}MB`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  /**
   * 处理文件选择
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 检查数量限制
    if (value.length + files.length > maxCount) {
      SSDialog.toast.error(`最多只能上传 ${maxCount} 张图片`);
      return;
    }

    // 验证文件
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    // 上传文件
    if (onUpload) {
      try {
        const urls = await onUpload(validFiles);
        onChange?.([...value, ...urls]);
      } catch (error) {
        SSDialog.toast.error('上传失败');
      }
    } else {
      // 如果没有上传函数，使用本地预览
      const urls = await Promise.all(
        validFiles.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );
      onChange?.([...value, ...urls]);
    }

    // 清空 input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  /**
   * 删除图片
   */
  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange?.(newImages);
  };

  /**
   * 点击上传按钮
   */
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* 图片网格 */}
      <div className="grid grid-cols-3 gap-2">
        {/* 已上传的图片 */}
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={url}
              alt={`image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* 删除按钮 */}
            <button
              className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition-colors"
              onClick={() => handleRemove(index)}
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* 上传按钮 */}
        {value.length < maxCount && !uploading && (
          <button
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            onClick={handleClick}
          >
            <div className="text-center">
              <Plus className="mx-auto text-gray-400" size={32} />
              <span className="text-xs text-gray-500 mt-1">
                {value.length}/{maxCount}
              </span>
            </div>
          </button>
        )}

        {/* 上传中 */}
        {uploading && (
          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="w-full p-4">
              <Progress
                value={uploadProgress}
                size="sm"
                color="primary"
                showValueLabel
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                上传中...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 提示信息 */}
      <p className="text-xs text-gray-500 mt-2">
        最多上传 {maxCount} 张图片，每张不超过 {maxSize}MB
      </p>
    </div>
  );
};
