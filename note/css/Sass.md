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
  background-color: $globalColor
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

## 嵌套

## 继承

## 操作符



TODO: