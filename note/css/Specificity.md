# CSS基础 优先级
## 计算规则
优先级就是分配给指定的 CSS 声明的一个权重，它由 匹配的选择器中的 每一种选择器类型的 数值 决定。

为了记忆，权重分成如下几个等级，数值越大的权重越高：

- 1 0 0 0 0：`!important`
- 0 1 0 0 0：内联样式

    ```html
    <element style="inline-style">
    ```
- 0 0 1 0 0：ID 选择器

    `#id`
- 0 0 0 1 0：类选择器、伪类选择器、属性选择器

    - `.class`
    - `:pseudo`
    - `[attribute]`
- 0 0 0 0 1：元素选择器、伪元素选择器

    - `element`
    - `::pseudoElement`
- 0 0 0 0 0：通配选择器、后代选择器、兄弟选择器；

    - `*`
    - ` `(空格)
    - `+`, `~`

可以看到内联样式（通过元素中 style 属性定义的样式）的优先级大于任何选择器；

而给属性值加上 `!important` 又可以把优先级提至最高

## 基于形式的优先级
优先级是基于选择器的形式进行计算的。在下面的例子中，尽管选择器*[id="foo"] 选择了一个ID，但是它还是作为一个属性选择器来计算自身的优先级。

```css
*#foo {
  color: green;
}

*[id="foo"] {
  color: purple;
}
```
```html
<p id="foo">I am a sample text.</p> <!--绿色文字-->
```

## 直接添加样式
为目标元素直接添加样式，永远比继承样式的优先级高，无视优先级的遗传规则。

```css
#parent {
  color: green;
}

h1 {
  color: purple;
}
```

```html
<html>
  <body id="parent">
    <h1>Here is a title!</h1> <!--紫色文字-->
  </body>
</html>
```