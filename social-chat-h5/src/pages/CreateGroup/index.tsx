/**
 * CreateGroup - 创建群组页面
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Textarea, Button, Select, SelectItem } from '@heroui/react';
import { MainLayout } from '@/components/Layout';
import { useGroup } from '@/hooks/useGroup';
import { JoinType } from '@/types/models';

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { createGroup } = useGroup();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joinType, setJoinType] = useState<JoinType>('approval');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      return;
    }

    setCreating(true);
    const group = await createGroup({
      name: name.trim(),
      description: description.trim(),
      joinType,
    });
    setCreating(false);

    if (group) {
      navigate(`/groups/${group.id}`);
    }
  };

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '创建群组',
        showBack: true,
        onBack: () => navigate(-1),
        rightContent: (
          <Button size="sm" color="primary" onClick={handleCreate} isLoading={creating}>
            创建
          </Button>
        ),
      }}
    >
      <div className="min-h-screen bg-gray-50 p-4 space-y-4">
        <div className="bg-white rounded-lg p-4">
          <Input label="群名称" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
        </div>

        <div className="bg-white rounded-lg p-4">
          <Textarea label="群简介" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} minRows={3} />
        </div>

        <div className="bg-white rounded-lg p-4">
          <Select label="加入方式" selectedKeys={[joinType]} onSelectionChange={(keys) => setJoinType(Array.from(keys)[0] as JoinType)}>
            <SelectItem key="free" value="free">
              自由加入
            </SelectItem>
            <SelectItem key="approval" value="approval">
              需要审批
            </SelectItem>
            <SelectItem key="invite_only" value="invite_only">
              仅邀请
            </SelectItem>
          </Select>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateGroupPage;
