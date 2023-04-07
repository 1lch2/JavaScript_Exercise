# React-query

来段不明所以的示例

```jsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { getTodos, postTodo } from "../my-api";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
};

const Todos = () => {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery("todos", getTodos);

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("todos");
    },
  });

  const handleClick = () => {
    mutation.mutate({
      id: Date.now(),
      title: "Do Laundry",
    });
  };

  return (
    <div>
      <ul>
        {query.data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Add Todo</button>
    </div>
  );
};

render(<App />, document.getElementById("root"));
```

## query

借助 useQuery hook 来发起请求。

```ts
const {
  data,
  error,
  isError,
  isIdle,
  isLoading,
  isSuccess,
  status,
}: Result = useQuery(queryKey, queryFn?, {
  onError,
  onSuccess,
  select,
})
```

```ts
interface Props {
  queryKey: string | unknown[];
  queryFn: (context: QueryFunctionContext) => Promise<TData>;
  options?: Options;
}

interface Options {
  enable: boolean; // Set this to false to disable this query from automatically running.
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  select?: (data: TData) => unknown; // This option can be used to transform or select a part of the data returned by the query function.
}

interface Result {
  status: "idle" | "loading" | "error" | "success" | "data";
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  data: TData;
  error: null | TError;
}
```

或者使用另一种语法：

```js
const result = useQuery({
  queryKey,
  queryFn,
  enabled,
});
```

返回的 result 中包含了请求结果的状态：

- `isLoading` or `status === 'loading'` - The query has no data and is currently fetching
- `isError` or `status === 'error'` - The query encountered an error
- `isSuccess` or `status === 'success'` - The query was successful and data is available
- `isIdle` or `status === 'idle'` - The query is currently disabled (you'll learn more about this in a bit)

### queryKeys

queryKeys 可以是 string 或者是数组。传入 string 时候会转化为只有一个元素的数组。

如果传入的 query 函数需要某个参数，那么参数需要被包括在 queryKeys 中。

```js
const result = useQuery(['todos', todoId], () => fetchTodoById(todoId))；
```

### queryFn

queryFn 可以是任何函数，只要返回的是一个 promise 就行。

以下都是有效用法：

```js
useQuery(["todos"], fetchAllTodos);
useQuery(["todos", todoId], () => fetchTodoById(todoId));
useQuery(["todos", todoId], async () => {
  const data = await fetchTodoById(todoId);
  return data;
});
useQuery(["todos", todoId], ({ queryKey }) => fetchTodoById(queryKey[1]));
```

由于函数的参数在 queryKeys 中一块传递了，queryFn 可以从 queryKey 中获取参数

```js
function Todos({ status, page }) {
  const result = useQuery(["todos", { status, page }], fetchTodoList);
}

// Access the key, status and page variables in your query function!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey;
  return new Promise();
}
```

对于使用 query object 形式的用法也一样：

```js
useQuery({
  queryKey: ["todo", 7],
  queryFn: fetchTodo,
  ...config,
});
```

### query 依赖

query 之间可以并行执行，只需要并列地写多个 useQuery 即可，或者可以使用 useQueries hook，传进去一个 query 对象数组。

有的 query 必须等待前一个完成后才能执行，这时应该使用 `enabled` 选项来通知 query 运行的正确时机。

```js
const { data: user } = useQuery(["user", email], getUserByEmail);
const userId = user?.id;

// isIdle 在 enable 为 true 之前会一直保持 true
const { isIdle, data: projects } = useQuery(
  ["projects", userId],
  getProjectsByUser,
  {
    // query 仅会在 useId 不为空时才执行
    enabled: !!userId,
  }
);
```

## mutation

对于需要增删改的带有副作用的请求，需要使用 `useMutation` hook。

```jsx
function App() {
  const mutation = useMutation((newTodo) => {
    return axios.post("/todos", newTodo);
  });

  return (
    <div>
      {mutation.isLoading ? (
        "Adding todo..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: "Do Laundry" });
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
```

通过 useMutation 返回的 mutation 变量，在需要增删改的地方调用 `mutation.mutate()` 并传入参数来调用请求。
