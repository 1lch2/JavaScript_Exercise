# CSS - 逻辑属性和值
简单来说为了适配不同的阅读方向，应该用逻辑属性而不是传统的上下左右和长宽。

简单对应关系如下：
- left/top -> start
- right/bottom -> end
- width -> inline-size
- height -> block-size

具体属性对应如下：
| Original     | Logical            |
|--------------|--------------------|
| padding-left | padding-start      |
| margin-top   | margin-block-start |
| width        | inline-size        |
| height       | block-size         |

和 relative position 相关的属性，对应如下：
| Original | Logical            |
|----------|--------------------|
| left     | inset-inline-start |
| top      | inset-block-start  |

简写的传统属性也可以用 `logical` 关键词转换为逻辑属性：
```css
padding: 1rem 2rem 3rem 4rem;
/* ⬇️ */
padding: logical 1rem 4rem 3rem 2rem;
```

