# React 组件
## 函数组件（无状态组件）
函数或无状态组件是一个纯函数，它可接受接受参数，并返回react元素。

通过使用 Hook 可以为函数组件添加状态和生命周期。

示例如下：
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

## 类组件
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## 受控组件
受控组件是在 React 中处理输入表单的一种技术。

可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 `setState()`来更新。

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

## 非受控组件
使用Ref来处理表单数据。在非受控组件中，Ref用于直接从DOM访问表单值，而不是事件处理程序。
我们使用Ref构建了相同的表单，而不是使用React状态。我们使用 `React.createRef()` 定义Ref并传递该输入表单并直接从 handleSubmit 方法中的DOM访问表单值。

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    // 不适用 handleChange 而是使用 ref 来访问 input 的值
    this.input = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} ref={this.input} />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

关于 Refs：参考 [React - Ref](./Ref.md)

## 容器组件
容器组件是处理获取数据、订阅 redux 存储等的组件。它们包含展示组件和其他容器组件，但是里面从来没有html。


## 高阶组件
高阶组件是将组件作为参数并生成另一个组件的组件

具体参见 [高阶组件](./Higher_Order_Component.md)

## 函数组件与类组件的优劣
### 类组件的问题
- 忘记 this 绑定带来的问题
- 代码量相比函数组件较多
- 过于臃肿不便于拆分

### 函数组件的问题
- 缺少部分生命周期：
  - getDerviedStateFromProps：函数组件无法做到根据 props 更新 state，目前一定会触发一次重渲染。
  - componentDidCatch，static getDerivedStateFromError：函数组件目前没有对应的错误处理 hook

