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
