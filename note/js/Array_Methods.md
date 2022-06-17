# JavaScript基础教程 - 数组方法
## 增删元素
### 添加元素
- `array.push(...items)`：向末尾添加元素（可传入多个参数）
- `arrat.unshift(...items)`：向开头添加元素（可传入多个参数）

### 删除元素
- `array.pop()`：删除末尾元素并返回
- `array.shift()`：删除开头元素并返回

### splice
`array.splice(start, [deleteCount, el1, ..., eln])`。
splice方法从索引 start 开始修改 array：删除 deleteCount 个元素并在当前位置插入 elem1, ..., elemN。最后返回已被删除元素的数组。
```js
let arr = ["I", "study", "JavaScript", "right", "now"];

// 删除数组的前三项，并使用其他内容代替它们
arr.splice(0, 3, "Let's", "dance"); 

// ["Let's", "dance", "right", "now"]
```

当deleteCount设为 0 时，splice可以添加元素.

```js
let arr = ["I", "study", "JavaScript"];

// 从索引 2 开始删除 0 个元素，然后插入新的数组元素
arr.splice(2, 0, "complex", "language"); 

// "I", "study", "complex", "language", "JavaScript"
```

### 数组索引
JavaScript**不允许**使用负数索引从后往前索引，但在某些数组方法中可以使用负数索引，例如上文的splice。

## 修改数组元素
### map
map() 方法创建一个新数组并返回，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。

**注意：map 方法并不会修改原数组**

```js
var new_array = arr.map(function (currentValue, index, array) {
    // 为新数组返回的元素
}, thisArg);
```

回调参数：
- currentValue：数组中正在处理的当前元素。
- index：（可选）数组中正在处理的当前元素的索引。
- array：（可选）map 方法调用的数组。

map 方法会给原数组中的每个元素都按顺序调用一次 callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组。 

callback 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。对于使用`Array()`构造函数创建的数组，值全部为 undefined，直接调用 map 不会有结果，如下例所示：
```js
let arr = new Array(10).map((val, index) => index);
console.log(arr); // [undefined] x 10
```

正确操作是，使用 `Array.from()` 从新创建的数组构造新的数组后，再调用 map，如下所示：
```js
let arr = Array.from(new Array(10)).map((val, index) => index);
console.log(arr); // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

**经典面试题之parseInt**：

通常情况下，map 方法中的 callback 函数只需要接受一个参数，就是正在被遍历的数组元素本身。但这并不意味着 map 只给 callback 传了一个参数。这个思维惯性可能会让我们犯一个很容易犯的错误。

```js
["1", "2", "3"].map(parseInt);

// 输出
// [1, NaN, NaN]
```

`parseInt`在这里接受两个参数，而 map 传递三个参数，也就是 value 和 index 成为了 parseInt 的两个参数

```js
// parseInt(string, radix) -> map(parseInt(value, index))
/*  first iteration (index is 0): */ parseInt("1", 0); // 1
/* second iteration (index is 1): */ parseInt("2", 1); // NaN
/*  third iteration (index is 2): */ parseInt("3", 2); // NaN
```

解决方案如下：
```js
// 使用辅助函数确定第二个参数
function returnInt(num) {
    return parseInt(num, 10);
}
["1", "2", "3"].map(returnInt);

// 同上，但是改用了箭头函数
["1", "2", "3"].map(str => parseInt(str));

// 干脆不用 parseInt
// 不过这种方式在输入非整数字符串时不会返回整数
["1", "2", "3"].map(Number);
```

### fill
fill() 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。fill 方法会修改数组并返回被修改的数组。

当 fill 方法传入的参数为引用类型时，会导致都执行同一个引用类型，如下所示：
```js
let arr = new Array(3).fill({});
arr[0].a = 1;
console.log(arr);

// [{"a": 1}, {"a": 1}, {"a": 1}]
```

正确操作如下：
```js
let arr = new Array(3).fill(0).map(val => new Object());
// 或者
let arr = new Array(3).fill(0).map((val) => { return {} });

arr[0].a = 1;
console.log(arr);

// [{"a": 1}, {}, {}]
```
