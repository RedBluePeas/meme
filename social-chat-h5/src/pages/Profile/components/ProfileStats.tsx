/**
 * ProfileStats - 个人统计数据
 * 显示关注、粉丝、获赞等统计信息
 */

import React from 'react';
import { User } from '@/types/models';

interface ProfileStatsProps {
  user: User;
  onFollowing?: () => void;
  onFollowers?: () => void;
  onLikes?: () => void;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  user,
  onFollowing,
  onFollowers,
  onLikes,
}) => {
  return (
    <div className="grid grid-cols-3 divide-x divide-gray-200 bg-white">
      {/* 关注 */}
      <button
        className="flex flex-col items-center justify-center py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        onClick={onFollowing}
      >
        <span className="text-xl font-bold text-gray-900">
          {user.followingCount || 0}
        </span>
        <span className="text-sm text-gray-500 mt-1">关注</span>
      </button>

      {/* 粉丝 */}
      <button
        className="flex flex-col items-center justify-center py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        onClick={onFollowers}
      >
        <span className="text-xl font-bold text-gray-900">
          {user.followerCount || 0}
        </span>
        <span className="text-sm text-gray-500 mt-1">粉丝</span>
      </button>

      {/* 获赞 */}
      <button
        className="flex flex-col items-center justify-center py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        onClick={onLikes}
      >
        <span className="text-xl font-bold text-gray-900">
          {user.likeCount || 0}
        </span>
        <span className="text-sm text-gray-500 mt-1">获赞</span>
      </button>
    </div>
  );
};
