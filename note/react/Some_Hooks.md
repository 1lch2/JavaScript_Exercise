# 一些常用的Hook

## useImperativeHandle
这个 hook 一般用来将子组件内的方法暴露给父组件。一般需要和 `forwardRef` 这个高阶组件方法配合使用。

### 参数
```jsx
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

- ref：从 forwardRef 方法中获取到的第二个参数
- createHandle：第二个参数，是一个函数。不接受参数，在这里返回你想暴露的 ref handle。这个 ref handle 可以是任何类型，一般情况都是返回一个包含方法的对象。
- dependency：可选参数。

### 用法

#### 将一个自定义的 ref handle 暴露给父组件
示例代码如下：

```jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // 通常情况使用 ref 是为了把 DOM 对象暴露给父组件
  // 但也可以用来暴露自定义的值
  const inputRef = useRef(null);

  // 这里通过 ref 转发，让父组件可以通过 ref 访问到返回对象中的两个方法
  // 假设这里不想暴露子组件的DOM节点，但又想让父组件可以使用 focus 和 scrollToView
  // 那么利用这个hook，就可以只暴露需要的方法而不是整个 DOM 节点
  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});


export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    // 这里的 ref 并没有暴露子组件的 DOM 节点，因此不能用来操作子组件的DOM
    ref.current.focus();

    // 这里的操作不起作用，因为 ref.current 不是 DOM 节点
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

#### 暴露自己的命令式方法
其实就是前一种办法，只不过将返回的函数换成多个DOM上操作的组合。

代码示例如下：
```jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    // 这里使用的方法是是子组件组合出来的
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}


const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      // 组合多个DOM方法并返回
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});


const CommentList = forwardRef(function CommentList(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});


const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Add comment..." ref={ref} />;
});
```

> **注意事项：**
>
> 不要过度依赖 ref，如果某些操作能用 props 表示就别用 ref。比如用一个 isOpen 来控制 Modal 的开关。