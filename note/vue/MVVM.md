# Vue基础 - MVVM 模型

Model - View - ViewModel

## Model
placehodler

## View
placehodler

## ViewModel
包括 DOM Listeners 和 Data Binding 两部分。

- 从 Model 到 View 的映射，也就是 Data Bindings 。
    
    可以节省手动 update View 的代码和时间。

- 从 View 到 Model 的事件监听，也就是 DOM Listeners。
    
    Model 会随着 View 触发事件而改变。数据的请求和视图的请求完全解耦(相互影响)。

## MVC 和 MVVM 的区别
MVC - Model View Controller。

C 指页面业务逻辑。使用 MVC 的目的就是将 M 和 V 的代码分离，但 MVC 是单向通信，也就是将 Model 渲染到 View 上，必须通过 Controller 来承上启下。

MVC 和 MVVM 的区别(关系)并不是 ViewModel 完全取代了 Controller 。

ViewModel 目的在于抽离 Controller 中的数据渲染功能，而不是替代。
其他操作业务等还是应该放在 Controller 中实现，这样就实现了业务逻辑组件的复用。

## Vue 如何体现MVVM思想
- mustache语法（`{{ }}`），实现了数据与视图的绑定。
- `v-on` 事件绑定，通过事件操作数据时，v-model 会发生相应的变化。

// TODO: note marker