# undefined 与 null 的差别
## undefined
使用`var`或`let`声明了变量而又没有初始化时，就相当于给变量赋值为`undefined`。

同时，对于完全没有声明过的变量，它的值也是`undefined`，但是只能用`typeof`来判断。

参考如下例子：
```js
let v1;
let v2 = undefined;
// let v3 = "not existed";

console.log(v1 === undefined); // true
console.log(v2 === undefined); // true
console.log(v3 === undefined); // Uncaught ReferenceError
console.log(typeof v3); // undefined
```

> 虽然未初始化变量会被自动赋予 undefined，但是仍然建议再声明时就初始化，这样当typeof 返回 undefined时就能知道时变量未声明而不是声明了没有初始化。

由于`undefined`是个假值（对应false），因此条件判断时需要注意以下情况。
```js
let message; // 声明了但是没有初始化
// let age;  // 没有声明

if (message) {
    // 不会执行
}

if (!message) {
    // 会执行
}

if (age) {
    // 报错
}
```

## null

null 在逻辑上表示一个空对象指针，这也是`typeof null` 会返回`object`的原因。
> 在定义将来要保存对象值的变量时，建议用null来初始化，这样只要检查变量值是否为null就能知道它后来是否被重新赋予了一个对象的引用。

undefined 值由 null 派生而来，因此他们表面上相等，如下面例子：
```js
console.log(null == undefined); // true
```
类似undefined，null也是个假值（对应false）。