/**
 * ProfileHeader - 个人主页头部
 * 显示用户头像、昵称、签名等基本信息
 */

import React from 'react';
import { Avatar, Button } from '@heroui/react';
import { PencilIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { User } from '@/types/models';

interface ProfileHeaderProps {
  user: User;
  onEdit?: () => void;
  onQRCode?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEdit,
  onQRCode,
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="flex items-start gap-4">
        {/* 头像 */}
        <Avatar
          src={user.avatar}
          alt={user.nickname}
          className="w-20 h-20 flex-shrink-0 border-4 border-white/30"
        />

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white mb-1">
            {user.nickname}
          </h2>
          <p className="text-sm text-white/80 mb-2">ID: {user.username}</p>
          {user.signature && (
            <p className="text-sm text-white/90 line-clamp-2">
              {user.signature}
            </p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-white"
            onClick={onQRCode}
          >
            <QrCodeIcon className="w-5 h-5" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-white"
            onClick={onEdit}
          >
            <PencilIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
