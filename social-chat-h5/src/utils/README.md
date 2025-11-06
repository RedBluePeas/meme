# Utils 工具函数库

项目中的通用工具函数集合。

## 目录

- [性能优化工具 (performance.ts)](#性能优化工具)
- [使用指南](#使用指南)

---

## 性能优化工具

### debounce - 防抖函数

在事件触发后，延迟执行函数，如果在延迟期间再次触发，则重新计时。

**适用场景**:
- 搜索输入
- 窗口 resize
- 表单验证

**示例**:
```typescript
import { debounce } from '@/utils/performance';

const handleSearch = debounce((keyword: string) => {
  console.log('搜索:', keyword);
}, 300);

// 用户输入时调用
handleSearch('react'); // 300ms 后执行
handleSearch('reactjs'); // 重新计时，300ms 后执行
```

**参数**:
- `func`: 要防抖的函数
- `wait`: 延迟时间（毫秒）
- `immediate`: 是否立即执行（可选，默认 false）

---

### throttle - 节流函数

在指定时间内，只执行一次函数。

**适用场景**:
- 滚动事件
- 鼠标移动
- 按钮防重复点击

**示例**:
```typescript
import { throttle } from '@/utils/performance';

const handleScroll = throttle(() => {
  console.log('滚动位置:', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

**参数**:
- `func`: 要节流的函数
- `wait`: 时间间隔（毫秒）
- `options`: 配置选项
  - `leading`: 是否在开始时执行（默认 true）
  - `trailing`: 是否在结束时执行（默认 true）

---

### rafThrottle - RAF 节流

使用 requestAnimationFrame 实现的节流，适合动画和滚动场景。

**适用场景**:
- 动画更新
- 拖拽操作
- 滚动动画

**示例**:
```typescript
import { rafThrottle } from '@/utils/performance';

const handleDrag = rafThrottle((x: number, y: number) => {
  element.style.transform = `translate(${x}px, ${y}px)`;
});

element.addEventListener('mousemove', (e) => {
  handleDrag(e.clientX, e.clientY);
});
```

---

### memoize - 函数缓存

使用 LRU 缓存策略缓存函数结果。

**适用场景**:
- 计算密集型函数
- API 请求缓存
- 数据转换

**示例**:
```typescript
import { memoize } from '@/utils/performance';

const getUser = memoize(
  (id: string) => api.getUser(id),
  { maxSize: 100, ttl: 60000 } // 最多缓存 100 条，60 秒过期
);

// 第一次调用会执行 API 请求
const user1 = await getUser('user-1');

// 第二次调用使用缓存
const user2 = await getUser('user-1'); // 从缓存返回
```

**参数**:
- `func`: 要缓存的函数
- `options`: 配置选项
  - `maxSize`: 最大缓存数量（默认 100）
  - `ttl`: 缓存过期时间（毫秒，可选）
  - `resolver`: 自定义缓存键生成函数（可选）

---

### batch - 批量请求

将多个请求合并成一个批次，减少请求次数。

**适用场景**:
- 批量获取用户信息
- 批量数据查询
- 减少 API 调用次数

**示例**:
```typescript
import { batch } from '@/utils/performance';

const batchGetUsers = batch((ids: string[]) => {
  return api.getUsersByIds(ids);
}, 50); // 等待 50ms 后批量执行

// 多个调用会自动合并
batchGetUsers('id1').then(user => console.log(user));
batchGetUsers('id2').then(user => console.log(user));
batchGetUsers('id3').then(user => console.log(user));

// 50ms 后一次性请求 ['id1', 'id2', 'id3']
```

**参数**:
- `func`: 批量请求函数，接收数组返回数组
- `wait`: 等待时间（毫秒）

---

### sleep - 延迟执行

返回一个 Promise，在指定时间后 resolve。

**适用场景**:
- 模拟网络延迟
- 动画间隔
- 轮询间隔

**示例**:
```typescript
import { sleep } from '@/utils/performance';

async function fetchWithRetry() {
  try {
    return await api.fetchData();
  } catch (error) {
    await sleep(1000); // 等待 1 秒
    return await api.fetchData(); // 重试
  }
}
```

---

### once - 只执行一次

确保函数只执行一次，后续调用返回第一次的结果。

**适用场景**:
- 初始化函数
- 单例模式
- 事件监听器

**示例**:
```typescript
import { once } from '@/utils/performance';

const initialize = once(() => {
  console.log('初始化应用');
  // 执行初始化逻辑
});

initialize(); // 输出: 初始化应用
initialize(); // 不会再次执行
initialize(); // 不会再次执行
```

---

## React Hooks

除了工具函数，还提供了对应的 React Hooks，详见 [`/src/hooks/usePerformance.ts`](/src/hooks/usePerformance.ts)。

### 可用的 Hooks

- `useDebounce`: 防抖 Hook
- `useThrottle`: 节流 Hook
- `useRafThrottle`: RAF 节流 Hook
- `useIntersectionObserver`: 元素可见性监听
- `useLoadMore`: 滚动加载更多
- `usePullToRefresh`: 下拉刷新
- `useImagePreload`: 图片预加载

### 使用示例

```tsx
import { useDebounce, useThrottle } from '@/hooks/usePerformance';

function SearchComponent() {
  // 防抖搜索
  const handleSearch = useDebounce((keyword: string) => {
    searchApi.search(keyword);
  }, 300);

  // 节流滚动
  const handleScroll = useThrottle(() => {
    console.log('滚动中...');
  }, 100);

  return (
    <div onScroll={handleScroll}>
      <input onChange={(e) => handleSearch(e.target.value)} />
    </div>
  );
}
```

---

## 性能对比

| 场景 | 无优化 | 使用工具 | 性能提升 |
|------|--------|---------|---------|
| 搜索输入（每个字符） | ~100 次/秒 | ~3 次/秒 | ~97% ↓ |
| 滚动事件 | ~60 次/秒 | ~10 次/秒 | ~83% ↓ |
| API 请求缓存 | 每次请求 | 缓存命中 | ~95% ↓ |
| 批量请求 | 10 次请求 | 1 次请求 | 10x 减少 |

---

## 最佳实践

### 1. 合理选择防抖和节流

- **防抖 (debounce)**: 用于用户停止操作后才执行（搜索、验证）
- **节流 (throttle)**: 用于持续操作但限制频率（滚动、拖拽）

### 2. 设置合适的延迟时间

```typescript
// 搜索：300-500ms 较为合适
const search = debounce(fn, 300);

// 滚动：100-200ms 较为合适
const scroll = throttle(fn, 100);

// 拖拽：使用 RAF 最佳
const drag = rafThrottle(fn);
```

### 3. 缓存策略

```typescript
// 用户信息：缓存时间长一些
const getUser = memoize(api.getUser, { ttl: 300000 }); // 5 分钟

// 动态内容：缓存时间短一些
const getPosts = memoize(api.getPosts, { ttl: 30000 }); // 30 秒
```

### 4. 批量请求

```typescript
// 等待时间根据场景调整
const batch50ms = batch(fn, 50);   // 用户操作较快时
const batch200ms = batch(fn, 200); // 网络请求较慢时
```

---

## 注意事项

1. **React Hooks**: 在 React 组件中，优先使用 Hooks 版本（useDebounce, useThrottle 等）
2. **内存管理**: 对于大量使用 memoize 的场景，注意设置合理的 maxSize
3. **清理函数**: 在组件卸载时，记得清理定时器和事件监听器
4. **TypeScript**: 所有函数都提供了完整的类型定义

---

## 扩展阅读

- [Understanding debounce and throttle](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Memoization in JavaScript](https://www.freecodecamp.org/news/memoization-in-javascript-and-react/)
