# JavaScript基础 - 遍历器

## Iterator

`Iterator`是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 主要供 `for-of` 循环消费，这是ES6新增的语法。

### 具有接口的对象

原生具备 Iterator 接口的数据结构如下。

- String
- Array
- Map
- Set
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

### 遍历过程

Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的next方法，直到它指向数据结构的结束位置。

每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

## 场景：将对象转换为可以通过 for-of 循环遍历键值对的对象

对象结构如下：

```js
const person = {
  name: "Alice",
  age: 25,
  gender: "female",
};
```

为这个对象增加 Iterator 接口：

```js
const person = {
  name: "Alice",
  age: 25,
  gender: "female",

  // 部署 Symbol.iterator 接口
  // function* 是 Generator 的最佳实践
  [Symbol.iterator]: function* () {
    // 获取对象自身的所有键
    const keys = Object.keys(this);

    // 遍历键，并使用 yield 返回 [key, value]
    for (const key of keys) {
      yield [key, this[key]];
    }
  },
};
```

> [Symbol.iterator] 是ES6语法计算属性名，可以把方括号里的计算结果直接作为属性名，例如：
>
> ```js
> // --- 老写法 (ES5) ---
> const propName = "age";
> const person = {};
>
> // 必须在对象定义之后，用 [] 赋值
> person[propName] = 25;
>
> // --- 新写法 (ES6) ---
> const propName = "age";
>
> const person = {
>   name: "Alice",
>   [propName]: 25, // 这里的 Key 会被解析为 "age"
> };
> ```
