# HTTP 请求
## fetch
基于 Promise 实现的 HTTP 请求方法，并不是基于 XHR

### 用法
```js
Promise<Response> = fetch(input[, init]);
```
返回值是一个 Promise，resolve 后是一个 Response 对象。

input 可以是一个URL字符串或者是 Request 对象。

init 是个配置对象，包括以下几个常用属性：
- method: 请求使用的方法，如 GET、POST。
- headers: 请求的头信息，形式为 Headers 的对象或包含 ByteString 值的对象字面量。
- body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
- mode: 请求的模式，如 cors、no-cors 或者 same-origin。
- credentials: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie，必须提供这个选项，从 Chrome 50 开始，这个属性也可以接受 FederatedCredential (en-US) 实例或是一个 PasswordCredential (en-US) 实例。
- cache: 请求的 cache 模式：default、 no-store、 reload 、 no-cache、 force-cache 或者 only-if-cached。
- redirect: 可用的 redirect 模式：follow (自动重定向), error (如果产生重定向将自动终止并且抛出一个错误），或者 manual (手动处理重定向)。在 Chrome 中默认使用 follow（Chrome 47 之前的默认值是 manual）。
- referrer: 一个 USVString 可以是 no-referrer、client 或一个 URL。默认是 client。

示例如下：
```js
fetch('http://example.com/movies.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

> 注意：fetch 在收到 400 或 500 系列的状态码时，仍然会执行 resolve，而不是 reject。只有当网络错误时才会执行 reject。

对于常见的跨域POST请求JSON的场景，示例如下：
```js
// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData('https://example.com/answer', { answer: 42 })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
```


## Axios
> Axios 基于 XHR，而 fetch 是单独的底层 API

### 使用
Axios 提供了两种不同的形式来发送 HTTP 请求，一种是通过 `axios()` 方法。

该方法接收一个对象，这个对象包含了一些对请求的配置， axios 会根据这些配置来发送对应的 HTTP 请求，请求响应的处理在 then 和 catch 回调中，请求正常会进入 then ，请求异常则会进 catch，示例如下：

```js
axios({
  method: 'get',  // 若不设置，则默认为get
  baseURL: '',  // 请求的域名，基本地址
  url: '',  // 请求的路径
  params: {},  // 会将请求参数拼接在url上
  data: {},  // 会将请求参数放在请求体中
  headers: {},  // 设置请求头，例如设置token等
  timeout: 1000,  // 设置请求超时时长，单位：ms
}).then(res => {
    console.log(res);
}).catch(e => {
    consol.log(e);
})
```

另一种是分别通过 axios 对象提供的与 HTTP 方法对应的方法来发起请求，有以下几种：

- `axios.request(config)`
- `axios.get(url, [config])`
- `axios.post(url, [data], [config]])`
- `axios.delete(url, [config])`
- `axios.head(url, [config])`
- `axios.put(url, [data], [config])`
- `axios.patch(url, [data], [config]])`
- `axios.options(url, [config])`

Axios 方法的响应结果结构如下：
```js
{
  // `data` 由服务器提供的响应
  data: {},
  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,
  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',
  // `headers` 服务器响应的头
  headers: {},
   // `config` 是为请求提供的配置信息
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

一般只用关心 data 属性即可。

### 配置
#### 全局配置
通过 `axios.defaults` 来设置全局配置，示例如下：
```js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

#### 自定义示例配置
```js
// 创建一个 axios 实例
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

// 修改自定义实例的默认值
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```

如果存在全局配置，那么自定义的实例配置会覆盖掉全局配置

### 拦截器
可以在发起请求前和收到响应后做处理，示例如下：

请求拦截器
```js
axios.interceptors.request.use(function (config) {
  // 处理请求
  config.header["Token"] = "xxxx"
  return config;
}, function (error) {
  // 处理请求错误
  return Promise.reject(error);
});
```

响应拦截器
```js
axios.interceptors.response.use(function (response) {
  // 处理响应数据
  if (response.status === 200){
    return response.data
  } else {
    return Promise.reject(new Error('error'))
  }
}, function (error) {
  // 处理请求错误
  return Promise.reject(error);
});
```

对 axios 实例添加拦截器
```js
const instance = axios.create();
instance.interceptors.request.use(config => {});
```

若想移除拦截器，则应使用一个变量存储拦截器实例，传入 eject 方法取消
```js
const myInterceptor = axios.interceptors.request.use(config => {});
axios.interceptors.request.eject(myInterceptor);
```
