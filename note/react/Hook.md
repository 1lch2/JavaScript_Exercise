# React 基础 - Hook
## 概念
Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。

## 动机
### 在组件之间复用状态逻辑很难
React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）。Hook 使你在无需修改组件结构的情况下复用状态逻辑

### 复杂组件变得难以理解
我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

### 难以理解的 class
你必须去理解 JavaScript 中 this 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的语法提案，这些代码非常冗余。
大家可以很好地理解 props，state 和自顶向下的数据流，但对 class 却一筹莫展。即便在有经验的 React 开发者之间，对于函数组件与 class 组件的差异也存在分歧，甚至还要区分两种组件的使用场景。

## Hook 使用规则
- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。

## 常见 hook
### useState
通过在函数组件里调用它来给组件添加一些内部 state。

React 会在重复渲染时保留这个 state。

useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。

下例显示一个计数器。当你点击按钮，计数器的值就会增加：
```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

useState() 方法里面唯一的参数就是初始 state。不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象。

#### useState 拿到最新 state
useState hook 本身不能做到同步，想同步拿到最新的 state 需要套用 useEffect，示例如下：

```jsx
const [count, setCount] = useState(0);
useEffect(() => {
  // 此处为对 count 做的操作
}, [count])
```

### useEffect
给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API。

下例所示的组件在 React 更新 DOM 后会设置一个页面标题：
```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

当调用 useEffect 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。

由于副作用函数是在组件内声明的，所以它们可以访问到组件的 props 和 state。默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候。

#### useEffect 解绑副作用
组件被注销之前清除掉添加的注册，否则会出现内存泄漏。这时可以在副作用函数中返回一个新函数，在组件下一次渲染后执行。示例如下：

```js
function Comp(props) {
  useEffect(() => {
    subscribe();

    return function cleanup() {
      unsubscribe();
    }
  });
}
```

对比生命周期函数：componentWillUnmount 只会在组件被销毁前执行一次，而useEffect里的函数，每次组件渲染后都会执行一遍，包括副作用函数返回的清理函数也会重新执行一遍。

#### useEffect 的条件执行
对useEffect传入第二个参数，仅当第二个参数发生变化时才执行第一个参数定义的副作用函数，示例如下：

```js
useEffect(() => {
  // some action
}, [count]);
```


### useContext
```js
const value = useContext(MyContext);
```

接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值。即使祖先使用 React.memo 或 shouldComponentUpdate，也会在组件本身使用 useContext 时重新渲染。

### React.createContext
当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。

### Context.Provider
每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

用例参考：
```jsx
const themes = {
  light: {
    // ...
  },
  dark: {
    // ...
  }
};

// 初始化 context 并设置默认值
const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### useRef
useRef 类似 useState ，但它的返回的对象在整个生命周期中都不会变化，修改 ref 也不会导致重新渲染。也常用来获得对具体DOM元素的引用。

很多例子中会用 useState 来控制 input 元素的内容，如下所示：
```jsx
const [inputVal, setInputVal] = useState("default value");
return (
  <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}/>
);
```
看起来很合理，实际上每敲一个字，就会触发一次 onChange ，而 onChange 会调用 setState ，也就会触发一次渲染。实际上大部分时候并不关心输入过程中的值，因此只需要关心完成输入要提交时的值，这里就不应该让 input 元素的值由 useState 来控制了。

> 那我不用 onChange 不就行了？实际上不行，试过就知道，要么提供 onChange，要么设置 defaultValue，否则输入框的内容就是只读。

正确思路是，使用 useRef 来获得 input 元素的值，然后在提交时再调用 setState。示例如下：
```jsx
let ref = useRef();
let [inputValue, setInputValue] = useState("default");

const submitForm = (e) => {
  e.preventDefault();
  setInputValue(e.target.value);
}

