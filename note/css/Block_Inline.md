# CSS基础 - 内联元素，块级元素
## 块级元素（block）
块级元素占据其父元素（容器）的整个空间，默认按纵向从上到下排列
### 常见块级元素
```html
<div></div> 
<h1>...<h6> 
<ol></ol>
<ul></ul>
<p></p> 
<dd></dd> 
<dl></dl> 
<form></form> 
<table></table> 
<hr> 
<header></header> 
<footer></footer> 
<section></section> 
<audio></audio> 
<canvas></canvas> 
<address></address> 
<article></article> 
<video></video>
...
```

### 特点
1. 每个块级元素都从新的一行开始，并且其后的元素也另起一行。
2. 元素的 width，height 以及 margin， padding都可设置。
3. 元素**宽度**在不设置的情况下，是它本身父容器的100%（和父元素的宽度一致），除非设定一个宽度。

## 内联元素（inline）
内联元素（或者叫行内元素），只占据标签所在的空间，默认横向从左到右排列。

### 常见内联元素
```html
<a></a> 
<span></span>
<label></label>
<img> 
<abbr></abbr> 
<em></em> 
<br>
<script></script> 
<strong></strong> 
```

### 特点
1. 内联盒子不会产生换行。
2. width 和 height 属性将不起作用。
3. 垂直方向的 padding、 margin 以及 border 会生效，但是不会推开其他 inline 元素
    > 若给一个 inline 元素设置了垂直方向上的 padding 或 margin，并让边框可见，则可以看到边框随着边距变化，但是临近的 block 元素并不会在垂直方向上移动。
4. 水平方向的 padding、 margin 以及边框会被应用且会把其他处于 inline 状态的盒子推开。

