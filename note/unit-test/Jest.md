# Jest
一个单元测试语句一般由三部分组成：Assertion，Modifier，Matcher。

## Assertion
判断一个值是否满足条件会使用到 expect 函数，通常会结合 expect 和匹配器函数来断言某个值，示例如下：
```jsx
test('the best flavor is grapefruit', () => {
  expect(bestLaCroixFlavor()).toBe('grapefruit');
});
```

`toBe`称为 Modifier，用来修饰后面的 Matcher。

expect 的参数应该是被测代码的返回值，而 Matcher 接收的传入参数则是期望被测代码返回的值。

## Modifier
- `.not`：如字面意义，对后面的 Matcher 判断取反
- `.resolves`：将一个已经 fulfilled 的 promise 展开，以便后续的 Matcher 能连接上。
    ```jsx
    test('resolves to lemon', () => {
      // 记得加 return
      return expect(Promise.resolve('lemon')).resolves.toBe('lemon');
    });
    ```
- `.reject`：类似 `.resolves`，只不过针对的是 rejected 状态的 promise。如果promise 已经 fulfilled，断言会失败。

## Matcher
- `.toBe(value)`：直接对比原始类型的值或者对象引用，比较方式为`Object.is`
- `.toHaveBeenCalled()`：判断 mock 的函数是否被调用，如果需要带参数，可以用`.toHaveBeenCalledWith(arg1, arg2, ...)`

...


## 测试DOM元素
需要另一个库：`jest-dom`，这个库为 jest 提供了DOM元素 matcher，配合 testing library 使用。

用法示例：
```js
import {screen} from '@testing-library/dom'

test('uses jest-dom', () => {
  document.body.innerHTML = `
    <span data-testid="not-empty"><span data-testid="empty"></span></span>
    <div data-testid="visible">Visible Example</div>
  `

  expect(screen.queryByTestId('not-empty')).not.toBeEmptyDOMElement()
  expect(screen.getByText('Visible Example')).toBeVisible()
})
```

有了能直接测试 DOM 元素状态和属性的 matcher 以后就不要用 jest 的原始类型匹配了，示例如下：
```js
const button = screen.getByRole('button', {name: /disabled button/i})

expect(button.disabled).toBe(true) // ❌
// error message:
//  expect(received).toBe(expected) // Object.is equality
//
//  Expected: true
//  Received: false

expect(button).toBeDisabled() // ✅
// error message:
//   Received element is not disabled:
//     <button />
```

jest-dom 提供的 matcher 一览：
- toBeDisabled
- toBeEnabled
- toBeEmptyDOMElement
- toBeInTheDocument
- toBeInvalid
- toBeRequired
- toBeValid
- toBeVisible
- toContainElement
- toContainHTML
- toHaveAccessibleDescription
- toHaveAccessibleName
- toHaveAttribute
- toHaveClass
- toHaveFocus
- toHaveFormValues
- toHaveStyle
- toHaveTextContent
- toHaveValue
- toHaveDisplayValue
- toBeChecked
- toBePartiallyChecked
- toHaveErrorMessage

文档参考：[jest-dom custom matchers](https://github.com/testing-library/jest-dom#custom-matchers)


### act
react-testing-library 提供了一个`act`函数，它是对 react 自己的 test util 库的 `act` 的一个包裹操作，目的是为了让测试更接近react在浏览器里的操作，一般用来包裹对组件的操作。

```jsx
const testValue = 'testValue';
render(<TextArea value={testValue}/>);
const ta = getByDisplayValue(testValue);
act(() => ta.focus());
// 接各种 expect 断言
```

不过要注意的是，不是所有的操作都要包裹在 act 函数中，很多行为 testing-library 已经给封装好了，比如用户操作和事件之类的，就没必要包裹在 act 里。示例如下：
```jsx
// ❌
act(() => {
  render(<Example />)
})

// ❌
const input = screen.getByRole('textbox', {name: /choose a fruit/i})
act(() => {
  fireEvent.keyDown(input, {key: 'ArrowDown'})
})

// ✅
render(<Example />)
const input = screen.getByRole('textbox', {name: /choose a fruit/i})
fireEvent.keyDown(input, {key: 'ArrowDown'})
```

## mock
jest 本身没有 mock server 的功能，对于网络请求的 mock 需要借助另一个库：[Mock Service Worker](https://mswjs.io/)

用法示例：
```js
import { rest } from 'msw'
import { setupServer } from 'msw/node'

// 设置mock server
const server = setupServer(
  // 拦截 GET /greeting 请求
  rest.get('/greeting', (req, res, ctx) => {
    // 返回伪造的响应
    return res(ctx.json({greeting: 'hello there'}))
  }),
)

beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('handles server error', async () => {
  server.use(
    // override the initial "GET /greeting" request handler
    // to return a 500 Server Error
    rest.get('/greeting', (req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )

  // ...
})
```

## 伪计时器
在测试环境中，可以使用 `jest.useFakeTimers()` 来替代原本的计时器（timout interval 两套函数），在测试中可以控制时间流逝。

比如使用 jest.runAllTimers() 来快进时间，使所有定时器立即执行。

调用 jest.useFakeTimers() 后，所有测试都将使用虚拟定时器，直到使用 jest.useRealTimers() 恢复原始定时器为止。

```js
// timerGame.js
export default function timerGame(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

// __tests__/timerGame-test.js
import timerGame from "../timerGame";

jest.useFakeTimers();
test('calls the callback after 1 second', () => {
  const callback = jest.fn();

  timerGame(callback);

  // 此时回调还不应该被调用
  expect(callback).not.toBeCalled();

  // 快进到所有计时器都执行完毕
  jest.runAllTimers();

  // 此时回调都应该执行过了
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
```

上面的例子中，在测试中调用了 `jest.useFakeTimers()` 来启用虚拟定时器。然后，在测试中调用了 `jest.runAllTimers()` 来快进时间，使所有定时器立即执行。最后，检查回调函数是否被正确地调用了一次。
