# requestAnimationFrame
## 用法
requestAnimationFrame 要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

> 若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 window.requestAnimationFrame() 

使用 cancelAnimationFrame(handlerId) 可以取消动画回调

## 执行过程
1. 首先要判断document.hidden属性是否为true,即页面处于可见状态下才会执行；
2. 浏览器清空上一轮的动画函数；
3. 这个方法返回的handlerId 值会和动画函数 callback，以 (handlerId , callback) 进入到动画帧请求回调函数列；
4. 浏览器会遍历动画帧请求回调函数列表，根据 handlerId 的值大小，依次去执行相应的动画函数。


## 对比 setTimeout
### setTimeout
setTimeout的执行时间并不是确定的。

在Javascript中， setTimeout 任务被放进了宏任务队列中，只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，因此 setTimeout 的实际执行时间一般要比其设定的时间晚一些。

刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 setTimeout只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。

以上两种情况都会导致setTimeout的执行步调和屏幕的刷新步调不一致，从而引起丢帧现象。

除此之外，setTimeout的执行只是在内存中对图像属性进行改变，这个变化必须要等到屏幕下次刷新时才会被更新到屏幕上。

## requestAnimationFrame
requestAnimationFrame 最大的优势是由系统来决定回调函数的执行时机，能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

主要优势：
1. CPU节能：
   - 使用setTimeout实现的动画，当页面被隐藏或最小化时，setTimeout 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。
   - 而requestAnimationFrame则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的requestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。
2. 函数节流：
   - 在高频率事件(resize,scroll等)中，为了防止在一个刷新间隔内发生多次函数执行，使用requestAnimationFrame可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销。一个刷新间隔内函数执行多次时没有意义的，因为显示器每16.7ms刷新一次，多次绘制并不会在屏幕上体现出来。

