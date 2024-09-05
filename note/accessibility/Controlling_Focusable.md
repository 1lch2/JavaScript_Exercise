# 控制可聚焦的元素

## tabindex 属性
`tabindex` 属性一般用来指示某个元素是否可以聚焦，以及是否或者在何处可以用键盘来导航（指按Tab键）。

### 用法
`tabindex`接收一个整数值。
- 负值：一般使用 -1。表示元素可以聚焦，但是不能用键盘来导航到该元素。一般这种情况是通过JS调用某个元素上的`focus()`方法来控制聚焦。
- 0：表示元素可聚焦，且可以通过键盘来导航到这个元素。具体顺序取决于这个元素所处的DOM结构。
- 正值：表示元素可以聚焦，且可以通过键盘导航到这个元素。相对顺序按传递的这个数值来控制获得焦点的**滞后**程度。
    > 如果多个元素拥有相同的 tabindex，它们的相对顺序按照他们在当前 DOM 中的先后顺序决定。

## 用tabindex记忆焦点的位置
以一个 Toolbar 组件为例：
> 代码由 Gemini 生成
```tsx
import React, { useState, useEffect } from 'react';

interface ToolbarItem {
  label: string;
  // Add more properties if needed
}

interface ToolbarProps {
  items: ToolbarItem[];
}

const Toolbar: React.FC<ToolbarProps> = ({ items }) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        // Move focus out of the toolbar
        event.preventDefault();
      } else if (event.key === 'ArrowLeft') {
        // Move focus to the previous item
        event.preventDefault();
        setFocusedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.key === 'ArrowRight') {
        // Move focus to the next item
        event.preventDefault();
        setFocusedIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, focusedIndex]);

  return (
    <div className="toolbar">
      {items.map((item, index) => (
        <div
          key={item.label}
          tabIndex={index === focusedIndex ? 0 : -1}
          className={`toolbar-item ${index === focusedIndex ? 'focused' : ''}`}
          onClick={() => setFocusedIndex(index)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
```

Toolbar 内部只有一个div不包含 `tabindex="-1"`，通过这个控制每次焦点进入时都记忆上一次的位置。同时保证内部只能用左右方向键控制焦点移动。