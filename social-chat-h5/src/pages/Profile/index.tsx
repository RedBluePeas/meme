/**
 * Profile - 我的页面
 * 个人信息、设置、统计数据
 */

import { MainLayout } from '@/components/Layout';

const ProfilePage: React.FC = () => {
  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '我的',
        showBack: false
      }}
    >
      <div className="p-4">
        <h1 className="text-xl font-bold">我的</h1>
        <p className="text-gray-600 mt-2">个人信息和设置将在这里展示</p>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
