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
- 


TODO：