# JavaScript基础 - 类型转换
大多数时候，JS的运算符和函数会自动将传入的值转换为正确的类型。某些情况下还是需要显式转换类型。

## 字符串转换
`alert(value)`会自动将`value`转换为字符串类型，也可以通过显式调用`String(value)`来转换。
```js
let value = true;
console.log(typeof value); // boolean

value = String(value);
console.log(typeof value); // string
```

## 数字转换
在算数函数和表达式中会自动进行数字类型转换。举个栗子：
```js
console.log("6"/"2"); // 3
console.log(typeof("2" * "3")) // number
```
也可以通过`Number(str)`显式地将字符串型的数字转换为数字型的数字。**但是**，如果传入的字符串不包含有效数字则会返回`NaN`。具体转换规则如下：
| 传入值      | 返回值 |
| ----------- | ----------- |
| undefined      | NaN       |
| null   | 0        |
| true 或 false   | 1 或 0        |
对于传入String类型的变量，规则如下：
1. 首先去除字符串首尾的空格，读取剩下的纯数字字符串中的数字
2. 若剩余字符串为空，即整个字符串都是空格，则返回0
3. 若剩余字符串不包含数字，则返回NaN
举例：
```js
Number("1"); // 1
Number("   "); // 0
Number(" s s"); // NaN
```

## 布尔型转换
类似Java，在判断表达式中可以自动转换表达式结果，也可以通过`Boolean(value)`来显式转换。规则如下：
- “空值”被转换为 false。包括数字零，空字符串，null，undefined，NaN。
- 除此之外其他值为 true。
举例说明：
```js
Boolean(""); // false
Boolean("  "); // true

Boolean(1); // true；0以外数字同理
Boolean(0); // false

Boolean("0"); // true；常见陷阱
```

除了上述方法，还可以使用两个“非”运算符来将一个值转换为布尔类型。因为一个`!`会将值转换为布尔型并取反，使用`!!`就可以实现转换的效果。
```js
console.log(!!""); // false
console.log(!!"non-empty"); // true
```