/**
 * GroupList - 群组列表页面
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Avatar } from '@nextui-org/react';
import { Plus, Users } from 'lucide-react';
import { MainLayout } from '@/components/Layout';
import { PullRefresh } from '@/components/common';
import { useGroup } from '@/hooks/useGroup';

const GroupListPage: React.FC = () => {
  const navigate = useNavigate();
  const { myGroups, myGroupsLoading, loadMyGroups } = useGroup();

  useEffect(() => {
    loadMyGroups(true);
  }, []);

  const handleRefresh = async () => {
    await loadMyGroups(true);
  };

  const handleCreate = () => {
    navigate('/groups/create');
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

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
            <Plus size={20} />
          </Button>
        ),
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <PullRefresh onRefresh={handleRefresh}>
          <div className="p-4 space-y-3">
            {myGroups.map((group) => (
              <Card key={group.id} className="cursor-pointer" onClick={() => handleGroupClick(group.id)}>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <Avatar src={group.avatar} size="lg" />
                    <div className="flex-1">
                      <h3 className="font-medium">{group.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users size={14} />
                        <span>{group.memberCount} 人</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </PullRefresh>
      </div>
    </MainLayout>
  );
};

export default GroupListPage;
