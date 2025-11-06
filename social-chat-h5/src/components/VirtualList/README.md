# VirtualList 虚拟滚动列表组件

高性能的虚拟滚动列表组件，适用于大量数据的列表渲染。

## 功能特性

- ✅ 只渲染可见区域的列表项
- ✅ 自动缓冲区管理
- ✅ 滚动加载更多
- ✅ 自定义列表项渲染
- ✅ 空状态支持
- ✅ 加载状态支持

## 使用示例

### 基础用法

```tsx
import { VirtualList } from '@/components/VirtualList';

function MyList() {
  const [data, setData] = useState([...]);

  return (
    <VirtualList
      data={data}
      itemHeight={80}
      containerHeight={600}
      renderItem={(item, index) => (
        <div className="p-4 border-b">
          {item.name}
        </div>
      )}
      getItemKey={(item) => item.id}
    />
  );
}
```

### 加载更多

```tsx
<VirtualList
  data={messages}
  itemHeight={80}
  containerHeight={600}
  renderItem={(msg, index) => <MessageItem message={msg} />}
  getItemKey={(msg) => msg.id}
  loading={loading}
  hasMore={hasMore}
  onLoadMore={loadMore}
  loadMoreThreshold={200}
/>
```

### 空状态

```tsx
<VirtualList
  data={contacts}
  itemHeight={72}
  containerHeight={500}
  renderItem={(contact) => <ContactItem contact={contact} />}
  getItemKey={(contact) => contact.id}
  emptyContent={
    <div className="text-center">
      <p>还没有联系人</p>
      <Button>添加联系人</Button>
    </div>
  }
/>
```

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | T[] | 是 | - | 列表数据 |
| itemHeight | number | 是 | - | 每项的固定高度 |
| containerHeight | number | 是 | - | 容器高度 |
| bufferSize | number | 否 | 3 | 缓冲区大小（额外渲染的项数） |
| renderItem | (item: T, index: number) => ReactNode | 是 | - | 渲染函数 |
| getItemKey | (item: T, index: number) => string \| number | 是 | - | 获取唯一键 |
| loading | boolean | 否 | false | 是否正在加载 |
| hasMore | boolean | 否 | false | 是否还有更多数据 |
| onLoadMore | () => void | 否 | - | 加载更多回调 |
| loadMoreThreshold | number | 否 | 200 | 触发加载的阈值（px） |
| emptyContent | ReactNode | 否 | - | 空状态内容 |
| className | string | 否 | '' | 容器类名 |

## 性能优化建议

1. **固定高度**: 确保所有列表项使用相同的固定高度
2. **键优化**: `getItemKey` 应返回稳定的唯一标识
3. **渲染优化**: `renderItem` 中的组件应使用 `React.memo` 包裹
4. **数据缓存**: 对于远程数据，使用适当的缓存策略

## 适用场景

- ✅ 消息列表（聊天记录）
- ✅ 联系人列表
- ✅ 群组列表
- ✅ 通知列表
- ✅ 搜索结果列表
- ✅ 任何需要渲染大量数据的列表

## 注意事项

1. 本组件要求列表项高度固定
2. 如需支持动态高度，可使用 [react-window](https://github.com/bvaughn/react-window) 或 [react-virtuoso](https://virtuoso.dev/)
3. 建议 `containerHeight` 与实际可视区域一致
