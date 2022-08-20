# React 事件处理
## 与 DOM 元素事件的区别
### 命名 & 传参
- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

对比示例如下：
```html
<!-- DOM 元素上的事件 -->
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

```jsx
// React 事件
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

### 阻止默认行为
React 中不能使用返回 false 的方式阻止默认行为，必须显式地调用 `preventDefault`。例如，传统的 HTML 中阻止链接默认打开一个新页面，可以这样写：
```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

在 React 中是这样的：
```jsx
function ActionLink() {
  // 这里的 e 是一个合成事件
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

关于合成事件，参考 [合成事件](./Synthentic_Event.md)

### 添加监听器
DOM元素需要使用 addEventListener 来添加事件监听。在React中只需要在元素渲染时添加监听。

当使用 ES6 class 语法定义一个组件的时候，通常的做法是将事件处理函数声明为 class 中的方法。例如，下面的 Toggle 组件会渲染一个让用户切换开关状态的按钮：

```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

如果不绑定 this，则可以使用箭头函数，如下所示：
```jsx
render() {
  // 此语法确保 `handleClick` 内的 `this` 已被绑定。
  return (
    <button onClick={() => this.handleClick()}>
      Click me
    </button>
  );
}
```

若要为回调传递参数，也需要使用绑定 this 或箭头函数的形式，如下所示：
```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

