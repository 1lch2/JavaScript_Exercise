# CSS 基础 - 伪元素，伪类
## 区别
### 定义
- 伪类

  定义的是被选择元素的某种状态。
  
  常见的伪类有 :hover，:active，:focus，:visited，:link，:not，:first-child，:last-child等等。

- 伪元素

  不存在于DOM树中的虚拟元素，它们可以像正常的html元素一样定义css，但无法使用JavaScript获取。
  
  常见伪元素有 ::before，::after，::first-letter，::first-line等等。

### 使用
CSS3 中规定伪元素使用双冒号`::`，伪类使用单冒号`:`。
但为了兼容，都可以使用单冒号表示。

## 伪类
### 条件伪类
- `:lang()`：基于元素语言来匹配页面元素；
- `:dir()`：匹配特定文字书写方向的元素；
- `:has()`：匹配包含指定元素的元素；
- `:is()`：匹配指定选择器列表里的元素；
- `:not()`：用来匹配不符合一组选择器的元素；

### 行为伪类

- `:active`：鼠标激活的元素；
- `:hover`：鼠标悬浮的元素；
- `::selection`：鼠标选中的元素；

### 状态伪类

- `:target`：当前锚点的元素；
- `:link`：未访问的链接元素；
- `:visited`：已访问的链接元素；
- `:focus`：输入聚焦的表单元素；
- `:required`：输入必填的表单元素；
- `:valid`：输入合法的表单元素；
- `:invalid`：输入非法的表单元素；
- `:in-range`：输入范围以内的表单元素；
- `:out-of-range`：输入范围以外的表单元素；
- `:checked`：选项选中的表单元素；
- `:optional`：选项可选的表单元素；
- `:enabled`：事件启用的表单元素；
- `:disabled`：事件禁用的表单元素；
- `:read-only`：只读的表单元素；
- `:read-write`：可读可写的表单元素；
- `:blank`：输入为空的表单元素；
- `:current()`：浏览中的元素；
- `:past()`：已浏览的元素；
- `:future()`：未浏览的元素；

### 结构伪类

- `:root`：文档的根元素；
- `:empty`：无子元素的元素；
- `:first-letter`：元素的首字母；
- `:first-line`：元素的首行；
- `:nth-child(n)`：元素中指定顺序索引的元素；
- `:nth-last-child(n)`：元素中指定逆序索引的元素；；
- `:first-child`：元素中为首的元素；
- `:last-child`：元素中为尾的元素；
- `:only-child`：父元素仅有该元素的元素；
- `:nth-of-type(n)`：标签中指定顺序索引的标签；
- `:nth-last-of-type(n)`：标签中指定逆序索引的标签；
- `:first-of-type	`：标签中为首的标签；
- `:last-of-type`：标签中为尾标签；
- `:only-of-type`：父元素仅有该标签的标签；

## 伪元素

- `::before`：在元素前插入内容；
- `::after`：在元素后插入内容；

### 用法
before 将在被选择元素前插入元素， after 则是在之后。

伪元素添加了一个页面中没有的元素，但只是从视觉效果上添加了，不是在文档树中添加。

若要向其中添加内容，可以使用 `content`属性。如下例将会在标题前后插入一对引号：
```html
<p>Title</p>

<style>
p:before {
  content: open-quote;
}
p:after {
  content: close-quote;
}
</style>
```

默认情况下，生成的元素是一个内联级别的元素，因此当我们要指定高度和宽度时，必须首先使用 `display:block` 声明将其定义为一个块元素。