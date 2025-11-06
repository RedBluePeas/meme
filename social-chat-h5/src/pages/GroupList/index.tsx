/**
 * GroupList - 群组列表页面
 * 性能优化: 使用 VirtualList + LazyImage
 */

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Avatar, Spinner } from '@heroui/react';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { VirtualList } from '@/components/VirtualList';
import { LazyImage } from '@/components/LazyImage';
import { useGroup } from '@/hooks/useGroup';

const GroupListPage: React.FC = () => {
  const navigate = useNavigate();
  const { myGroups, myGroupsLoading, myGroupsHasMore, loadMyGroups } = useGroup();

  useEffect(() => {
    loadMyGroups(true);
  }, []);

  const handleCreate = () => {
    navigate('/groups/create');
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  const handleLoadMore = () => {
    if (!myGroupsLoading && myGroupsHasMore) {
      loadMyGroups(false);
    }
  };

  // 群组列表项渲染函数
  const renderGroupItem = useMemo(
    () => (group: any) => (
      <div className="px-4 pb-3">
        <Card className="cursor-pointer" onClick={() => handleGroupClick(group.id)}>
          <CardBody>
            <div className="flex items-center gap-3">
              <Avatar
                as="span"
                ImgComponent={LazyImage}
                src={group.avatar}
                size="lg"
                name={group.name}
              />
              <div className="flex-1">
                <h3 className="font-medium">{group.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>{group.memberCount} 人</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    ),
    [navigate]
  );

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '我的群组',
        showBack: true,
        onBack: () => navigate(-1),
        rightContent: (
          <Button isIconOnly variant="light" size="sm" onClick={handleCreate}>
            <PlusIcon className="w-5 h-5" />
          </Button>
        ),
      }}
    >
      <div className="h-screen bg-gray-50 pt-4">
        {myGroups.length === 0 && !myGroupsLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <UsersIcon className="w-12 h-12 mb-4" />
            <p>还没有加入任何群组</p>
            <Button color="primary" className="mt-4" onClick={handleCreate}>
              创建群组
            </Button>
          </div>
        ) : (
          <VirtualList
            data={myGroups}
            itemHeight={88}
            containerHeight={window.innerHeight - 120}
            renderItem={renderGroupItem}
            getItemKey={(group) => group.id}
            loading={myGroupsLoading}
            hasMore={myGroupsHasMore}
            onLoadMore={handleLoadMore}
            emptyContent={
              <div className="flex flex-col items-center justify-center text-gray-400">
                <UsersIcon className="w-12 h-12 mb-4" />
                <p>还没有加入任何群组</p>
              </div>
            }
          />
        )}
      </div>
    </MainLayout>
  );
};

export default GroupListPage;
