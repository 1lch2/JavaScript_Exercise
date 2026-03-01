# 前端面试题精选

本文档包含 3 道精心设计的前端面试题，涵盖 JavaScript 基础、代码实现和 React 框架应用，帮助你巩固和复习核心技能。

---

## 题目 1：事件循环与异步编程

**难度**：⭐⭐⭐
**标签**：事件循环、Promise、宏任务、微任务、async/await

### 题目

请写出以下代码的执行结果，并解释原因：

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => {
    console.log("3");
  });
}, 0);

new Promise((resolve) => {
  console.log("4");
  resolve();
}).then(() => {
  console.log("5");
  setTimeout(() => {
    console.log("6");
  }, 0);
});

async function async1() {
  console.log("7");
  await async2();
  console.log("8");
}

async function async2() {
  console.log("9");
}

async1();

console.log("10");
```

### 参考答案

```
1
4
7
9
10
5
8
2
3
6
```

### 解析

这道题目综合考察了 JavaScript 事件循环机制中的宏任务、微任务执行顺序，以及 Promise 和 async/await 的特性。

#### 执行过程分析

**第一轮：执行同步代码**

1. 执行 `console.log('1')`，输出 `1`
2. 遇到 `setTimeout`，将回调函数放入**宏任务队列**
3. 遇到 `new Promise`，Promise 构造函数**立即执行**，输出 `4`，调用 `resolve()`
4. Promise 的 `then` 回调放入**微任务队列**
5. 调用 `async1()`，输出 `7`
6. 调用 `async2()`，输出 `9`
7. `await async2()` 相当于 `Promise.resolve(async2()).then(...)`，将后续代码（`console.log('8')`）放入**微任务队列**
8. 执行 `console.log('10')`，输出 `10`

此时输出：`1 4 7 9 10`

**第二轮：执行微任务队列**

9. 执行第一个微任务（Promise 的 then 回调），输出 `5`
10. 遇到 `setTimeout`，将回调放入**宏任务队列**
11. 执行第二个微任务（async1 中 await 后的代码），输出 `8`

此时输出：`1 4 7 9 10 5 8`

**第三轮：执行第一个宏任务**

12. 执行第一个 `setTimeout` 回调，输出 `2`
13. 遇到 `Promise.resolve().then()`，将回调放入**微任务队列**

**第四轮：执行微任务队列**

14. 执行微任务，输出 `3`

此时输出：`1 4 7 9 10 5 8 2 3`

**第五轮：执行第二个宏任务**

15. 执行第二个 `setTimeout` 回调，输出 `6`

最终输出：`1 4 7 9 10 5 8 2 3 6`

### 知识点总结

1. **Promise 构造函数同步执行**：`new Promise` 中的代码会立即执行，只有 `then`、`catch`、`finally` 是异步的
2. **微任务优先于宏任务**：每次执行完一个宏任务后，会先清空所有微任务队列，再执行下一个宏任务
3. **async/await 的本质**：`await` 会将后续代码转换为微任务
4. **事件循环执行顺序**：同步代码 → 微任务队列 → 宏任务队列

### 延伸阅读

- [Event_Loop.md](../js/Event_Loop.md) - 事件循环机制详解
- [Promise.md](../js/Promise.md) - Promise 完整用法

---

## 题目 2：手写防抖函数（增强版）

**难度**：⭐⭐⭐⭐
**标签**：闭包、this、函数式编程、防抖

### 题目要求

实现一个防抖函数 `debounce`，需要满足以下要求：

1. **基本防抖功能**：n 秒后执行函数，若在 n 秒内被重复触发则重新计时
2. **立即执行模式**：支持第一次触发时立即执行，后续触发按防抖规则处理
3. **取消功能**：返回的函数应包含 `cancel` 方法用于取消待执行的函数
4. **this 和参数传递**：正确处理函数执行时的 this 指向和参数传递

### 函数签名

```javascript
function debounce(func, wait, immediate = false) {
  // 你的实现代码
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    if (immediate) {
      func.apply(this, args);
    } else {
      timer = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  };
}
```

### 使用示例

```javascript
// 基本使用
const debouncedFunc = debounce(() => console.log("执行"), 1000);
debouncedFunc(); // 1 秒后执行
debouncedFunc(); // 重新计时，取消上次的执行

// 立即执行模式
const immediateDebouncedFunc = debounce(
  () => console.log("立即执行"),
  1000,
  true,
);
immediateDebouncedFunc(); // 立即执行
immediateDebouncedFunc(); // 1 秒内再次调用不会执行

