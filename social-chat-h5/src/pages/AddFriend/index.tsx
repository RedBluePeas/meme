/**
 * AddFriend - 添加好友页面
 * 搜索用户、查看用户资料、发送好友请求
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Avatar, Card, CardBody, Spinner } from '@heroui/react';
import { MagnifyingGlassIcon, UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { useContact } from '@/hooks/useContact';
import { SearchUserResult } from '@/types/models';
import { SSDialog } from '@/components/SSDialog';

const AddFriendPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchResults, searchLoading, searchUsers, clearSearch, addFriend } =
    useContact();
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<'username' | 'phone' | 'id'>(
    'username'
  );

  /**
   * 搜索
   */
  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      SSDialog.toast.error('请输入搜索内容');
      return;
    }

    await searchUsers({ keyword: trimmed, type: searchType });
  };

  /**
   * 处理键盘回车
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 添加好友
   */
  const handleAddFriend = async (user: SearchUserResult) => {
    if (user.isFriend) {
      SSDialog.toast.error('已经是好友了');
      return;
    }

    const result = await SSDialog.prompt({
      title: '添加好友',
      content: `发送好友请求给 ${user.nickname}`,
      placeholder: '填写验证信息（选填）',
      onConfirm: async (message) => {
        await addFriend({
          targetId: user.id,
          message,
        });

        // 清空搜索结果
        setKeyword('');
        clearSearch();
      },
    });
  };

  /**
   * 清空搜索
   */
  const handleClear = () => {
    setKeyword('');
    clearSearch();
  };

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '添加好友',
        showBack: true,
        onBack: () => navigate(-1),
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* 搜索栏 */}
        <div className="bg-white p-4">
          <div className="flex gap-2">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索用户名/手机号/ID"
              startContent={<MagnifyingGlassIcon className="w-[18px] h-[18px] text-gray-400" />}
              classNames={{
                input: 'text-sm',
              }}
            />
            <Button color="primary" onClick={handleSearch} isLoading={searchLoading}>
              搜索
            </Button>
          </div>

          {/* 搜索类型切换 */}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant={searchType === 'username' ? 'solid' : 'bordered'}
              color="primary"
              onClick={() => setSearchType('username')}
            >
              用户名
            </Button>
            <Button
              size="sm"
              variant={searchType === 'phone' ? 'solid' : 'bordered'}
              color="primary"
              onClick={() => setSearchType('phone')}
            >
              手机号
            </Button>
            <Button
              size="sm"
              variant={searchType === 'id' ? 'solid' : 'bordered'}
              color="primary"
              onClick={() => setSearchType('id')}
            >
              ID
            </Button>
          </div>
        </div>

        {/* 搜索结果 */}
        {searchLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="p-4 space-y-3">
            {searchResults.map((user) => (
              <Card key={user.id} className="shadow-sm">
                <CardBody>
                  <div className="flex items-center gap-3">
                    {/* 头像 */}
                    <Avatar
                      src={user.avatar}
                      alt={user.nickname}
                      size="lg"
                      className="flex-shrink-0"
                    />

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {user.nickname}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user.username}
                      </p>
                      {user.mutualFriendsCount > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <UsersIcon className="w-3 h-3" className="text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {user.mutualFriendsCount} 个共同好友
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div>
                      {user.isFriend ? (
                        <Button size="sm" variant="bordered" isDisabled>
                          已添加
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          color="primary"
                          startContent={<UserPlusIcon className="w-4 h-4" />}
                          onClick={() => handleAddFriend(user)}
                        >
                          添加
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : keyword && !searchLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-sm">未找到相关用户</p>
            <p className="text-gray-400 text-xs mt-1">试试其他搜索方式</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400 text-sm">输入关键词搜索用户</p>
            <p className="text-gray-400 text-xs mt-1">支持用户名、手机号、ID搜索</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AddFriendPage;
