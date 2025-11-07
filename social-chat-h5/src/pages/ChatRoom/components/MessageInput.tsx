/**
 * MessageInput - 消息输入框
 * 支持文本、图片、语音、表情等输入
 */

import React, { useState, useRef } from 'react';
import { Button, Textarea } from '@heroui/react';
import { PaperAirplaneIcon, PhotoIcon, FaceSmileIcon, PlusIcon, CameraIcon, MicrophoneIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { SendMessageParams } from '@/types/models';

interface MessageInputProps {
  conversationId: string;
  sending?: boolean;
  onSend?: (params: SendMessageParams) => void;
  onImageSelect?: (files: File[]) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  sending = false,
  onSend,
  onImageSelect,
}) => {
  const [content, setContent] = useState('');
  const [showTools, setShowTools] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 发送文本消息
   */
  const handleSend = () => {
    const text = content.trim();
    if (!text || sending) return;

    onSend?.({
      conversationId,
      type: 'text',
      content: text,
    });

    setContent('');
  };

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 回车发送（Shift+回车换行）
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * 选择图片
   */
  const handleImageClick = () => {
    inputRef.current?.click();
  };

  /**
   * 处理图片选择
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    onImageSelect?.(fileArray);

    // 清空 input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  /**
   * 切换工具栏
   */
  const handleToggleTools = () => {
    setShowTools(!showTools);
  };

  return (
    <div className="bg-white border-t border-gray-200">
      {/* 输入区域 */}
      <div className="flex items-end gap-2 p-3">
        {/* 更多按钮 */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onClick={handleToggleTools}
        >
          <PlusIcon className="w-5 h-5" />
        </Button>

        {/* 文本输入框 */}
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            minRows={1}
            maxRows={4}
            classNames={{
              input: 'text-sm',
            }}
          />
        </div>

        {/* 发送按钮 */}
        {content.trim() ? (
          <Button
            isIconOnly
            color="primary"
            size="sm"
            onClick={handleSend}
            isLoading={sending}
          >
            <PaperAirplaneIcon className="w-[18px] h-[18px]" />
          </Button>
        ) : (
          <>
            {/* 表情按钮 */}
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={() => {
                // TODO: 打开表情选择器
              }}
            >
              <FaceSmileIcon className="w-5 h-5" />
            </Button>

            {/* 图片按钮 */}
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={handleImageClick}
            >
              <PhotoIcon className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* 工具栏 */}
      {showTools && (
        <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100">
          <button
            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={handleImageClick}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <PhotoIcon className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs text-gray-600">相册</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CameraIcon className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs text-gray-600">拍照</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <MicrophoneIcon className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-xs text-gray-600">语音</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DocumentIcon className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-xs text-gray-600">文件</span>
          </button>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};
