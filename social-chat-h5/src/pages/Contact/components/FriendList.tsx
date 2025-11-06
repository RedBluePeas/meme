/**
 * FriendList - 好友列表
 * 按分组展示好友
 */

import React from 'react';
import { Spinner } from '@nextui-org/react';
import { FriendItem } from './FriendItem';
import { Friend, FriendGroup } from '@/types/models';

interface FriendListProps {
  friends: Friend[];
  groups?: FriendGroup[];
  loading?: boolean;
  onClick?: (friend: Friend) => void;
}

export const FriendList: React.FC<FriendListProps> = ({
  friends,
  groups = [],
  loading = false,
  onClick,
}) => {
  /**
   * 按分组归类好友
   */
  const groupedFriends = React.useMemo(() => {
    if (!groups || groups.length === 0) {
      return [{ group: null, friends }];
    }

    const grouped = groups.map((group) => ({
      group,
      friends: friends.filter((f) => f.groupId === group.id),
    }));

    // 添加未分组的好友
    const ungrouped = friends.filter((f) => !f.groupId);
    if (ungrouped.length > 0) {
      grouped.push({
        group: { id: 'default', name: '我的好友', count: ungrouped.length, order: 999, isDefault: true, createdAt: '' },
        friends: ungrouped,
      });
    }

    return grouped.sort((a, b) => (a.group?.order || 0) - (b.group?.order || 0));
  }, [friends, groups]);

  /**
   * 渲染空状态
   */
  if (!loading && friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-400 text-sm">还没有好友</p>
        <p className="text-gray-400 text-xs mt-1">快去添加好友吧~</p>
      </div>
    );
  }

  /**
   * 渲染加载状态
   */
  if (loading && friends.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {groupedFriends.map(({ group, friends: groupFriends }) => (
        <div key={group?.id || 'default'} className="mb-4">
          {/* 分组标题 */}
          {group && (
            <div className="px-4 py-2 bg-gray-50">
              <h3 className="text-sm text-gray-600">
                {group.name} ({groupFriends.length})
              </h3>
            </div>
          )}

          {/* 好友列表 */}
          <div className="divide-y divide-gray-100">
            {groupFriends.map((friend) => (
              <FriendItem
                key={friend.friendshipId}
                friend={friend}
                onClick={() => onClick?.(friend)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
