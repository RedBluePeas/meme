# LazyImage 图片懒加载组件

基于 Intersection Observer API 的图片懒加载组件，优化图片加载性能。

## 功能特性

- ✅ 自动懒加载（进入可视区域才加载）
- ✅ 占位图支持
- ✅ 加载失败回退
- ✅ 加载状态指示
- ✅ 提前加载（rootMargin 配置）
- ✅ 平滑过渡动画

## 使用示例

### 基础用法

```tsx
import { LazyImage } from '@/components/LazyImage';

function Avatar() {
  return (
    <LazyImage
      src="https://example.com/avatar.jpg"
      alt="用户头像"
      className="w-12 h-12 rounded-full"
    />
  );
}
```

### 带占位图

```tsx
<LazyImage
  src={user.avatar}
  placeholder="/assets/avatar-placeholder.png"
  fallback="/assets/default-avatar.png"
  alt={user.name}
  className="w-20 h-20 rounded-full"
/>
```

### 显示加载指示器

```tsx
<LazyImage
  src={post.image}
  showLoading
  alt={post.title}
  className="w-full h-48 object-cover rounded-lg"
/>
```

### 提前加载

```tsx
<LazyImage
  src={image.url}
  rootMargin="200px" // 距离可视区域 200px 时就开始加载
  alt="图片"
/>
```

### 监听加载状态

```tsx
<LazyImage
  src={photo.url}
  onLoad={() => console.log('图片加载完成')}
  onError={() => console.log('图片加载失败')}
  alt="照片"
/>
```

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| src | string | 是 | - | 图片 URL |
| placeholder | string | 否 | - | 占位图 URL |
| fallback | string | 否 | '/assets/image-placeholder.png' | 加载失败时的占位图 |
| alt | string | 否 | '' | 图片描述 |
| rootMargin | string | 否 | '50px' | 提前加载的距离 |
| showLoading | boolean | 否 | false | 是否显示加载指示器 |
| containerClassName | string | 否 | '' | 容器类名 |
| onLoad | () => void | 否 | - | 加载成功回调 |
| onError | () => void | 否 | - | 加载失败回调 |

继承所有标准 `<img>` 标签的属性（className, style, width, height 等）。

## 使用场景

- ✅ 用户头像
- ✅ 帖子图片
- ✅ 群组封面
- ✅ 相册图片
- ✅ 长列表中的图片
- ✅ 任何需要优化加载性能的图片

## 性能优化建议

1. **设置合适的 placeholder**: 使用低分辨率或模糊图作为占位图
2. **调整 rootMargin**: 根据场景调整提前加载的距离
   - 快速滚动场景：增大 rootMargin (如 '200px')
   - 慢速浏览场景：使用默认值或更小
3. **图片尺寸优化**: 确保服务端返回适合当前设备的图片尺寸
4. **CDN 加速**: 使用 CDN 加速图片访问
5. **图片格式**: 优先使用 WebP 等现代格式

## 与 Avatar 组件结合使用

```tsx
import { Avatar } from '@nextui-org/react';
import { LazyImage } from '@/components/LazyImage';

function UserAvatar({ user }) {
  return (
    <Avatar
      as="span"
      ImgComponent={LazyImage}
      src={user.avatar}
      name={user.name}
    />
  );
}
```

## 浏览器兼容性

- 使用 Intersection Observer API
- 支持所有现代浏览器
- iOS Safari 12.2+
- Android Chrome 51+

## 注意事项

1. 确保设置正确的 `alt` 属性以提高可访问性
2. 为容器设置固定尺寸避免布局抖动
3. 占位图应与目标图片尺寸一致
