# 从输入URL到加载网页的过程

## 1. DNS

## 2. HTTP

## 3. TCP

## 4. 渲染
### 4.1 DOM tree
处理 HTML 标记并构造 DOM 树。DOM 树描述了文档的内容。`<html>` 元素是第一个标签也是文档树的根节点。树反映了不同标记之间的关系和层次结构。嵌套在其他标记中的标记是子节点。DOM 节点的数量越多，构建 DOM 树所需的时间就越长。

当解析器发现**非阻塞资源**，例如一张图片，浏览器会请求这些资源并且继续解析。当遇到一个 CSS 文件时，解析也可以继续进行，但是对于 `<script>` 标签（特别是没有 async 或者 defer 属性的）会阻塞渲染并停止 HTML 的解析。

#### 请求支持对象（support objects）
support objects 通常指 `<link>` 里的CSS链接，和`<img>` 中的图片链接。构造DOM树和请求支持对象会同时发生。

当初始的 HTML 文档被完全加载和解析完成之后，`DOMContentLoaded` 事件被触发，而无需等待 CSS、图像和子框架的完全加载。

#### script 标签
当浏览器的HTML解析器遇到一个`<script>`标签时会暂停构建DOM，然后将控制权移交至JavaScript引擎，这时引擎会开始执行JavaScript脚本，直到执行结束后，浏览器才会从之前中断的地方恢复，然后继续构建DOM。

### 4.2 CSSOM tree
在收到CSS文件后，浏览器就会开始分析语法并将 CSS 规则转换为可以理解和使用的样式映射。浏览器遍历 CSS 中的每个规则集，根据 CSS 选择器创建具有父、子和兄弟关系的节点树。

UA样式会覆盖浏览器的默认样式

#### 阻塞渲染的CSS
通过 `<link>` 标签的 `media` 属性，可以指定首次加载时先不进行构建CSSOM树，只有在符合特定条件时，才会让浏览器进行阻塞渲染然后构建CSSOM树。

示例如下：
```html
<!-- 默认 media 属性设置为 "all"，即阻塞渲染 -->
<link href="style.css" rel="stylesheet">
<!-- 效果同上 -->
<link href="style.css" rel="stylesheet" media="all">

<!-- 根据网页加载时设备的方向，portrait.css 可能阻塞渲染，也可能不阻塞渲染 -->
<link href="portrait.css" rel="stylesheet" media="orientation:portrait">

<!-- 只在打印网页时应用，因此网页首次在浏览器中加载时，它不会阻塞渲染。 -->
<link href="print.css"    rel="stylesheet" media="print">
```

使用媒体查询可以让CSS资源不在首次加载中阻塞渲染，但不管是哪种CSS资源它们的下载请求都不会被忽略，**浏览器仍然会先下载CSS文件**

### 4.3 Render tree
渲染树由合并DOM树和CSSOM树构成，构造过程如下：
1. 从DOM树的根节点开始，遍历每个可见的节点。
    
    在这一步中，不可见的节点会被忽略，如`<script>`和`<meta>`。由CSS定义的隐藏节点如`<span>`也会被忽略。

    `display: none`会被忽略，而`visibility: hidden` 会出现在渲染树中。

2. 为每个可见的节点找到合适的CSS规则并应用
3. 将节点内容和样式结合产生可见节点

### 4.4 Layout
这一步计算每个对象在设备视窗（viewport）中的准确大小和位置，输出就是一个盒子模型（box model）。

### 4.5 Paint

## 5. 加载JS等资源

TODO: 