return (
  <input type="text" ref={ref} defaultValue={inputValue}/>
  <input type="submit" onClick={submitForm}>
);
```

### useMemo
useMemo 用来在几次渲染之间缓存计算的结果。这个Hook接受两个参数，第一个为想记忆结果的计算函数，一般不应该带参数（形如`()=>{}`）；第二个类似 useEffect，代表重新计算的判断依赖，如果依赖发生变化则重新计算并存储计算结果供之后重用。函数返回的值即为被记忆的计算结果。

每次渲染之间，react会比较所有的依赖变量，如果每个都没有变化，则直接返回之前暂存的结果

使用场合如下：
1. 跳过耗时较长的计算过程
    ```jsx
    function TodoList({ todos, tab, theme }) {
      const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
      // ...
    }
    ```

2. 跳过组件重渲染
    ```jsx
    function TodoList({ todos, tab, theme }) {
      // Tell React to cache your calculation between re-renders...
      const visibleTodos = useMemo(
        () => filterTodos(todos, tab),
        [todos, tab] // ...so as long as these dependencies don't change...
      );
      return (
        <div className={theme}>
          {/* ...List will receive the same props and can skip re-rendering */}
          <List items={visibleTodos} />
        </div>
      );
    }
    ```
    react 会在每次重渲染时候递归渲染每个嵌套的子组件，使用 useMemo 记忆导致组件变化的参数可以避免耗时的重渲染

3. 记忆另一个Hook的依赖
    ```jsx
    function Dropdown({ allItems, text }) {
      const searchOptions = { matchMode: 'whole-word', text };
      const visibleItems = useMemo(() => {
        return searchItems(allItems, searchOptions);
      }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body

      // ...
    }
    ```
    若 useMemo 的依赖是组件内声明的一个对象时，每次渲染都会重新运行一遍组件内的代码，导致对象重新创建，useMemo 也就此失效。

    这时候可以用 useMemo 记忆这个依赖对象，再将记忆结果传入另一个 hook 作为依赖：
    ```jsx
    const searchOptions = useMemo(() => {
      return { matchMode: 'whole-word', text };
    }, [text]); // ✅ Only changes when text changes

    const visibleItems = useMemo(() => {
      return searchItems(allItems, searchOptions);
    }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
    ```

4. 记忆函数
    ```jsx
    function ProductPage({ productId, referrer }) {
      function handleSubmit(orderDetails) {
        post('/product/' + productId + '/buy', {
          referrer,
          orderDetails
        });
      }
      return <Form onSubmit={handleSubmit} />;
    }
    ```
    对于将函数作为属性的组件，每次渲染时都会重新声明函数，导致内部引用的组件每次都接受了一个不同的参数，如上所示。这时应该使用 useMemo 记忆这个作为参数的函数，避免无用的重新渲染。
    ```jsx
    function Page({ productId, referrer }) {
      const handleSubmit = useMemo(() => {
        return (orderDetails) => {
          post('/product/' + product.id + '/buy', {
            referrer,
            orderDetails
          });
        };
      }, [productId, referrer]);
      return <Form onSubmit={handleSubmit} />;
    }
    ```
    实际上记忆函数更好的方式是用 useCallback 这个 hook，可以省去嵌套一层函数，如下所示：
    ```jsx
    function Page({ productId, referrer }) {
      const handleSubmit = useCallback((orderDetails) => {
        post('/product/' + product.id + '/buy', {
          referrer,
          orderDetails
        });
      }, [productId, referrer]);
      return <Form onSubmit={handleSubmit} />;
    }
    ```

### useCallback
与 useMemo 类似，useCallback 可以在两次渲染之间缓存函数。

> useMemo 缓存的是**函数的结果**，而 useCallback 缓存的是**函数本身**

用法如下：
1. 跳过重渲染

    如 useMemo 的用法4所示

2. 从缓存的回调中更新 state
    ```jsx
    const [todos, setTodos] = useState([]);
    const handleAddTodo = useCallback((text) => {
      const newTodo = { id: nextId++, text };
      setTodos([...todos, newTodo]);
    }, [todos]);
    ```
    当更新的state只取决于它自身之前的状态时，可以直接把依赖移除（改成空数组）

3. 防止副作用触发过于频繁
4. 优化自定义hook
    ```jsx
    function useRouter() {
      const { dispatch } = useContext(RouterStateContext);

      const navigate = useCallback((url) => {
        dispatch({ type: 'navigate', url });
      }, [dispatch]);

      const goBack = useCallback(() => {
        dispatch({ type: 'back' });
      }, [dispatch]);

      return {
        navigate,
        goBack,
      };
    }
    ```

### useLayoutEffect
效果和用法与 useEffect 完全一致，区别在于，它的回调会在所有DOM操作完成之后再执行。一般用于读取布局后同步执行重渲染。


### useReducer
react 内置的 redux 平替方案，一般在组件最顶层声明，和 redux 一样，通过自定义的 reducer 来管理状态。用法如下：
```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  // ... state 操作
  return state
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, initialArg);
  // ...
}
```

useReducer 接受两个参数：
- reducer: reducer 函数定义状态如何更新，和 redux 的 reducer 基本一致
- initialArg: state 的初始值
- init(可选): 可选的初始化函数，如果提供了初始化函数，则初始状态会变为`init(initialArg)`的计算结果

useReducer 返回一个数组，包含两个值，当前状态和dispatch函数。和 redux 里一样，dispatch 函数用来分发 action 触发 reducer 的更新 state 操作，从而触发 react 的重渲染。

> 如果更新state时提供的新的状态和先前状态完全一致（判断标准是`Obejct.is`方法），那么 react 就会跳过对这个组件和它的子组件的重渲染。

#### 如何使用 useReducer 替代 redux ？
答案是配合 useContext 来传递全局的上下文，子组件接受dispatch函数，通过dispatch 各种 action 完成对全局 state 的更新。

示例：[useReducer & useContext](../../src/functions/redux_mimic.jsx)


## Hook 模拟 class 组件的生命周期
生命周期参考：[Lifecycle](LifeCycle.md)

### constructor
直接用 useState
```jsx
const [count, setCount] = useState(0);
```

### componentDidMount
用 useEffect 加空依赖
```jsx
useEffect(() => {
  // code
}, []);
```

### componentDidUpdate
直接用 useEffect 会触发 componentDidMount 和 update 两个周期。如果只想模拟 update 周期，应该配合 useRef 使用。
```jsx
const mounted = useRef();
useEffect(() => {
  if (!mounted.current) {
    mounted.current = true;
  } else {
   console.log('I am didUpdate')
  }
});
```

### componentWillUnmount
useEffect 中 返回函数
```jsx
useEffect(() => {
  return () => {
    console.log('will unmount');
  }
}, []);
```

## 自定义Hook
设计原则：自定义的hook是用来复用带有状态的逻辑而不是状态本身，每次对hook的调用都是互相独立的。

> Custom Hooks let you share stateful logic but not state itself. Each call to a Hook is completely independent from every other call to the same Hook. 

以自定义表格监听hook为例：

```jsx
function useFormInput(initialValue) {
  // 注意实际开发时不应使用 useState，会导致按一次键盘就触发一次渲染
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

场景分析如下：
1. 有需要维护的状态（这里是 firstName 和 lastName）
2. 有负责监听状态变化的handler（两个onchange）
3. 有为 `<input>` 确定 value 和 onChange 属性的JSX部分

这时候可以把这部分共同的逻辑抽取出来变成一个自定义的hook，实现如上所示。

