# React - 合成事件
React 合成事件（SyntheticEvent）是 React 模拟原生 DOM 事件所有能力的一个事件对象，即浏览器原生事件的跨浏览器包装器。它根据 W3C 规范 来定义合成事件，兼容所有浏览器，拥有与浏览器原生事件相同的接口。

## 为什么使用合成事件
1. 进行浏览器兼容，实现更好的跨平台
    React 采用的是顶层事件代理机制，能够保证冒泡一致性，可以跨浏览器执行。React 提供的合成事件用来抹平不同浏览器事件对象之间的差异，将不同平台事件模拟合成事件。

2. 避免垃圾回收

    事件对象可能会被频繁创建和回收，因此 React 引入事件池，在事件池中获取或释放事件对象。即 React 事件对象不会被释放掉，而是存放进一个数组中，当事件触发，就从这个数组中弹出，避免频繁地去创建和销毁(垃圾回收)。

3. 方便事件统一管理和事务机制

## 合成时间与原生事件的区别
1. 事件名称命名方式不同

    原生事件命名为纯小写（onclick, onblur），而 React 事件命名采用小驼峰式（camelCase），如 onClick 等

2. 事件处理函数写法不同

    原生事件中事件处理函数为字符串，在 React JSX 语法中，传入一个函数作为事件处理函数。

3. 阻止默认行为方式不同

    在原生事件中，可以通过返回 false 方式来阻止默认行为，但是在 React 中，需要显式使用 preventDefault() 方法来阻止。

## 注册监听
React 采用了事件委托的机制，将事件监听放在了一个根元素上。在 React 17 之前，事件委托在 `document` 元素上，17 之后改为 app 上的 root 元素，防止因为同个项目中有多个 react 根元素造成冲突。

当 `ReactDOM.render` 被调用时，将会在创建根节点 Fiber 时（createRootImpl），对所有可监听的事件进行注册（listenToAllSupportedEvents）。

## 触发事件
在 React 中，“合成事件”会以事件委托（Event Delegation）方式绑定在组件最上层，并在组件卸载（unmount）阶段自动销毁绑定的事件。

触发顺序为先执行原生事件，再执行react事件，最后执行直接挂载在根元素/document上的事件。示例如下：
```jsx
export function App(props) {
  const outerRef = useRef();
  const innerRef = useRef();

  // 模拟 componentDidMount 生命周期
  useEffect(() => {
    outerRef.current.addEventListener("click", () => {
      console.log("DOM event: outer div");
    });
    innerRef.current.addEventListener("click", () => {
      console.log("DOM event: inner div");
    })
    document.addEventListener("click", () => {
      console.log("DOM event: document");
    })
  }, []);

  const handleOuterClick = () => {
    console.log("React event: outer div");
  }

  const handleInnerClick = () => {
    console.log("React event: inner div");
  }

  return (
    <div ref={outerRef} onClick={handleOuterClick}>
      <h2 ref={innerRef} onClick={handleInnerClick}>Click here</h2>
    </div>
  );
}

// DOM event: inner div
// DOM event: outer div
// React event: inner div
// React event: outer div
// DOM event: document
```

## 事件池
合成事件对象池是 React 事件系统提供的一种性能优化方式。合成事件对象在事件池统一管理，不同类型的合成事件具有不同的事件池。

- 当事件池未满时，React 创建新的事件对象，派发给组件。
- 当事件池装满时，React 从事件池中复用事件对象，派发给组件。

在 React 16 及之前的版本，合成事件对象的事件处理函数全部被调用之后，所有属性都会被置为 null 。这时，如果我们需要在事件处理函数运行之后获取事件对象的属性，可以使用 React 提供的 e.persist() 方法，保留所有属性：

TODO:
