# React - 列表
通过遍历创建列表元素时必须提供 key 属性。通常使用数据中的 id 作为 key

```jsx
function TodoList(props) {
  const todos = props.todos;
  const todoItems = todos.map((todo) =>
    <li key={todo.id}>
        {todo.text}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
```

## 不能用索引作为 key 的值
当虚拟 DOM 发生变化时，变化前后用索引作为 key 值的节点会按照新的顺序作为 key。

这种情况下，原本可以被复用的组件，会因为React diff 算法发现组件类型不同而直接删除重建。

只有当 key 使用唯一值时，才能对每个节点做到复用
