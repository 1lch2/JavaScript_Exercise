# CSS基础 - 长度和单位
## 数值类型
- `<integer>`：整数
- `<number>`：小数。包括整数
- `<dimension>`：带单位的的`<number>`。如45deg、5s或10px。
    `<dimension>`是一个伞形类别，包括`<length>`、`<angle>`、`<time>`和`<resolution>`类型。
- `<percentage>`：百分数。

## 长度
最常见的数字类型是`<length>`，例如10px(像素)或30em。CSS中有两种类型的长度——相对长度和绝对长度。

### 绝对长度
| 单位 | 名称         | 等价换算            |
|------|--------------|---------------------|
| cm   | 厘米         | 1cm = 96px/2.54     |
| mm   | 毫米         | 1mm = 1/10th of 1cm |
| Q    | 四分之一毫米 | 1Q = 1/40th of 1cm  |
| in   | 英寸         | 1in = 2.54cm = 96px |
| pc   | 十二点活字   | 1pc = 1/16th of 1in |
| pt   | 点           | 1pt = 1/72th of 1in |
| px   | 像素         | 1px = 1/96th of 1in |

### 相对长度
| 单位 | 相对于                       |
|------|----------------------------|
| em   | 在 font-size 中使用是相对于父元素的字体大小，在其他属性中使用是相对于自身的字体大小，如 width |
| ex   | 字符“x”的高度               |
| ch   | 数字“0”的宽度               |
| rem  | 根元素的字体大小             |
| lh   | 元素的line-height          |
| vw   | 视窗宽度的1%                |
| vh   | 视窗高度的1%                |
| vmin | 视窗较小尺寸的1%             |
| vmax | 视图大尺寸的1%              |

### em

em 单位的意思是“父元素的字体大小”。

每个浏览器都会给 HTML 根元素 html 设置一个默认的 font-size，而这个值通常是 16px。

### rem

rem单位的意思是“根元素的字体大小”。

rem(root em) 和 em 一样，也是一个相对长度单位，不过 rem 相对的是 HTML 的根元素 html。

rem 由于是基于 html 的 font-size 来计算，所以通常用于自适应网站或者 H5 中。

### vw/vh
w 和 vh 分别是相对于屏幕窗口宽度和高度而言的长度单位：
- 1vw = 视口宽度均分成 100 份中 1 份的长度；
- 1vh = 视口高度均分成 100 份中 1 份的长度；

在 JS 中 有如下换算规则：
```js
100vw == window.innerWidth
100vh == window.innerHeight
```


### 百分比

在许多情况下，百分比与长度的处理方法是一样的。百分比的问题在于，它们总是相对于其他值设置的。例如，如果将元素的字体大小设置为百分比，那么它将是元素父元素字体大小的百分比。如果使用百分比作为宽度值，那么它将是父值宽度的百分比。

## 颜色
- 十六进制RGB值
- RGB和RGBA值

## 函数
`calc()` 函数可以在CSS中进行简单的计算。如下例中，使用calc()使框宽为20% + 100px。20%是根据父容器.wrapper的宽度来计算的，因此如果宽度改变，它也会改变。

```html
<div class="wrapper">
  <div class="box">My width is calculated.</div> 
</div>
```
```css
.wrapper {
  width: 400px;
}

.box {
  width: calc(20% + 100px);
}
```
