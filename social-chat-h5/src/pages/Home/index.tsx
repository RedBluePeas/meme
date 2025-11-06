/**
 * Home - 首页
 * 展示内容动态流，支持下拉刷新和无限滚动
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout';
import { PullRefresh } from '@/components/common';
import { FeedList } from './components';
import { useFeed } from '@/hooks/useFeed';
import { SSDialog } from '@/components/SSDialog';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { feeds, hasMore, loading, refresh, loadMore, toggleLike } = useFeed();

  /**
   * 处理点赞
   */
  const handleLike = async (feedId: string, isLiked: boolean) => {
    await toggleLike(feedId, isLiked);
  };

  /**
   * 处理评论
   */
  const handleComment = (feedId: string) => {
    navigate(`/post/${feedId}#comments`);
  };

  /**
   * 处理分享
   */
  const handleShare = (feedId: string) => {
    // 这里可以调用系统分享 API 或者显示分享弹窗
    SSDialog.toast.success('分享功能开发中');
  };

  /**
   * 处理点击动态
   */
  const handleClick = (feedId: string) => {
    navigate(`/post/${feedId}`);
  };

  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '首页',
        showBack: false,
      }}
    >
      <PullRefresh onRefresh={refresh}>
        <div className="min-h-screen bg-gray-50">
          <FeedList
            feeds={feeds}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onClick={handleClick}
          />
        </div>
      </PullRefresh>
    </MainLayout>
  );
};

export default HomePage;
