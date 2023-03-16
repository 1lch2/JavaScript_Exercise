# Testing Library

Testing Library 通过尽可能模仿用户与网页互动的方式进行组件测试，避免测试组件的内部细节。

## 测试工具的使用原则

如果和渲染组件有关，那应该处理 DOM 节点而不是组件的实例，

## 常用 Query

如下表所示：

|   Type of Query   |  0 Matches  |    1 Match     |  >1 Matches  | Retry (Async/Await) |
| :---------------: | :---------: | :------------: | :----------: | ------------------- |
|  Single Element   |             |                |              |                     |
|     getBy...      | Throw error | Return element | Throw error  | No                  |
|    queryBy...     | Return null | Return element | Throw error  | No                  |
|     findBy...     | Throw error | Return element | Throw error  | Yes                 |
| Multiple Elements |             |                |              |                     |
|    getAllBy...    | Throw error |  Return array  | Return array | No                  |
|   queryAllBy...   |  Return []  |  Return array  | Return array | No                  |
|   findAllBy...    | Throw error |  Return array  | Return array | Yes                 |

### query 选择优先级

测试应该尽可能接近用户互动的方式，按这个原则有了下面的优先级。

#### 所有人都可用的查询

反映真实视觉/鼠标的体验

1. `getByRole`：用来查询在易用性树（accessibility tree）中暴露的元素，通过`name`选项来查询这些元素的易用性名。
   一般使用方式如下：

   ```js
   getByRole("button", { name: /submit/i });
   ```

   role 在 ARIA 标准中定义：[Using ARIA: Roles, states, and properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles)

2. `getByLabelText`：很适合用来查询 form 表单，这个查询会模拟用户通过 label 寻找表单项的行为。

3. `getByPlaceholderText`：字面意义
4. `getByText`：一般用来查询不可交互的元素，比如 div，span，p
5. `getByDisplayValue`：表单当前元素的值，一般用来查询已经填好的表单元素

#### 语义查询

兼容 H5 和 ARIA 的选择器。

1. `getByAltText`：如果元素支持 `alt` 文本（自定义元素或 img，area，input），就能用这个方法选择
2. `getByTitle`

#### Test ID

`getByTestId`：用户基本没法和这个属性交互，只推荐用来处理没法用语义或者作用选择，或者传统方法干脆无法处理的场景（比如动态的文本）

## render
render 方法将传入的组件渲染到 document.body 上（append）。用法如下：
```tsx
function render(
  ui: React.ReactElement<any>,
  options?: {
    // 不常用，参考具体选项
  },
): RenderResult
```

```jsx
import {render} from '@testing-library/react'
import '@testing-library/jest-dom'

test('renders a message', () => {
  const {getByText} = render(<Greeting />)
  expect(getByText('Hello, world!')).toBeInTheDocument()
})
```

render 的第二个参数的选项参考文档：[`render` Options](https://testing-library.com/docs/react-testing-library/api#render)


render 返回的类型是 `RenderResult` ，这个对象最需要关注的属性是`...queries`，示例如下：
```jsx
const {getByLabelText, queryAllByTestId} = render(<Component />)
```

## 模拟事件

### fireEvent

testing library 提供了一个函数用来模拟 DOM 事件：`fireEvent`，这个函数也可以配合 react 的合成事件。

用法如下：

```ts
fireEvent(node: HTMLElement, event: Event);
```

假设有一个简单的输入组件，它有一个文本输入框和一个显示输入内容的元素。使用 `fireEvent.change` 来测试这个组件的功能如下所示：

```jsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Input from "./Input";

test("input updates when the user types", () => {
  const { getByLabelText, getByText } = render(<Input />);
  const input = getByLabelText("Input:");
  const display = getByText("You typed:");

  fireEvent.change(input, { target: { value: "Hello" } });
  expect(display.textContent).toBe("You typed: Hello");
});
```

利用 Jest 的 mock function 可以测试某个事件发生时候绑定的回调，示例如下：

```jsx
import { render, screen, fireEvent } from "@testing-library/react";

const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

test("calls onClick prop when clicked", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  fireEvent.click(screen.getByText(/click me/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

这里测试了 click 事件发生的回调 handleClick，预期发生一次。

不过大部分时候应该使用另一个库 `user-event` 来直接模拟用户行为而不是 DOM 事件。

### userEvent

fireEvent 和 userEvent 都可以用来在测试中模拟用户与组件的交互。不同之处在于，fireEvent 只会触发你指定的事件，而 userEvent 则会模拟用户在浏览器中真实进行交互时触发的一系列事件。

以下面这个测试用户输入组件为例，测试输入 `"input"` 后组件对应的 value 是否符合预期：

```jsx
import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

test("input updates when the user types", () => {
  const { getByLabelText } = render(<Input />);
  const input = getByLabelText("Input:");

  userEvent.type(input, "Hello");
  expect(input.value).toBe("Hello");
});
```

userEvent 的实现中用到了 fireEvent，因此可以将它看作高阶 API 而 fireEvent 作为偏底层一些的 API
