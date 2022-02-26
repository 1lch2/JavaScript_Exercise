# CSS基础 - 选择器
CSS 选择器规定了 CSS 规则会被应用到哪些元素上。

## 基本选择器
### 通用选择器（Universal selector）
选择所有元素。（可选）可以将其限制为特定的名称空间或所有名称空间。

语法：`* ns|* *|*`

在CSS3中,星号(*)可以和命名空间组合使用:

- `ns|*` - 会匹配ns命名空间下的所有元素
*|* - 会匹配所有命名空间下的所有元素
|* - 会匹配所有没有命名空间的元素


例子：* 将匹配文档的所有元素。
```html
<p class="warning">
  <span lang="en-us">A green span</span> in a red paragraph.
</p>
<p id="maincontent" lang="en-gb">
  <span class="warning">A red span</span> in a green paragraph.
</p>
```
```css
*[lang^=en]{color:green;}
*.warning {color:red;}
*#maincontent {border: 1px solid blue;}
```


### 元素选择器（Type selector）
按照给定的节点名称，选择所有匹配的元素。

语法：elementname

例子：input 匹配任何 `<input>` 元素。

### 类选择器（Class selector）
按照给定的 class 属性的值，选择所有匹配的元素。

语法：.classname

例子：.index 匹配任何 class 属性中含有 "index" 类的元素。

与以下属性选择器等价
```css
[class~="className"] {
  /* style */
}
```

### ID 选择器（ID selector）
按照 id 属性选择一个与之匹配的元素。需要注意的是，一个文档中，每个 ID 属性都应当是唯一的。

语法：#idname

例子：#toc 匹配 ID 为 "toc" 的元素。

与以下属性选择器等价：
```css
[id="idName"] {
  /* style */
}
```

### 属性选择器（Attribute selector）
按照给定的属性，选择所有匹配的元素。

语法：[attr] [attr=value] [attr~=value] [attr|=value] [attr^=value] [attr$=value] [attr*=value]

例子：[autoplay] 选择所有具有 autoplay 属性的元素（不论这个属性的值是什么）。
```css
/* 存在title属性的<a> 元素 */
a[title] {
  color: purple;
}

/* 存在href属性并且属性值 匹配 "https://example.org"的<a> 元素 */
a[href="https://example.org"] {
  color: green;
}

/* 存在href属性并且属性值 包含 "example"的<a> 元素 */
a[href*="example"] {
  font-size: 2em;
}

/* 存在href属性并且属性值 结尾 是".org"的<a> 元素 */
a[href$=".org"] {
  font-style: italic;
}

/* 存在class属性并且属性值 包含 "logo"的<a>元素 */
a[class~="logo"] {
  padding: 2px;
}
```

## 分组选择器

### 选择器列表（Selector list）
, 是将不同的选择器组合在一起的方法，它选择所有能被列表中的任意一个选择器选中的节点。

语法：A, B

示例：div, span 会同时匹配 `<span>` 元素和 `<div>`元素。
```css
/* 选择所有 <span> 和 <div> 元素 */
span, div {
  border: red 2px solid;
}
```

**缺点**：在选择器列表中如果有一个选择器不被支持，那么整条规则都会失效。



## 组合器
### 后代组合器（Descendant combinator）
`_`（空格）组合器选择前一个元素的后代节点。

语法：A B

例子：div span 匹配所有位于任意 `<div>` 元素之内的 `<span>` 元素。**不需要是直接子元素，选择直接子元素使用`>`**

### 直接子代组合器（Child combinator）
`>` 组合器选择前一个元素的直接子代的节点。

语法：A > B

例子：ul > li 匹配直接嵌套在 `<ul>` 元素内的所有 `<li>` 元素。
```css
div > span {
  /* 选择在div内的span元素，且span是div的直接子元素 */
  background-color: DodgerBlue;
}
```

### 一般兄弟组合器（General sibling combinator）
`~` 组合器选择兄弟元素，也就是说，后一个节点在前一个节点后面的任意位置，并且共享同一个父节点。位置无须紧邻，只须同层级。

语法：A ~ B

例子：p ~ span 匹配同一父元素下，`<p>` 元素后的所有 `<span>` 元素。
```css
p ~ span {
  color: red;
}
```
上方CSS作用与下方HTML
```html
<span>This is not red.</span>
<p>Here is a paragraph.</p>
<code>Here is some code.</code>
<span>And here is a span.</span> <!-- 这行字变成红色 -->
```

### 紧邻兄弟组合器（Adjacent sibling combinator）
`+` 组合器选择相邻元素，即后一个元素紧跟在前一个之后，并且共享同一个父节点。

语法：A + B

例子：h2 + p 会匹配所有紧邻在 `<h2>` (en-US) 元素后的 `<p>` 元素。



### 列组合器（Column combinator）
|| 组合器选择属于某个表格行的节点。
语法： A || B
例子： col || td 会匹配所有 <col> 作用域内的 <td> 元素。

## 伪选择器
### 伪类选择器
`:` 伪选择器支持按照未被包含在文档树中的状态信息来选择元素。
例子：`a:visited` 匹配所有曾被访问过的 `<a>` 元素。

**条件伪类**

- `:lang()`：基于元素语言来匹配页面元素；
- `:dir()`：匹配特定文字书写方向的元素；
- `:has()`：匹配包含指定元素的元素；
- `:is()`：匹配指定选择器列表里的元素；
- `:not()`：用来匹配不符合一组选择器的元素；


### 伪元素选择器
`::` 伪选择器用于表示无法用 HTML 语义表达的实体。
例子：`p::first-line` 匹配所有 `<p>` 元素的第一行。

- `::before`：在元素前插入内容；
- `::after`：在元素后插入内容；