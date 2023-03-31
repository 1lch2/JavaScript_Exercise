# React 事件

## React 事件对象

React 事件对象实现了部分标准的 DOM `Event` 接口的属性：

- bubbles: boolean。事件是否冒泡
- cancelable: boolean。事件能否取消
- currentTarget: DOM node。当前事件 handler 在 react 树中附加到的对象
- defaultPrevented: boolean。`preventDefault` 是否被调用了
- eventPhase: number。事件当前所处的阶段。参考[事件阶段](../html/Event.md#事件阶段)
- isTrusted: boolean。事件是否由用户发起
- target: DOM node。事件发生的 DOM 节点
- timeStamp: number。事件发生的时间戳

除此之外，React 还提供了这个属性:

- nativeEvent: DOM Event。浏览器原始事件对象。

## focus

React 对于 focus，blur 事件的处理方式和原生 DOM 有所不同，原生 DOM 中这两个事件不会冒泡，参考 [focus，blur 事件](。。/html/Event。md#焦点事件)。~~而在 react 中，这两个事件会冒泡，而 react 底层并不是对 focusin，focusout 事件进行的监听，因此某些场合下会出现错误判断的情况。~~ React 17 中已经改为监听 focusin/out 事件。

以 form 为例：

```jsx
function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        console.log("focused ", e.currentTarget);
      }}
      onBlur={(e) => {
        console.log("unfocused ", e.currentTarget);
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

使用 tab 导航，依次选中 div 和两个 input 元素。控制台输出结果如下：

```
// 选中 div
focused  <div tabindex="1">…</div>

// 选中第一个 input
unfocused  <div tabindex="1">…</div>
focused  <div tabindex="1">…</div>

// 选中第二个 input
unfocused  <div tabindex="1">…</div>
focused  <div tabindex="1">…</div>

// 取消选中 div
unfocused  <div tabindex="1">…</div>
```

可以看到在 div 内导航时，虽然选中的元素没有离开 div 内部，但是依然频繁触发了 focus/blur 事件，对判断整个 div 的 focus 状态有很大影响。

处理方式有两种，一种是利用事件的 target 和 relatedTarget 属性来判断事件发生的位置，修改后代码如下：

```jsx
function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log("focused parent");
        } else {
          console.log("focused child", e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log("focus entered parent");
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log("unfocused parent");
        } else {
          console.log("unfocused child", e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log("focus left parent");
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

使用 tab 键按顺序导航元素，输出如下：

```
// 选中 div
focused parent
focus entered parent

// 选中第一个 input
unfocused parent
focused child firstName

// 选中第二个 input
unfocused child firstName
focused child lastName

// 取消选中 div
unfocused child lastName
focus left parent
```

或者自定义一个 hook ，利用防抖的原理来判断是否出现连续的 focus 和 blur。

```tsx
export default function useOnFocusOut(
  onFocusOut: (() => void) | null | undefined
) {
  // 使用 ref 保存传入的回调，避免重渲染导致丢失
  const refCallback = useRef<typeof onFocusOut>(undefined);
  useLayoutEffect(function saveCallback() {
    refCallback.current = onFocusOut;
  });

  // useMemo 防止重渲染后重新声明函数
  return useMemo(() => {
    let timer: number | undefined;
    return {
      onBlur() {
        if (timer == null) {
          return;
        }

        timer = setTimeout(() => {
          if (refCallback.current) {
            refCallback.current();
          }
        });
      },
      onFocus() {
        // blur 后马上 focus 说明焦点还在元素内部
        // 清除计时器
        if (timer == null) {
          clearTimeout(timer);
          timer = undefined;
        }
      },
    };
  }, []);
}
```

TODO：
