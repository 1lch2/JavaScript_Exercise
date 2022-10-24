# CSS 性能优化
## 内联首屏关键CSS（Critical CSS）
内联CSS能够使浏览器开始页面渲染的时间提前，减少FCP的时间。

**劣势**：

内联之后的CSS不会进行缓存，每次都会重新下载，因此应当控制内联CSS的大小。


## 异步加载CSS
### 使用JS创建`<link>`元素并插入DOM
示例如下：
```js
const myCSS = document.createElement( "link" );
myCSS.rel = "stylesheet";
myCSS.href = "mystyles.css";

// 插入到header的最后位置
let insertPosition = document.head.childNodes[document.head.childNodes.length - 1];
document.head.insertBefore(myCSS, insertPosition.nextSibling);
```

### 使用`media`属性
将link元素的media属性设置为用户浏览器不匹配的媒体类型（或媒体查询），如`media="print"`，甚至可以是完全不存在的类型`media="noexist"`。

对浏览器来说，如果样式表不适用于当前媒体类型，其优先级会被放低，会在不阻塞页面渲染的情况下再进行下载。

而在文件加载完成之后，将media的值设为screen或all，从而让浏览器开始解析CSS。如下所示：
```js
<link rel="stylesheet" href="mystyles.css" media="noexist" onload="this.media='all'">
```

参考[<link>标签](../html/Link_Tag.md)

### 使用`preload`属性
使用`<link>`标签的 rel 属性，将值指定为`"preload"`。

> 关键字 `preload` 作为元素 `<link>` 的属性 rel 的值，表示用户十分有可能需要在当前浏览中加载目标资源，所以浏览器必须预先获取和缓存对应资源。

**注意**：preload 属性值需要搭配 `as` 属性指定类型，否则可能会变成普通的XHR请求，示例如下：
```html
<link rel="preload" href="mystyles.css" as="style" onload="this.rel='stylesheet'">
```

关于`<link>`元素，参考[<link>标签](../html/Link_Tag.md)


## 文件压缩
使用 webpack 等工具压缩 CSS 文件体积


## 有选择地使用选择器
CSS选择器的匹配是**从右向左**进行的，这一策略导致了不同种类的选择器之间的性能也存在差异。

相比于`#markdown-content-h3`，显然使用`#markdown .content h3`时，浏览器生成渲染树（render-tree）所要花费的时间更多。因为后者需要先找到DOM中的所有h3元素，再过滤掉祖先元素不是`.content`的，最后过滤掉`.content`的祖先不是`#markdown`的。

如果嵌套的层级更多，页面中的元素更多，那么匹配所要花费的时间代价自然更高。

提高CSS性能的几点可行建议：
- 保持简单，不要使用嵌套过多过于复杂的选择器。
- **通配符**和**属性选择器**效率最低，需要匹配的元素最多，尽量避免使用。
- 不要使用类选择器和ID选择器修饰元素标签，如 `h3#markdown-content` ，这样多此一举，还会降低效率。
- 不要为了追求速度而放弃可读性与可维护性。

## 优化重排与重绘
参考：[回流与重绘](../browser/Reflow_Repaint.md)

### 减少重排（reflow）
- 常见的会导致重排的操作：
- 改变 font-size 和 font-family
- 改变元素的内外边距
- 通过JS改变CSS类
- 通过JS获取DOM元素的位置相关属性（如width/height/left等）
- CSS伪类激活
- 滚动滚动条或者改变窗口大小


### 避免不必要的重绘
当元素的外观（如color，background，visibility等属性）发生改变时，会触发重绘。

举例：滚动时禁用 hover 事件

### 不要使用 `@import`
使用`@import` 引入CSS会影响浏览器的并行下载。

使用 `@import` 引用的CSS文件只有在引用它的那个css文件被下载、解析之后，浏览器才会知道还有另外一个css需要下载，这时才去下载，然后下载后开始解析、构建render tree等一系列操作。这就导致浏览器无法并行下载所需的样式文件。
