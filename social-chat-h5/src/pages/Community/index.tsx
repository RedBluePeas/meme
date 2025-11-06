/**
 * Community - 社区页
 * 话题广场、推荐用户等
 */

import { MainLayout } from '@/components/Layout';

const CommunityPage: React.FC = () => {
  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '社区',
        showBack: false
      }}
    >
      <div className="p-4">
        <h1 className="text-xl font-bold">社区</h1>
        <p className="text-gray-600 mt-2">话题广场和推荐用户将在这里展示</p>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
