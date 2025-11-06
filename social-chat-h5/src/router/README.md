# 路由配置说明

## 概述

本项目使用 React Router v6 进行路由管理，采用懒加载方式提升首屏加载速度。

## 路由守卫

### AuthGuard
- 保护需要登录才能访问的页面
- 未登录用户会被重定向到登录页 `/login`
- 从 Redux `state.auth.isAuthenticated` 获取登录状态

## 路由列表

### 认证相关（无需登录）

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `/login` | LoginPage | 登录页面 |
| `/register` | RegisterPage | 注册页面 |

### 主要页面（需要登录）

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `/` | Redirect | 重定向到 `/home` |
| `/home` | HomePage | 首页-内容流 |
| `/community` | CommunityPage | 社区-话题广场 |
| `/publish` | PublishPage | 发布动态 |
| `/message` | MessagePage | 消息-会话列表 |
| `/profile` | ProfilePage | 个人中心 |

### 消息相关（需要登录）

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `/message/chat/:id` | ChatRoomPage | 聊天室页面 |

### 联系人相关（需要登录）

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `/contact` | ContactPage | 联系人列表 |
| `/contact/add` | AddFriendPage | 添加好友 |
| `/contact/requests` | FriendRequestPage | 好友请求列表 |

### 个人中心相关（需要登录）

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `/profile/edit` | EditProfilePage | 编辑个人资料 |
| `/settings` | SettingsPage | 设置页面 |

### 其他

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `*` | Redirect | 404 重定向到首页 |

## 懒加载

所有页面组件均采用 React.lazy + Suspense 实现懒加载：

```tsx
const HomePage = lazy(() => import('@/pages/Home'));

<Suspense fallback={<Loading fullscreen text="加载中..." />}>
  <HomePage />
</Suspense>
```

## 使用示例

### 页面跳转

```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// 跳转到聊天室
navigate('/message/chat/123');

// 跳转到编辑资料
navigate('/profile/edit');

// 返回上一页
navigate(-1);
```

### 获取路由参数

```tsx
import { useParams } from 'react-router-dom';

const { id } = useParams<{ id: string }>();
```

## 扩展说明

### 添加新路由

1. 在 `/src/pages` 创建新页面组件
2. 在 `router/index.tsx` 中导入并配置路由
3. 根据需要添加路由守卫

### 路由元信息

如需添加页面标题、权限等元信息，可以扩展路由配置：

```tsx
{
  path: '/settings',
  element: <SettingsPage />,
  meta: {
    title: '设置',
    requireAuth: true,
  }
}
```

## 注意事项

1. 所有需要登录的页面都必须包裹在 `<AuthGuard>` 中
2. 懒加载组件必须包裹在 `<LazyLoad>` 中
3. 动态路由参数使用 `:paramName` 格式
4. 使用 `Navigate` 组件实现重定向
