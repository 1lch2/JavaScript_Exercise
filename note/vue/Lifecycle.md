# Vue基础 - 生命周期

|    生命周期   |                                  描述                                 |
|:-------------:|:---------------------------------------------------------------------:|
| beforeCreate  | 组件实例被创建之初，组件的属性生效之前                                |
| created       | 组件实例已经完全创建，属性也绑定，但真实 dom 还没有生成，$el 还不可用 |
| beforeMount   | 在挂载开始之前被调用：相关的 render 函数首次被调用                    |
| mounted       | el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子             |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前                       |
| update        | 组件数据更新之后                                                      |
| activited     | keep-alive 专属，组件被激活时调用                                     |
| deactivated   | keep-alive 专属，组件被销毁时调用                                     |
| beforeDestory | 组件销毁前调用                                                        |
| destoryed     | 组件销毁后调用                                                        |

## 创建阶段
- beforeCreate：实例刚在内存中创建出来，还没有初始化 data 和  methods，只包含一些自带额生命周期函数
- created： 实例已经在内存中创建完成，此时data和methods已经创建完成
- beforeMount： 此时已经完成了模版的编译，只是还没有渲染到界面中去
- mounted： 模版已经渲染到了浏览器，创建阶段结束，即将进入运行阶段

## 运行阶段
- beforeUpdate： 界面中的数据还是旧的，但是data数据已经更新，页面中和data还没有同步
- 中间处理过程（非生命周期，便于学习抽象化的中间处理过程）： 先根据data中的数据，在内存中渲染出一个新的DOM，当新的DOM树更新之后，会重新渲染到真实的界面中去，从而实现了从 数据层（model）---》视图层（view）的转换
- updated： 页面重新渲染完毕，页面中的数据和data保持一致

## 销毁阶段
- beforeDestroy： 执行该方法的时候，Vue的生命周期已经进入销毁阶段，但是实例上的各种数据还出于可用状态
- destroyed： 组件已经全部销毁，Vue实例已经被销毁，Vue中的任何数据都不可用

## 嵌套组件的生命周期
- 挂载阶段：父组件 beforeMount -> 子组件 created -> 子组件 mounted -> 父组件 mounted
- 更新阶段：父组件 beforeUpdate -> 子组件 beforeUpdate -> 子组件 updated -> 父组件 updated
- 销毁阶段：父组件 beforeDestroy -> 子组件 beforeDestroy -> 子组件 destroyed -> 父组件 destroyed
