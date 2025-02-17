# React 新版本特性
## React 19
### `useOptimistic` hook
在 React 中，乐观更新（optimistic updates）指的是一种技术，它会在预期服务器操作成功的情况下立即更新UI，而不等待服务器的响应。这种方法通过使应用程序感觉更加响应迅速来增强用户体验。如果服务器操作失败，UI 可以回退到之前的状态来反映请求错误。

在 React 19 中，引入了 `useOptimistic` 来简化乐观 UI 更新的实现。这个hook可以减少与手动状态管理和错误处理相关的复杂性。代码示例如下：
```jsx
import { useOptimistic } from 'react';

function LikeButton({ post }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(post.likes, (currentLikes, newLike) => currentLikes + newLike);

  const handleLike = async () => {
    addOptimisticLike(1); // 乐观更新 UI
    try {
      await api.likePost(post.id); // 调用API发送点赞请求
    } catch (error) {
      addOptimisticLike(-1); // 失败时回退UI
      console.error("Failed to like post", error);
    }
  };

  return (
    <button onClick={handleLike}>
      Like ({optimisticLikes})
    </button>
  );
}
```

## React 18

### transition

TODO:
