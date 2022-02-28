# Vue基础 - MVVM 模型

视图模型双向绑定，是Model-View-ViewModel的缩写。

也就是把MVC中的Controller演变成ViewModel。

Model层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据。

以前是操作DOM结构更新视图，现在是数据驱动视图。


// TODO: note marker