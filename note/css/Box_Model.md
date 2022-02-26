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

## 叠加原则
### 行内元素 
margin-top/margin-bottom对于上下元素无效，margin-left/margin-right有效

### 块级元素
对于相邻的块级元素margin-top和margin-bottom两者叠加按照一定的规则：
- 都是正数 `margin` 值取最大值
- 都是负数 `margin` 值取最小值
- 两者正负相反，`margin` 值取两者之和
