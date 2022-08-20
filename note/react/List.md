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
