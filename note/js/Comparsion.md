# JavaScript基础 - 比较
## 字符串比较
JS在比较字符串时会按字典顺序逐个字符进行比较，类似两个数字从最高位开始比。
```js
alert( 'Z' > 'A' ); // true
alert( 'Glow' > 'Glee' ); // true
alert( 'Bee' > 'Be' ); // true
```
以上的字典顺序实际上是Unicode编码顺序，在这个顺序中，同一个字母的小写比大写要大

## 不同类型比较
对不同类型比较时，JS会转换为数字再比较
```js
console.log("2" > 1); //true
console.log(false == 0); // true
console.log(false == "0"); // true
console.log(1 != "1"); // false
```

## 严格相等
使用三等号`===`可以同时对比类型和值，保证比较不会被自动类型转换所干扰。
同样的，对于不等于`!=`也有严格不等于`!==`。

## `==` 的比较规则
== 如果两者类型不同，首先需要进行类型转换。具体流程如下:

1. 首先判断两者类型是否相同，如果相等，判断值是否相等；如果类型不同，进行类型转换
2. 判断比较的是否是 null 或者是 undefined, 如果是, 返回 true .
3. 判断两者类型是否为 string 和 number, 如果是, 将字符串转换成 number
4. 判断其中一方是否为 boolean, 如果是, 将 boolean 转为 number 再进行判断
5. 判断其中一方是否为 object 且另一方为 string、number 或者 symbol , 如果是, 将 object 转为原始类型再进行判断

根据转换规则，对于下面例子，该表达式的变化如下：
```js
console.log([] == ![]); // true
```
1. `[] == false`；这一步由 `!` 操作符进行，因为`!`优先级高于`==`，且数组是个对象，转换为 boolean 后为 true，再取反变成了 false
2. `[] == 0`；根据规则，将 `false` 转换为数字，即为 0；
3. `"" == 0`；数组的 toPrimitive 方法将其转换为一个空字符串
4. `0 == 0`；根据规则，将空字符串转换为 0
5. 0 和 0 当然相等了，结果为 true。

转换规则也可以参考这个表格：[JavaScript中的相等性判断 - 非严格相等](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness#%E9%9D%9E%E4%B8%A5%E6%A0%BC%E7%9B%B8%E7%AD%89)

## 对 null 和 undefined 比较
非严格比较时会判定相等，但是用大于小于比较时则会有诡异情况。

对于null有以下情况：
```js
alert( null > 0 );  // (1) false
alert( null == 0 ); // (2) false
alert( null >= 0 ); // (3) true
```
对于undefined：
```js
alert( undefined > 0 ); // false (1)
alert( undefined < 0 ); // false (2)
alert( undefined == 0 ); // false (3)
```
