# 防抖与节流

## 防抖

在第一次触发事件时，不立即执行函数，等待指定的事件，如果在时间阈值内又被触发，则重新计时。

```js
/**
 * 防抖函数
 * @param {Function} func 待进行防抖处理的函数
 * @param {Number} timeout 等待时间阈值
 * @returns {Function} 经过防抖处理的函数
 */
function debounce(func, timeout) {
  let timer;

  return function () {
    // 保存this的指向
    let context = this;
    // 获取event对象
    let args = arguments;

    clearTimeout(timer); // 第一次先取消调用
    timer = setTimeout(function () {
      func.apply(context, args); // 定时结束后再调用
    }, timeout);
  };
}
```

### 效果

设事件阈值为 n。

若每次触发后的 n 时间内继续触发，则会一直等待到最后一次触发，等待阈值时间后触发一次。

若距离上一次触发超过了 n 秒，则正常触发下一次。

## 节流

每隔一段时间，只执行一次函数。

控制函数触发的最高频率，而不是次数。

```js
/**
 * 节流函数 - 定时器写法
 * @param {Function} fn
 * @param {Number} delay
 * @returns {Function}
 */
function throttle(func, delay) {
  let flag = true; // 第一次开放调用

  return function (...args) {
    if (!flag) {
      return;
    }

    flag = false; // 执行之后拒绝后续所有调用
    setTimeout(() => {
      func.apply(this, args);
      flag = true; // 定时时间到，开放调用
    }, delay);
  };
}
```

### 效果

在规定时间阈值内触发多次，会先**在定时结束之后**执行一次。

若在一段较长时间内，以小于阈值的间隔连续不断触发，则会每隔阈值时间运行一次。

### 改进版

添加选项可以在第一次执行时候立刻执行，而不需要等定时器到时间再执行第一次：

```js
function throttle(func, delay) {
  let timer = null;
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    // 如果是第一次调用（lastCall为0）或已经超过延迟时间
    if (remaining <= 0 || lastCall === 0) {
      // 立即执行
      func.apply(this, args);
      lastCall = now;
    } else if (!timer) {
      // 设置定时器，在剩余时间后执行
      timer = setTimeout(() => {
        func.apply(this, args);
        lastCall = Date.now();
        timer = null;
      }, remaining);
    }
  };
}
```
