# 性能优化指南

本文档介绍项目中的性能优化策略和最佳实践。

## 目录

1. [虚拟滚动](#虚拟滚动)
2. [图片懒加载](#图片懒加载)
3. [防抖与节流](#防抖与节流)
4. [代码分割](#代码分割)
5. [状态管理优化](#状态管理优化)
6. [网络请求优化](#网络请求优化)
7. [构建优化](#构建优化)

---

## 虚拟滚动

### 概述

虚拟滚动通过只渲染可视区域的元素，大幅提升长列表的渲染性能。

### 使用场景

- 消息列表（数千条聊天记录）
- 联系人列表（大量好友）
- 群组列表
- 通知列表
- 搜索结果

### 示例代码

```tsx
import { VirtualList } from '@/components/VirtualList';

function MessageList() {
  const { messages, loading, hasMore, loadMore } = useMessages();

  return (
    <VirtualList
      data={messages}
      itemHeight={80}
      containerHeight={600}
      renderItem={(msg) => <MessageItem message={msg} />}
      getItemKey={(msg) => msg.id}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
}
```

### 性能对比

| 场景 | 传统渲染 | 虚拟滚动 | 提升 |
|------|---------|---------|------|
| 1000 条消息首次渲染 | ~800ms | ~50ms | 16x |
| 滚动帧率 | ~30fps | ~60fps | 2x |
| 内存占用 | ~50MB | ~10MB | 5x |

---

## 图片懒加载

### 概述

使用 Intersection Observer API 实现图片懒加载，减少初始加载时间和带宽消耗。

### 使用场景

- 用户头像
- 帖子图片
- 群组封面
- 相册图片

### 示例代码

```tsx
import { LazyImage } from '@/components/LazyImage';

function PostImage({ post }) {
  return (
    <LazyImage
      src={post.image}
      placeholder="/assets/placeholder.png"
      alt={post.title}
      className="w-full h-48 object-cover rounded-lg"
      showLoading
    />
  );
}
```

### 优化建议

1. **使用占位图**: 提供低分辨率或模糊占位图，提升用户体验
2. **调整 rootMargin**: 根据场景调整提前加载距离
   ```tsx
   <LazyImage rootMargin="200px" /> // 快速滚动场景
   <LazyImage rootMargin="50px" />  // 慢速浏览场景
   ```
3. **图片尺寸优化**: 根据设备 DPR 返回合适尺寸
   ```typescript
   const dpr = window.devicePixelRatio || 1;
   const imageSize = Math.ceil(displaySize * dpr);
   ```
4. **使用现代格式**: WebP、AVIF 等格式可减少 30-50% 文件大小

---

## 防抖与节流

### 概述

防抖（Debounce）和节流（Throttle）用于控制函数执行频率，优化高频事件处理。

### 工具函数

```typescript
import { debounce, throttle, rafThrottle } from '@/utils/performance';
```

### React Hooks

```typescript
import { useDebounce, useThrottle, useRafThrottle } from '@/hooks/usePerformance';
```

### 使用场景与示例

#### 1. 搜索输入（防抖）

```tsx
function SearchBar() {
  const handleSearch = useDebounce((keyword: string) => {
    searchApi.search(keyword);
  }, 300);

  return (
    <Input
      placeholder="搜索"
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

#### 2. 滚动事件（节流）

```tsx
function InfiniteList() {
  const handleScroll = useThrottle(() => {
    console.log('滚动位置:', window.scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}
```

#### 3. 动画/拖拽（RAF 节流）

```tsx
function DraggableItem() {
  const handleDrag = useRafThrottle((x: number, y: number) => {
    // 更新位置
    setPosition({ x, y });
  });

  return <div onMouseMove={(e) => handleDrag(e.clientX, e.clientY)} />;
}
```

### 性能对比

| 事件类型 | 无优化 | 防抖/节流 | 减少调用次数 |
|---------|--------|----------|-------------|
| 搜索输入 | 每次输入 | 停止后 300ms | ~90% |
| 滚动事件 | ~60次/秒 | ~10次/秒 | ~83% |
| 窗口 resize | ~100次/秒 | ~10次/秒 | ~90% |

---

## 代码分割

### 当前实现

项目已使用 React.lazy 实现路由级代码分割：

```tsx
// src/router/index.tsx
const HomePage = lazy(() => import('@/pages/Home'));
const MessagePage = lazy(() => import('@/pages/Message'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
```

### 进一步优化

#### 1. 组件级分割

对大型组件进行分割：

```tsx
// 聊天室组件较大，延迟加载
const ChatRoom = lazy(() => import('@/components/ChatRoom'));

function MessagePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ChatRoom />
    </Suspense>
  );
}
```

#### 2. 条件加载

根据用户权限或功能开关加载模块：

```tsx
const AdminPanel = lazy(() => import('@/components/AdminPanel'));

function Profile() {
  const { isAdmin } = useUser();

  return (
    <div>
      {isAdmin && (
        <Suspense fallback={<Spinner />}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
}
```

#### 3. 预加载关键路由

对用户可能访问的路由进行预加载：

```tsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // 用户登录后，预加载常用页面
    const preloadRoutes = [
      import('@/pages/Message'),
      import('@/pages/Profile'),
    ];

    Promise.all(preloadRoutes);
  }, []);
}
```

---

## 状态管理优化

### Redux 最佳实践

#### 1. 使用 createSelector 避免重复计算

```typescript
import { createSelector } from '@reduxjs/toolkit';

const selectUnreadMessages = createSelector(
  [(state) => state.message.conversations],
  (conversations) => conversations.filter(c => c.unreadCount > 0)
);
```

#### 2. 规范化状态结构

```typescript
// ❌ 不推荐：嵌套深、重复数据
{
  posts: [
    { id: 1, author: { id: 1, name: 'Alice' }, comments: [...] },
    { id: 2, author: { id: 1, name: 'Alice' }, comments: [...] }
  ]
}

// ✅ 推荐：扁平化、无重复
{
  posts: { 1: {...}, 2: {...} },
  users: { 1: { id: 1, name: 'Alice' } },
  comments: { ... }
}
```

#### 3. 避免在 reducer 中做复杂计算

```typescript
// ❌ 不推荐
builder.addCase(fetchPosts.fulfilled, (state, action) => {
  state.posts = action.payload.map(post => ({
    ...post,
    processedContent: expensiveProcess(post.content) // 避免
  }));
});

// ✅ 推荐：在 selector 或组件中处理
const selectProcessedPosts = createSelector(
  [(state) => state.posts],
  (posts) => posts.map(post => ({
    ...post,
    processedContent: expensiveProcess(post.content)
  }))
);
```

### React 组件优化

#### 1. 使用 React.memo

```tsx
const MessageItem = React.memo(({ message }: { message: Message }) => {
  return <div>{message.content}</div>;
});
```

#### 2. 使用 useMemo 缓存计算结果

```tsx
function PostList({ posts }) {
  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  }, [posts]);

  return <>{sortedPosts.map(post => <PostItem key={post.id} post={post} />)}</>;
}
```

#### 3. 使用 useCallback 缓存函数

```tsx
function Parent() {
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);

  return <Child onClick={handleClick} />;
}
```

---

## 网络请求优化

### 1. 请求合并

使用 batch 函数合并多个请求：

```typescript
import { batch } from '@/utils/performance';

const batchGetUsers = batch((ids: string[]) => {
  return api.getUsersByIds(ids);
}, 50);

// 多个请求会自动合并
batchGetUsers('id1').then(user => console.log(user));
batchGetUsers('id2').then(user => console.log(user));
// 50ms 后一次性请求 ['id1', 'id2']
```

### 2. 请求缓存

```typescript
import { memoize } from '@/utils/performance';

const getCachedUser = memoize(
  (id: string) => api.getUser(id),
  { maxSize: 100, ttl: 60000 } // 缓存 100 条，60 秒过期
);
```

### 3. 并行请求

```typescript
// ❌ 串行请求（慢）
const user = await api.getUser(userId);
const posts = await api.getPosts(userId);
const friends = await api.getFriends(userId);

// ✅ 并行请求（快）
const [user, posts, friends] = await Promise.all([
  api.getUser(userId),
  api.getPosts(userId),
  api.getFriends(userId)
]);
```

### 4. 分页加载

```typescript
function useInfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const newItems = await api.getItems({ page, pageSize: 20 });
    setItems([...items, ...newItems]);
    setPage(page + 1);
    setHasMore(newItems.length === 20);
  };

  return { items, hasMore, loadMore };
}
```

---

## 构建优化

### Vite 配置优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库单独打包
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-ui': ['@nextui-org/react'],
          'vendor-utils': ['axios', 'socket.io-client', 'dayjs'],
        },
      },
    },
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true,
      },
    },
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', '@nextui-org/react'],
  },
});
```

### 分析打包结果

```bash
# 安装分析工具
npm install -D rollup-plugin-visualizer

# 生成分析报告
npm run build
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

---

## 性能监控

### 关键指标

1. **FCP (First Contentful Paint)**: 首次内容绘制
2. **LCP (Largest Contentful Paint)**: 最大内容绘制
3. **FID (First Input Delay)**: 首次输入延迟
4. **CLS (Cumulative Layout Shift)**: 累积布局偏移
5. **TTI (Time to Interactive)**: 可交互时间

### 监控实现

```typescript
// src/utils/performance-monitor.ts
export function reportWebVitals() {
  if ('web-vitals' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}
```

---

## 性能优化清单

### 开发阶段

- [ ] 使用 VirtualList 替换长列表
- [ ] 为所有图片添加懒加载
- [ ] 搜索输入使用防抖
- [ ] 滚动事件使用节流
- [ ] 组件使用 React.memo
- [ ] 合理使用 useMemo 和 useCallback
- [ ] Redux state 规范化
- [ ] 使用 createSelector 避免重复计算

### 构建阶段

- [ ] 配置代码分割
- [ ] 分析打包结果
- [ ] 优化第三方库引入
- [ ] 配置 gzip/brotli 压缩
- [ ] 生产环境移除 console

### 部署阶段

- [ ] 启用 CDN 加速
- [ ] 配置 HTTP/2
- [ ] 启用缓存策略
- [ ] 图片使用 CDN
- [ ] 配置性能监控

---

## 参考资源

- [React 性能优化](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Vite 性能优化](https://vitejs.dev/guide/performance.html)
- [Redux Performance](https://redux.js.org/usage/performance)