// 取消执行
const cancelableFunc = debounce(() => console.log("可取消"), 1000);
cancelableFunc();
cancelableFunc.cancel(); // 取消执行

// this 和参数传递
const obj = {
  name: "test",
  greet: debounce(function (greeting) {
    console.log(`${greeting}, ${this.name}`);
  }, 500),
};
obj.greet("Hello"); // 500ms 后输出 "Hello, test"
```

### 参考实现

```javascript
/**
 * 增强版防抖函数
 * @param {Function} func 待防抖处理的函数
 * @param {Number} wait 等待时间（毫秒）
 * @param {Boolean} immediate 是否立即执行
 * @returns {Function} 经过防抖处理的函数
 */
function debounce(func, wait, immediate = false) {
  let timer = null;
  let result;

  // 返回的防抖函数
  const debounced = function (...args) {
    // 保存 this 上下文
    const context = this;

    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }

    if (immediate) {
      // 立即执行模式
      // 如果定时器不存在，说明是第一次调用或者已经过了 wait 时间
      const callNow = !timer;

      // 设置定时器，wait 时间后将 timer 置为 null
      timer = setTimeout(() => {
        timer = null;
      }, wait);

      // 第一次调用时立即执行
      if (callNow) {
        result = func.apply(context, args);
      }
    } else {
      // 普通防抖模式
      // 设置新的定时器
      timer = setTimeout(() => {
        result = func.apply(context, args);
      }, wait);
    }

    return result;
  };

  // 取消功能
  debounced.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}
```

### 测试用例

```javascript
// 测试 1：基本防抖功能
console.log("测试 1：基本防抖");
let count1 = 0;
const basicDebounce = debounce(() => {
  count1++;
  console.log("基本防抖执行", count1);
}, 300);

basicDebounce();
basicDebounce();
basicDebounce();
// 预期：300ms 后只输出一次 "基本防抖执行 1"

// 测试 2：立即执行模式
console.log("\n测试 2：立即执行模式");
let count2 = 0;
const immediateDebounce = debounce(
  () => {
    count2++;
    console.log("立即执行", count2);
  },
  300,
  true,
);

immediateDebounce(); // 立即输出 "立即执行 1"
immediateDebounce(); // 不输出
immediateDebounce(); // 不输出
setTimeout(() => {
  immediateDebounce(); // 300ms 后再次调用，立即输出 "立即执行 2"
}, 500);

// 测试 3：取消功能
console.log("\n测试 3：取消功能");
let count3 = 0;
const cancelableDebounce = debounce(() => {
  count3++;
  console.log("应该被取消", count3);
}, 300);

cancelableDebounce();
cancelableDebounce.cancel(); // 取消执行
// 预期：不会有任何输出

// 测试 4：this 和参数传递
console.log("\n测试 4：this 和参数传递");
const testObj = {
  name: "JavaScript",
  greet: debounce(function (greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
  }, 300),
};

testObj.greet("Hello", "!");
testObj.greet("Hi", "!!");
// 预期：300ms 后输出 "Hi, JavaScript!!"
```

### 评分标准

- **基础防抖功能**（40%）：正确实现定时器逻辑和重新计时
- **this 和参数正确传递**（20%）：使用 `apply` 或 `call` 正确绑定 this
- **立即执行模式**（20%）：正确判断是否为首次调用
- **cancel 方法实现**（20%）：提供取消功能并正确清理定时器

### 知识点延伸

#### 1. 闭包的应用

`timer` 变量通过闭包保存在 `debounced` 函数的作用域中，每次调用时都能访问和修改同一个 `timer`。

#### 2. this 绑定

使用 `func.apply(context, args)` 确保原函数以正确的 this 上下文执行。参考 [This.md](../js/This.md)。

#### 3. 防抖 vs 节流

- **防抖**：n 秒内重复触发会重新计时，适用于输入框搜索
- **节流**：n 秒内只执行一次，适用于滚动事件

参考实现：[debounce.js](../../src/functions/debounce.js)、[throttle.js](../../src/functions/throttle.js)

#### 4. 实际应用场景

- 搜索框输入联想
- 窗口 resize 事件处理
- 按钮防重复点击
- 表单验证

---

## 题目 3：React 性能优化场景分析

**难度**：⭐⭐⭐
**标签**：React、性能优化、diff 算法、渲染优化

### 场景描述

在一个电商 React 应用中，有一个商品列表组件 `ProductList`，包含 1000 个商品项 `ProductItem`。每个商品有以下信息：

```javascript
{
  id: 1,
  name: '商品名称',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  stock: 100,
  category: '电子产品'
}
```

用户可以通过顶部的搜索框实时筛选商品，筛选逻辑在 `ProductList` 组件中处理。

### 问题

#### 1. 在这个场景下可能遇到哪些性能问题？

#### 2. 请列举至少 5 种优化方案并说明原理

#### 3. 如何使用 key 优化列表渲染？为什么不推荐使用 index 作为 key？

#### 4. 如何避免父组件更新导致所有子组件重新渲染？

### 参考答案

#### 问题 1：可能遇到的性能问题

1. **渲染性能问题**
   - 1000 个 DOM 节点同时渲染会导致页面卡顿
   - 首屏加载时间过长
   - 滚动时出现白屏或闪烁

2. **重复渲染问题**
   - 搜索框每次输入都会触发整个列表重新渲染
   - 父组件状态变化导致所有子组件不必要的重新渲染
   - 每个商品项的图片重复加载

3. **内存占用问题**
   - 大量 DOM 节点占用过多内存
   - 事件监听器过多导致内存泄漏风险

4. **交互响应问题**
   - 搜索输入框输入延迟
   - 点击商品响应缓慢

#### 问题 2：优化方案（至少 5 种）

**方案 1：虚拟列表（Virtual List / Windowing）**

**原理**：只渲染可视区域内的商品项，用户滚动时动态加载和卸载 DOM 节点。

```javascript
import { FixedSizeList } from "react-window";

