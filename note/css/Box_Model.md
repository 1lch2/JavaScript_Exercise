# CSS基础 - 盒子模型
## 定义
在 CSS 中任何元素都可以看成是一个盒子，而一个盒子是由 4 部分组成的：内容（content）、内边距（padding）、边框（border）和外边距（margin）。

盒模型有 2 种：标准盒模型和 IE 盒模型，本别是由 W3C 和 IExplore 制定的标准。

标准盒模型认为：

盒子的实际尺寸 = 内容（设置的宽或高） + 内边距 + 边框
```css
.box {
    width: 200px;
    height: 200px;
    padding: 10px;
    border: 1px solid #eee;
    margin: 10px;
}
```
所以 .box 元素内容的宽度就为 200px，而实际的宽度则是 

width + padding-left + padding-right + border-left-width + border-right-width = 200 + 10 + 10 + 1 + 1 = 222。

在 CSS3 中新增了一个属性 `box-sizing`，允许开发者来指定盒子使用什么标准，它有 2 个值：
- `content-box`：标准盒模型；
- `border-box`：IE 盒模型；

## margin
外边距是盒子周围一圈看不到的空间。它会把其他元素从盒子旁边推开。 外边距属性值可以为正也可以为负。设置负值会导致和其他内容重叠。无论使用标准模型还是替代模型，外边距总是在计算可见部分后额外添加。

### 行内元素 
margin-top/margin-bottom对于上下元素无效，margin-left/margin-right有效

### 块级元素
对于相邻的块级元素margin-top和margin-bottom两者叠加按照一定的规则：
- 都是正数 `margin` 值取最大值
- 都是负数 `margin` 值取最小值
    > margin 取负数时会往反方向拓展。例如，设置了 `margin-top: -100px` ，则对应的元素边距相比父元素会向上拓展 100px
- 两者正负相反，`margin` 值取两者之和

## padding
内边距位于边框和内容区域之间，通常用于将内容推离边框。

与外边距不同，padding 不能为负数值。应用于元素的任何背景都将显示在内边距后面。


