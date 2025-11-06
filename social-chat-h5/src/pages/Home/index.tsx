/**
 * Home - 首页
 * 展示内容动态流，支持下拉刷新和无限滚动
 */

import { MainLayout } from '@/components/Layout';

const HomePage: React.FC = () => {
  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '首页',
        showBack: false
      }}
    >
      <div className="p-4">
        <h1 className="text-xl font-bold">首页</h1>
        <p className="text-gray-600 mt-2">内容动态流将在这里展示</p>
      </div>
    </MainLayout>
  );
};

export default HomePage;
