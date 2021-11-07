# JavaScript基础
## 位置
1. 行内（inline）
   ```html
   <input type="button" onClick="alert('R U sure?')"/>
   ```
2. 嵌入（embedded）
    html4标准中，要求script标签必须有`type`属性，通常为`"text/javascript"`，现在已不再需要。script标签还有个`language`属性，现在已经没有意义。
    ```html
    <script type="text/javascript">
    alert("hello world!")
    </script>
    ```
3. 外部（external）
    ```html
    <script src="js/index.js"></script>
    ```
    **注意**：一个单独的script标签不能同时拥有`src` 属性和内部包裹的代码

## “use strict;”
在一个JS文件或一个函数内部的**最开头**写下这行字符串，那么会相对应地在整个文件或那个函数中启用严格模式。只要使用了严格模式，就没有其他办法取消。

如果在代码中使用了class或者module，则会默认启用严格模式。如果所有代码都写在class或者module内时，则无需在脚本顶部使用`"use strict";`。

非严格模式下，声明变量可以不用`let`或者`var`，直接通过赋值就可以创建变量。

## 变量
### 声明变量
JS允许在声明时不对变量进行赋值，也可以在一行内声明多个变量，甚至还可以将一行声明的变量拆到多行。
```js
let user = "linch97";
let id = 1, address = "belmore st.";
let state = "nsw",
    suburb = "burwood";
```

JS中的变量命名允许使用字母，数字，下划线和`$`，且首个字符不能为数字。

**注意，`-`不能被用于变量名**

### var和let对比
#### var没有块级作用域
var和let大体相同，但是var声明的变量没有块级作用域，在代码块外也可见。也就是说，var声明的变量只有函数作用域和全局作用域，没有块级作用域。
```js
function varTest() {
    if (true) {
        var test = "hello";
    }
    alert(test); // 这里可以正常运行
}

varTest();
alert(test); // 这里会报错提示test未定义（undefined）
```
#### var允许重新声明
let并不允许重复声明，但是var可以用来重复声明同一个变量，声明同时赋值的话会视为重新赋值。

#### var声明的变量可以在其声明语句前被使用
var声明的变量会在函数开头被定义，不论它在代码中处于什么位置（不考虑在嵌套函数中定义的情况）。虽然声明会提升到顶部，但是赋值操作并不会。
```js
function sayHi() {
    alert(greeting); // 此处会输出 undefined
    var grerting = "hello world";
}
```
上述例子中，用var声明变量会被提升到顶部，但是赋值依然保留在原地。

## 常量
### 声明常量
通常使用`const`来声明常量，并全大写来给常量命名。
```js
const ADDRESS = "NSW 2134, Belmore St. 6-8";
const express = require("express");
```

## 数据类型
[参考脚本](../../src/basics/basicTypes.js)
### Number
包括整数和浮点数，以及几个特殊数值：正负无穷和NaN。
#### Infinity
表示无穷大，可以通过除以0或者`Infinity`来使用。
#### NaN
代表计算错误，例如，对字符串和数字进行计算。NaN具有粘性，对NaN的任何进一步操作都会返回NaN。
```js
console.log("str" / 2); // NaN。如果换成 + 则会返回一个拼接后的字符串
```

### BigInt
BigInt用来表示大于$(2^{53}-1)$，或小于$-(2^{53}-1)$的整数。
通过在数字尾部加`n`的方式来创建BigInt值。
```js
const reallyLarge = 12345678901234567890n;
```
### String
使用单引号或者双引号可以创建字符串。
或者也可以使用反引号，它允许使用`${...}`将变量和表达式嵌入到字符串中。
```js
let name = "linch";
console.log(`hello ${name}`)
```

### Boolean
JS中的布尔值写作`true`和`false`。和在Java中类似，布尔值可以作为比较的结果。
```js
let isGreater = 4 > 1;
console.log(isGreater); // true
```

### null
`null`不属于以上任何类型，null值是一个单独类型。JS中的null并不表示对不存在对象的引用，它仅仅是一个空值或者值未知的特殊值。

### undefined
`undefined`同样也是自成类型的一个特殊值，当一个变量已被声明但未被赋值时，它的值就是undefined。

### object