# Sass - CSS 预处理器

## 变量

Sass 中的变量需要以`$`开头，变量值可以是字符串，数字值（带单位），颜色，布尔值，列表和`null`。

示例如下：

```scss
$length: 18px .container {
  width: $length;
}
```

变量也可以嵌套在字符串中，需要使用`${}`来包裹变量，类似模板字符串语法：

```scss
$side: left;

.rounded {
  border-#{$side}-radius: 5px;
}
```

### 作用域

类似 JS，SCSS 的变量也有作用域，可以简单理解为块级作用域。通过`!global`关键字可以将样式设置为全局作用域

```scss
$myColor: red;
h1 {
  $globalColor: blue !global;
  $myColor: green;
  color: $myColor;
}

p {
  color: $myColor;
  background-color: $globalColor;
}
```

编译后

```css
h1 {
  color: green;
}

p {
  color: red;
  background-color: blue;
}
```

### 赋值

Sass 中的变量和一般语言中类似，同一时间只能有一个值。

```scss
SCSS SYNTAX
$variable: value 1;
.rule-1 {
  value: $variable;
}

$variable: value 2;
.rule-2 {
  value: $variable;
}
```

对应 CSS 如下：

```css
.rule-1 {
  value: value 1;
}

.rule-2 {
  value: value 2;
}
```

## 嵌套

Sass 可以像 HTML 标签一样嵌套规则

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

对应 CSS 如下：

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav li {
  display: inline-block;
}
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

除此之外有相同前缀的属性也可以嵌套，不过注意属性前缀后面有个冒号：

```scss
font: {
  family: Helvetica, sans-serif;
  size: 18px;
  weight: bold;
}

text: {
  align: center;
  transform: lowercase;
  overflow: hidden;
}
```

对应 CSS 如下：

```scss
 {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  font-weight: bold;

  text-align: center;
  text-transform: lowercase;
  text-overflow: hidden;
}
```

## 模块

`@use` 会从另一个样式表中加载 mixin，函数和变量。

```scss
// style/base.scss
.base {
  color: white;
}

// style/bg.scss
.bg {
  background-color: black;
}

// style.scss
@use "style/base";
@use "style/bg";
```

编译后如下：

```css
.base {
  color: white;
}
.bg {
  background-color: black;
}
```

### 加载成员

可以通过 `<namespace>.<variable>, <namespace>.<function>()`或者`@include <namespace>.<mixin>()`两种方式来从其他模块调用变量，函数或者 minxin。

通过`@use`加载的成员只在他们被加载的样式表中可见，如果其他样式表也需要加载这些变量或者函数，那就需要再写对应的 `@use` 规则。

另外，通过`@forward` 可以一次性从一个文件中加载多个成员。

示例如下啊：

```scss
// src/_corners.scss
$radius: 3px;

@mixin rounded {
  border-radius: $radius;
}

// style.scss
@use "src/corners";

.button {
  @include corners.rounded;
  padding: 5px + corners.$radius;
}
```

编译后 CSS 如下：

```css
.button {
  border-radius: 3px;
  padding: 8px;
}
```

## 继承

Sass 通过`@extend` 来继承特定选择器对应的样式规则，语法为`@extend <selector>`，示例如下：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;

  &--serious {
    @extend .error;
    border-width: 3px;
  }
}
```

这里借助父选择器让 `.error-serious` 继承了`.error` 的样式，并额外添加了边框宽度的样式。编译后 CSS 如下：

```css
.error,
.error--serious {
  border: 1px #f00;
  background-color: #fdd;
}
.error--serious {
  border-width: 3px;
}
```

> 注意：`@extend` 在样式表编译的最后解析，在上述情况中，父选择器解析完成后才会构造`.error-serious`，其他父选择器嵌套下的选择器不会受到影响。

## 操作符

### 数学计算

加减乘除

```scss
@use "sass:math";

.container {
  display: flex;
}

article[role="main"] {
  width: math.div(600px, 960px) * 100%;
}

aside[role="complementary"] {
  width: math.div(300px, 960px) * 100%;
  margin-left: auto;
}
```

### 父选择器

在 Sass 中，`&`用来在嵌套选择器中选中外层的选择器，可以重用外层选择器来实现更复杂的方法，比如加伪类。

```scss
.alert {
  // 父选择器可以用来给外层选择器加上伪类
  &:hover {
    font-weight: bold;
  }

  // 也能用来在某些条件下为外层选择器控制样式，比如RTL布局时
  [dir="rtl"] & {
    margin-left: 0;
    margin-right: 10px;
  }

  // 甚至可以作为伪类选择器的参数
  :not(&) {
    opacity: 0.8;
  }
}
```

编译后 CSS：

```css
.alert:hover {
  font-weight: bold;
}
[dir="rtl"] .alert {
  margin-left: 0;
  margin-right: 10px;
}
:not(.alert) {
  opacity: 0.8;
}
```

父选择器也可以用来加后缀

```scss
.accordion {
  max-width: 600px;
  margin: 4rem auto;
  width: 90%;
  font-family: "Raleway", sans-serif;
  background: #f4f4f4;

  &__copy {
    display: none;
    padding: 1rem 1.5rem 2rem 1.5rem;
    color: gray;
    line-height: 1.6;
    font-size: 14px;
    font-weight: 500;

    &--open {
      display: block;
    }
  }
}
```

TODO:
