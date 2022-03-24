# CSS基础 - flex布局
## 定义
Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

任何一个容器都可以指定为 Flex 布局。
```css
.box {
  display: flex;
}
```

行内元素也可以使用 Flex 布局。

```css
.box{
  display: inline-flex;
}
```

**设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。**

## 基本概念
采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。

它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

容器默认存在两根轴：**水平的主轴**（main axis）和**垂直的交叉轴**（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。

项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。


TODO: note marker


## 容器属性


## 项目属性

### flex-grow
`flex-grow` 属性定义项目的放大比例，默认为 0 ，即如果存在剩余空间，也不放大。

如果所有项目的flex-grow属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

### flex
`flex` 属性是 `flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为 `0 1 auto`。后两个属性可选。

该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。

常用的样式值为 `flex: 1`，等于如下属性
```css
div {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
}
```

其他简写方式如下表所示：
|        简写      |       等同于      |
|:---------------:|:----------------:|
| `flex: initial` | `flex: 0 1 auto` |
| `flex: 0`       | `flex: 0 1 0%`   |
| `flex: none`    | `flex: 0 0 auto` |
| `flex: 1`       | `flex: 1 1 0%`   |
| `flex: auto`    | `flex: 1 1 auto` |


## 参考
- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [Flex 布局教程：实例篇](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
