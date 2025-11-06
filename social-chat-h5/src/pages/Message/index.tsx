/**
 * Message - 消息页
 * 会话列表、系统消息
 */

import { MainLayout } from '@/components/Layout';

const MessagePage: React.FC = () => {
  return (
    <MainLayout
      showTabBar={true}
      showNavBar={true}
      navBarProps={{
        title: '消息',
        showBack: false
      }}
    >
      <div className="p-4">
        <h1 className="text-xl font-bold">消息</h1>
        <p className="text-gray-600 mt-2">聊天会话列表将在这里展示</p>
      </div>
    </MainLayout>
  );
};

export default MessagePage;
