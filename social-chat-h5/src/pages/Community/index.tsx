/**
 * Community - 社区
 * 话题广场，发现感兴趣的话题和圈子
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Chip } from '@heroui/react';
import { MainLayout } from '@/components/Layout';
import { PullRefresh } from '@/components/common';
import { TopicList } from './components';
import { useCommunity } from '@/hooks/useCommunity';

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    topics,
    hasMore,
    loading,
    recommendTopics,
    hotTopics,
    refresh,
    loadMore,
    toggleFollow,
    fetchRecommendTopics,
    fetchHotTopics,
  } = useCommunity();

  const [activeTab, setActiveTab] = React.useState<string>('all');

  /**
   * 初始化加载推荐和热门话题
   */
  useEffect(() => {
    fetchRecommendTopics();
    fetchHotTopics();
  }, []);

  /**
   * 处理关注
   */
  const handleFollow = async (topicId: string, isFollowed: boolean) => {
    await toggleFollow(topicId, isFollowed);
  };

  /**
   * 处理点击话题
   */
  const handleClick = (topicId: string) => {
    navigate(`/community/topic/${topicId}`);
  };

  /**
   * 根据 tab 获取对应的话题列表
   */
  const getTopicsByTab = () => {
    switch (activeTab) {
      case 'recommend':
        return recommendTopics;
      case 'hot':
        return hotTopics;
      default:
        return topics;
    }
  };

  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '社区',
        showBack: false,
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Tab 切换 */}
        <div className="bg-white sticky top-0 z-10 shadow-sm">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            classNames={{
              base: 'w-full',
              tabList: 'w-full',
              tab: 'h-12',
            }}
          >
            <Tab key="all" title="全部" />
            <Tab
              key="recommend"
              title={
                <div className="flex items-center gap-1">
                  <span>推荐</span>
                  {recommendTopics.length > 0 && (
                    <Chip size="sm" color="primary" variant="flat">
                      {recommendTopics.length}
                    </Chip>
                  )}
                </div>
              }
            />
            <Tab
              key="hot"
              title={
                <div className="flex items-center gap-1">
                  <span>热门</span>
                  {hotTopics.length > 0 && (
                    <Chip size="sm" color="danger" variant="flat">
                      🔥
                    </Chip>
                  )}
                </div>
              }
            />
          </Tabs>
        </div>

        {/* 内容区域 */}
        <PullRefresh onRefresh={refresh}>
          <div className="p-4">
            <TopicList
              topics={getTopicsByTab()}
              loading={loading && getTopicsByTab().length === 0}
              hasMore={activeTab === 'all' && hasMore}
              onLoadMore={activeTab === 'all' ? loadMore : undefined}
              onFollow={handleFollow}
              onClick={handleClick}
            />
          </div>
        </PullRefresh>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