function ProductList({ products }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductItem product={products[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={products.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**效果**：将 1000 个 DOM 节点减少到可视区域的 10-20 个，大幅提升性能。

**方案 2：React.memo 避免不必要的渲染**

**原理**：对 `ProductItem` 组件使用 `React.memo` 进行浅比较，只有 props 改变时才重新渲染。

```javascript
const ProductItem = React.memo(({ product, onAddToCart }) => {
  return (
    <div className="product-item">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>¥{product.price}</p>
      <button onClick={() => onAddToCart(product.id)}>加入购物车</button>
    </div>
  );
});
```

**效果**：当父组件重新渲染时，如果商品数据没有变化，子组件不会重新渲染。

**方案 3：useMemo 缓存筛选结果**

**原理**：使用 `useMemo` 缓存筛选后的商品列表，避免每次渲染都重新计算。

```javascript
function ProductList({ products, searchKeyword }) {
  const filteredProducts = useMemo(() => {
    if (!searchKeyword) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchKeyword.toLowerCase()),
    );
  }, [products, searchKeyword]);

  return (
    <div>
      {filteredProducts.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**效果**：只有当 `products` 或 `searchKeyword` 改变时才重新筛选。

**方案 4：useCallback 缓存回调函数**

**原理**：使用 `useCallback` 缓存事件处理函数，避免每次渲染都创建新的函数引用。

```javascript
function ProductList({ products }) {
  const handleAddToCart = useCallback((productId) => {
    // 添加到购物车的逻辑
    console.log("添加商品", productId);
  }, []); // 依赖为空，函数只创建一次

  return (
    <div>
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
```

**效果**：配合 `React.memo` 使用，避免因回调函数引用变化导致的子组件重新渲染。

**方案 5：搜索输入防抖**

**原理**：对搜索框输入使用防抖，减少筛选操作的频率。

```javascript
function SearchBar({ onSearch }) {
  const debouncedSearch = useMemo(
    () => debounce((value) => onSearch(value), 300),
    [onSearch],
  );

  const handleChange = (e) => {
    debouncedSearch(e.target.value);
  };

  return <input type="text" onChange={handleChange} placeholder="搜索商品" />;
}
```

**效果**：用户输入停止 300ms 后才触发筛选，减少不必要的渲染。

**方案 6：图片懒加载**

**原理**：使用 Intersection Observer API 或第三方库实现图片懒加载。

```javascript
function ProductItem({ product }) {
  return (
    <div className="product-item">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy" // 原生懒加载
      />
      <h3>{product.name}</h3>
      <p>¥{product.price}</p>
    </div>
  );
}
```

**效果**：只加载可视区域内的图片，减少网络请求和渲染压力。

**方案 7：分页或无限滚动**

**原理**：不一次性渲染所有商品，采用分页或滚动加载更多的方式。

```javascript
function ProductList({ products }) {
  const [displayCount, setDisplayCount] = useState(20);

  const loadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  return (
    <>
      {products.slice(0, displayCount).map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
      <button onClick={loadMore}>加载更多</button>
    </>
  );
}
```

**效果**：初始只渲染 20 个商品，降低首屏渲染压力。

#### 问题 3：key 的使用和原理

**正确使用 key**

```javascript
// ✅ 推荐：使用稳定的唯一标识符
products.map((product) => <ProductItem key={product.id} product={product} />);

// ❌ 不推荐：使用数组索引
products.map((product, index) => <ProductItem key={index} product={product} />);
```

**为什么不推荐使用 index 作为 key**

1. **破坏 diff 算法的优化**
   - React 通过 key 来判断元素是移动、新增还是删除
   - 使用 index 时，如果列表顺序改变（如排序、筛选），key 不会跟随元素移动
   - React 会误认为是相同位置的元素内容改变，导致不必要的 DOM 操作

2. **导致组件状态错乱**

   ```javascript
   // 示例：筛选前列表
   [
     { id: 1, name: "A" }, // key=0
     { id: 2, name: "B" }, // key=1
     { id: 3, name: "C" }, // key=2
   ][
     // 筛选后（删除 B）
     ({ id: 1, name: "A" }, // key=0
     { id: 3, name: "C" }) // key=1（原来是 key=2）
   ];
   ```

   React 会认为 key=1 的元素从 B 变成了 C，进行更新而不是删除和移动，可能导致组件内部状态错误。

3. **影响性能**
   - 使用稳定的 id 可以让 React 更准确地复用 DOM 节点
   - 使用 index 可能导致更多的 DOM 重建操作

**key 的作用**

- 帮助 React 识别哪些元素发生了变化
- 优化 diff 算法的性能
- 保持组件状态的正确性

参考：[Diff.md](../react/Diff.md)

#### 问题 4：避免父组件更新导致子组件重新渲染

**方法 1：组件拆分和状态下沉**

将搜索框和列表拆分为独立组件，搜索状态只影响必要的组件。

```javascript
function App() {
  const [products] = useState(/* 商品数据 */);

  return (
    <div>
      <Header /> {/* 不受搜索影响 */}
      <ProductListWithSearch products={products} />
      <Footer /> {/* 不受搜索影响 */}
    </div>
  );
}

function ProductListWithSearch({ products }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  // 搜索状态只在这个组件内，不会影响 Header 和 Footer

  return (
    <>
      <SearchBar value={searchKeyword} onChange={setSearchKeyword} />
      <ProductList products={products} searchKeyword={searchKeyword} />
    </>
  );
}
```

**方法 2：使用 React.memo**

如前面提到的，对子组件使用 `React.memo` 进行浅比较。

```javascript
const ProductItem = React.memo(({ product, onAddToCart }) => {
  // 只有 product 或 onAddToCart 改变时才重新渲染
  return (/* ... */);
});
```

**方法 3：使用 useMemo 和 useCallback**

缓存计算结果和回调函数，避免传递给子组件的 props 引用变化。

```javascript
function ProductList({ products }) {
  // 缓存筛选结果
  const filteredProducts = useMemo(() => {
    return products.filter(/* ... */);
  }, [products]);

  // 缓存回调函数
  const handleAddToCart = useCallback((id) => {
    // 处理逻辑
  }, []);

  return (/* ... */);
}
```

**方法 4：状态管理优化**

使用 Context + useReducer 或状态管理库（Redux、Zustand）进行精细化的状态订阅。

```javascript
// 只订阅需要的状态
function ProductItem({ productId }) {
  const product = useSelector(state =>
    state.products.find(p => p.id === productId)
  );
  // 只有这个商品的数据变化时才重新渲染
  return (/* ... */);
}
```

### 扩展思考

1. **如何实现商品列表的分类筛选和多条件排序？**
2. **如果商品数据需要实时更新（WebSocket），如何优化渲染性能？**
3. **如何监控和分析 React 应用的性能瓶颈？**（提示：React DevTools Profiler）
4. **虚拟列表在移动端需要注意哪些问题？**

### 相关知识点

- [React Diff 算法](../react/Diff.md)
- [React 生命周期](../react/Lifecycle.md)
- [防抖和节流](../../src/functions/debounce.js)
- [性能优化最佳实践](../browser/Performance_Optimization.md)

---

## 总结

这三道题目分别从不同角度考察了前端核心能力：

1. **题目 1** 考察了 JavaScript 异步编程和事件循环机制，这是理解前端运行时的基础
2. **题目 2** 考察了闭包、this 绑定等核心概念的实际应用，以及手写代码的能力
3. **题目 3** 考察了 React 性能优化的综合能力，贴近实际工作场景

建议配合相关笔记和代码实现反复练习，巩固知识点。祝你面试顺利！
