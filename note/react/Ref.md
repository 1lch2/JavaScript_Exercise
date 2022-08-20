# React - Ref
在典型的 React 数据流中，props 是父组件与子组件交互的唯一方式。要修改一个子组件，你需要使用新的 props 来重新渲染它。

但是，在某些情况下，你需要在典型数据流之外强制修改子组件。被修改的子组件可能是一个 React 组件的实例，也可能是一个 DOM 元素。对于这两种情况，React 都提供了解决办法。

## 使用场景
- 管理焦点，文本选择或媒体播放。
- 触发强制动画。
- 集成第三方 DOM 库。

## 创建 Refs
Refs 是使用 `React.createRef()` 创建的，并通过 ref 属性附加到 React 元素。在构造组件时，通常将 Refs 分配给实例属性，以便可以在整个组件中引用它们。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

## 访问 Refs
当 ref 被传递给 render 中的元素时，对该节点的引用可以在 ref 的 current 属性中被访问。
```jsx
const node = this.myRef.current;
```

ref 的值根据节点的类型而有所不同：
- 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性。
- 当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性。

**不能在函数组件上使用 ref 属性，因为他们没有实例**。

### 使用 ref 获取普通 HTML元素的 DOM
示例如下：
```jsx
class Child extends Component{
    constructor(){
        super();
        this.myDiv = React.createRef();
    }
    componentDidMount(){
        console.log(this.myDiv.current);
    }
    render(){
        return (
            <div ref={this.myDiv}>ref获取的dom元素</div>
        )
    }
}
```

### 使用 ref 获取子组件
示例如下：
```jsx
class Child extends Component{
    constructor(){
        super();
    }
    componentDidMount() {}
    render(){
        return <div>子组件</div>
    }
}

class Parent extends Component{
    constructor() {
        super();
        this.myChild = React.createRef();
    }
    componentDidMount() {
        console.log(this.myChild.current);//获取的是Child组件

    }
    render() {
        return <Child ref={this.myChild} />
    }
}
```

### 使用 ref 获取子组件中的 DOM
```jsx
class Child extends Component{
    constructor(){
        super();
    }
    componentDidMount() {}
    render(){
        return (
            // 为子组件添加 ref
            <div ref={this.props.myRef}>子组件</div>
        )
    }
}

class Parent extends Component{
    constructor(){
        super();
        this.myChild = React.createRef();
    }
    componentDidMount(){
        console.log(this.myChild.current);
    }
    render(){
        return <Child myRef={this.myChild} />
    }
}
```

## 回调 ref
React 也支持另一种设置 refs 的方式，称为“回调 refs”。它能助你更精细地控制何时 refs 被设置和解除。

不同于传递 createRef() 创建的 ref 属性，你会传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问。

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // 使用原生 DOM API 使 text 输入框获得焦点
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // 组件挂载后，让文本框自动获得焦点
    this.focusTextInput();
  }

  render() {
    // 使用 `ref` 的回调函数将 text 输入框 DOM 节点的引用存储到 React
    // 实例上（比如 this.textInput）
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React 将在组件挂载时，会调用 ref 回调函数并传入 DOM 元素，当卸载时调用它并传入 null。

也可以在组件间传递回调形式的 refs，就像你可以传递通过 React.createRef() 创建的对象 refs 一样。

## Ref 转发
Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。

下面的示例中，FancyButton 使用 React.forwardRef 来获取传递给它的 ref，然后转发到它渲染的 DOM button：
```jsx
// 3. React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
const FancyButton = React.forwardRef((props, ref) => (
  // 4. 向下转发该 ref 参数到 <button ref={ref}>，将其指定为 JSX 属性。
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>

  // 5. 当 ref 挂载完成，ref.current 将指向 <button> DOM 节点
));

// 1. 通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。
const ref = React.createRef();

// 2. 通过指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>。
<FancyButton ref={ref}>Click me!</FancyButton>;
```

这样，使用 FancyButton 的组件可以获取底层 DOM 节点 button 的 ref ，并在必要时访问，就像其直接使用 DOM button 一样。

