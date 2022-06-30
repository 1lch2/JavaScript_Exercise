# EventEmitter 模块
## Node.js 事件
Node.js 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。

Node.js 里面的许多对象都会分发事件：一个 net.Server 对象会在每次有新连接时触发一个事件， 一个 fs.readStream 对象会在文件被打开的时候触发一个事件。 所有这些产生事件的对象都是 events.EventEmitter 的实例。

## events 模块
events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。

使用示例如下：
```js
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();

event.on('some_event', function() {
    console.log('some_event 事件触发');
});
setTimeout(function() { 
    event.emit('some_event'); 
}, 1000); 

// 一秒后输出
// some_event
```
