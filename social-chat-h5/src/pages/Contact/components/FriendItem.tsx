/**
 * FriendItem - 好友列表项
 * 显示好友头像、昵称、签名、在线状态
 */

import React from 'react';
import { Avatar, Badge } from '@nextui-org/react';
import { Friend } from '@/types/models';

interface FriendItemProps {
  friend: Friend;
  onClick?: () => void;
}

export const FriendItem: React.FC<FriendItemProps> = ({ friend, onClick }) => {
  return (
    <div
      className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* 头像 */}
      <div className="relative flex-shrink-0">
        <Badge
          content=""
          color="success"
          shape="circle"
          placement="bottom-right"
          isInvisible={!friend.isOnline}
          classNames={{
            badge: 'w-3 h-3 border-2 border-white',
          }}
        >
          <Avatar
            src={friend.avatar}
            alt={friend.remark || friend.nickname}
            size="lg"
            className="flex-shrink-0"
          />
        </Badge>
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* 显示名称（备注优先） */}
          <h3 className="font-medium text-gray-900 truncate">
            {friend.remark || friend.nickname}
          </h3>

          {/* 标签 */}
          {friend.tags && friend.tags.length > 0 && (
            <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded">
              {friend.tags[0]}
            </span>
          )}
        </div>

        {/* 签名 */}
        {friend.signature && (
          <p className="text-sm text-gray-500 truncate mt-1">
            {friend.signature}
          </p>
        )}
      </div>
    </div>
  );
};
