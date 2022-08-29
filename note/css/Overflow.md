# CSS基础 - 控制内容溢出
## 内容溢出现象
对于块级元素，如果内容超出了盒子的宽高，则会从盒子内溢出，覆盖到下方。如下例，div 中的文字会超过边框溢出到下方，但是不会超出原本 div 的宽度。
```html
<div class="box">
This box has a height and a width. This means that if there is too much content to be displayed within the assigned height, there will be an overflow situation. If overflow is set to hidden then any overflow will not be visible.
</div>
```
```css
.box {
  border: 1px solid #333333;
  width: 200px;
  height: 100px;
}
```
> 如果在这里添加 `overflow: hidden` 这一属性，则溢出部分不会显示出来。

> 如果没有设置高度，则盒子高度会随着溢出而变高。

## overflow 属性
overflow 属性控制一个元素溢出的方式，它告诉浏览器你想怎样处理溢出。
默认值为visible，内容溢出的时候，在默认情况下会看到溢出内容。

### hidden
overflow 属性设置为 hidden 时，溢出到盒子之外的内容不会显示出来。

若原本页面有滚动条，则 hidden 属性会改变页面可用宽度，造成内容出现“晃动”的情况

### scroll
overflow 设为 scroll 时，浏览器总会显示滚动条（即保留滚动条占用的空间），当内容溢出时可以滚动看到溢出部分，不溢出时滚动条会占用一部分宽度。

默认情况下会出现横纵两个方向的滚动条，如果只想要纵向的滚动条，可以使用 overflow-y: scroll 属性，这样只会有常见的纵向滚动条。同理还有 overflow-x 控制横向滚动。

### auto
使用 scroll 这个属性值总会显示滚动条，如果想让滚动条仅在溢出时显示，则需要使用 overflow: auto 。

> overflow 设为 scroll 或 auto 时会建立一个 BFC。关于BFC，参见 [CSS - BFC](./BFC.md)。

