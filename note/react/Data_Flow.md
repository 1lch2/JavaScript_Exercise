# React 单向数据流

## 什么是单向数据流？

单向数据流（Unidirectional Data Flow）是 React 的核心设计模式，指的是数据在应用程序中只有一个方向的流动：从父组件向子组件通过 props 传递，而子组件通过回调函数（callbacks）将事件和数据向上传递。

这种模式与双向数据绑定（如 Angular 或 Vue 的早期版本）形成对比，在双向绑定中，数据变化会自动同步到 UI，UI 变化也会自动更新数据，导致数据流方向不明确。

## 单向数据流如何工作？

### 1. Props Down（数据向下传递）
- 父组件通过 props 将数据传递给子组件
- 子组件接收 props 作为只读数据
- 子组件不能直接修改 props

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0);

  return <Child count={count} />;
}

// 子组件
function Child({ count }) {
  return <div>Count: {count}</div>;
}
```

### 2. Events Up（事件向上传递）
- 子组件通过调用父组件传递的回调函数来通信
- 回调函数可以更新父组件的状态
- 状态变化触发重新渲染，新的 props 传递给子组件

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return <Child count={count} onIncrement={handleIncrement} />;
}

// 子组件
function Child({ count, onIncrement }) {
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}
```

### 3. State 管理
- 状态（state）存储在组件层级中尽可能高的位置（状态提升）
- 多个组件需要共享的状态应该提升到最近的共同祖先组件
- 使用 Context API 或状态管理库（如 Redux）管理全局状态

## 单向数据流的优点

### 1. 可预测性
- 数据流方向明确，容易跟踪数据变化
- 调试简单，可以清楚地知道数据从哪里来，到哪里去

### 2. 可维护性
- 组件之间的关系清晰
- 容易理解组件如何影响应用程序状态

### 3. 性能优化
- React 可以更有效地判断何时需要重新渲染组件
- 通过 shouldComponentUpdate 或 React.memo 进行优化

### 4. 测试友好
- 纯函数组件更容易测试
- 输入（props）确定，输出（UI）确定

## 实际应用示例

### 表单处理
```jsx
function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Name"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
      />
      <InputField
        label="Email"
        value={formData.email}
        onChange={(value) => handleChange('email', value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
```

### 状态提升示例
```jsx
// 温度转换器示例
function TemperatureConverter() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  const handleCelsiusChange = (value) => {
    setCelsius(value);
    if (value === '') {
      setFahrenheit('');
    } else {
      setFahrenheit(Math.round((value * 9/5 + 32) * 100) / 100);
    }
  };

  const handleFahrenheitChange = (value) => {
    setFahrenheit(value);
    if (value === '') {
      setCelsius('');
    } else {
      setCelsius(Math.round(((value - 32) * 5/9) * 100) / 100);
    }
  };

  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
    </div>
  );
}

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  const scaleNames = { c: 'Celsius', f: 'Fahrenheit' };

  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}
```

## 常见误区

### 1. 不要直接修改 props
```jsx
// 错误示例
function Child({ user }) {
  user.name = 'New Name'; // ❌ 直接修改 props
  return <div>{user.name}</div>;
}

// 正确做法
function Child({ user, onUpdateUser }) {
  const handleUpdate = () => {
    onUpdateUser({ ...user, name: 'New Name' }); // ✅ 通过回调通知父组件
  };

  return (
    <div>
      <div>{user.name}</div>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

### 2. 避免过深 props 传递（Prop Drilling）
- 解决方案：使用 Context API 或状态管理库
- 或者使用组件组合（Component Composition）

### 3. 不要过度提升状态
- 只将需要共享的状态提升
- 局部状态保持在组件内部

## 总结

React 的单向数据流通过明确的"向下传递 props，向上传递事件"模式，使应用程序的数据流动变得可预测和易于理解。这种模式虽然需要编写更多的模板代码，但它带来的可维护性、可测试性和性能优势使得大型应用程序更容易开发和维护。

记住：数据总是从父组件流向子组件，子组件通过回调函数影响父组件状态，从而触发新的数据流。
