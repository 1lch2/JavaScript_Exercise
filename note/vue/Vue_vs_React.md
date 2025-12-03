# Vue 和 React 的对比
## Vue数据双向绑定 vs React状态

### Vue
Vue 使用数据双向绑定，通过 `v-model` 指令实现。当数据发生变化时，视图会自动更新，反之亦然。

```html
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    };
  }
};
</script>
```

### React
React 使用单向数据流，通过 `useState` 实现状态管理。当状态发生变化时，组件会重新渲染。

```jsx
import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('Hello React!');

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <p>{message}</p>
    </div>
  );
}

export default App;
```

