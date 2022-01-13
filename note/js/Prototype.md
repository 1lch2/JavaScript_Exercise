# JavaScript基础 - 原型和继承链

## 获得对象的精确类型
```js
// 构造函数
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

let node = new TreeNode(0);
// 获得构造函数的名称
let typeofNode = node.constructor.name; // 'TreeNode'
```