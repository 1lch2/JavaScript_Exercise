# Generator （生成器）

Generator 允许定义一个潜在的无限数据结构，并且只有在需要时才会计算值。

语法：`*function`。

调用生成器函数时，它不会立即执行代码，而是返回一个特殊的迭代器对象，称为生成器。通过调用生成器的 next() 方法，可以逐步执行生成器函数，直到遇到 `yield` 关键字。

Generator 是 Iterator 的子类，类似的可以用for-of循环遍历，例如：

```js
const foo = function* () {
  yield "a";
  yield "b";
  yield "c";
};

let str = "";
for (const val of foo()) {
  str = str + val;
}

console.log(str); // abc
```

类似 Iterator，可以直接调用 next() 函数逐步执行：

```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}
const gen = generator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
```

## 实例方法

### next()

返回 yield 表达式生成的值。上面已经展示过了

### return()

在当前位置插入 return 语句，结束生成器函数并执行清理任务

### throw()

在当前位置插入 throw 语句，抛出错误
