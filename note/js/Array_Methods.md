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

## 数组索引
JavaScript**不允许**使用负数索引从后往前索引，但在某些数组方法中可以使用负数索引，例如上文的splice。

