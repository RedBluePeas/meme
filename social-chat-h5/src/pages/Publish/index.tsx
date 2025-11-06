/**
 * Publish - 发布页
 * 发布动态、上传图片视频
 */

import { MainLayout } from '@/components/Layout';

const PublishPage: React.FC = () => {
  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '发布动态',
        showBack: true
      }}
    >
      <div className="p-4">
        <h1 className="text-xl font-bold">发布动态</h1>
        <p className="text-gray-600 mt-2">动态发布表单将在这里展示</p>
      </div>
    </MainLayout>
  );
};

export default PublishPage;
