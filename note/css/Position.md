# CSS基础 - posistion属性

## 默认定位 static
**默认值**。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声 明）。 inherit: 规定应该从父元素继承 position 属性的值。


## 相对定位 relative
可以通过设置垂直或水平位置，让这个元素“相对于”它的起点进行移动。 在使用相对定位时，无论是否进行移动，元素仍然占据原来的空间。因此，移动元素会导致它覆盖其它框。

通过使用`top`, `bottom`, `left`, `right`四个参数，可以指定元素的偏移方向，效果类似设置边距。

举例：
```html
<div>
    <p class="positioned">sample</p>
</div>
```
```css
.positioned {
  position: static;
  top: 30px;
  left: 30px;
  background: yellow;
}
```
文字背景色将变为黄色，并**向右**和**向下**偏移30px。


## 绝对定位 absolute
绝对定位的元素的位置相对于相对于最近的非 static 定位祖先元素的偏移。

absolute 定位会使元素脱离文档流，因此不占据空间。相反，它位于它自己的层，独立于一切。

### 用途
可以创建不干扰页面上其他元素的位置的隔离的UI功能。

- 弹出信息框和控制菜单；
- 翻转面板；
- 可以在页面上的任何地方拖放的UI功能

## 固定定位 fixed
absolute 定位元素是相对于 `<html>` 元素或其最近的定位祖先，而 fixed 定位固定元素则是相对于浏览器窗口本身。

这意味着可以创建固定的有用的UI项目，如持久导航菜单。

```html
<body>
    <h1>Fixed header</h1>
    <p> ... </p>
    <p> ... </p>
    <p> ... </p>
</body>
```
```css
body {
  width: 500px;
  margin: 0 auto;
}

p {
  background: aqua;
  border: 3px solid blue;
  padding: 10px;
  margin: 10px;
}

span {
  background: red;
  border: 1px solid black;
}
```
h1 标签将始终固定在容器顶端，不随页面滚动。

> 注意：当父元素存在 `transform` 属性时，子元素的 fixed 位置属性会表现为 absolute 属性

## 粘性定位 sticky
sticky 允许被定位的元素表现得像相对定位一样，直到它滚动到某个阈值点（例如，从窗口顶部起1​​0像素）为止，此后它就变得固定了

元素先按照普通文档流定位，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。而后，元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。

```html
<dl>
    <dt>A</dt>
    <dd>Apple</dd>
    <dd>Ant</dd>
    <dd>Altimeter</dd>
    <dd>Airplane</dd>
    <dt>B</dt>
    <dd>Bird</dd>
    <dd>Buzzard</dd>
    <dd>Bee</dd>
    <dd>Banana</dd>
    <dd>Beanstalk</dd>
</dl>
```
```css
dt {
  background-color: black;
  color: white;
  padding: 10px;
  position: sticky;
  top: 0;
  left: 0;
  margin: 1em 0;
}
```

每个字母索引到达顶部时候会固定在顶部，每个后续标题将替换前一个标题，直到它向上滚动到该位置。

## z-index
z-index 属性设定了一个定位元素及其后代元素或 flex 项目的 z-order。 当元素之间重叠的时候， z-index 较大的元素会覆盖较小的元素在上层进行显示。

- 不设定z-index时，元素按照出现顺序堆叠，即靠后的元素堆叠前一个元素的上层。
- 定位的节点（relative, absolute, fixed）的元素叠在非定位节点的上层
- 对于定位节点，z-index 越大的越靠上
- z-index 设为 0 和没有设置z-index的节点在同一层级内没有高低之分
- 两个节点A和B都是定位节点，如果节点A的z-index值比节点B的大，那么节点A的子元素都会覆盖在节点B以及节点B的子节点上。

## 层叠上下文
层叠上下文是HTML元素的三维概念，这些HTML元素在一条假想的相对于面向（电脑屏幕的）视窗或者网页的用户的z轴上延伸，HTML元素依据其自身属性按照优先级顺序占用层叠上下文的空间。

### 特性
子元素的 z-index 值只在父级层叠上下文中有意义。
子级层叠上下文被自动视为父级层叠上下文的一个独立单元。

### 产生的条件
满足一下其中一个条件，即可产生一个层叠上下文：

- 根元素 (HTML),
- z-index 值不为 "auto"的 绝对/相对定位，
- position: fixed
- opacity 属性值小于 1 的元素
- transform 属性值不为 "none"的元素
- filter值不为“none”的元素
- -webkit-overflow-scrolling 属性被设置 "touch"的元素
