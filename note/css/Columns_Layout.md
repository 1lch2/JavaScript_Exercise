# CSS - 双栏，三栏布局
## 双栏布局
样式：边栏定宽，主栏自适应

### 1. float + overflow（BFC 原理）
```html
<div>
    <aside></aside>
    <main></main>
</div>
```

```css
aside {
    float: left;
    width: 200px
}

main {
    overflow: hidden
}
```

### 2. float + margin
```html
<div>
    <!-- aside 必须在前，否则 aside 会在下一行 -->
    <aside></aside>
    <main></main>
</div>
```

```css
aside {
    float: left;
    width: 200px;
}

main {
    margin-left: 200px;
}
```

### 3. flex
```html
<div class="layout">
    <aside></aside>
    <main></main>
</div>
```

```css
.layout {
    display: flex;
}

aside {
    width: 200px;
}

main {
    flex: 1;
}
```

### 4. grid
```html
<div class="grid">
    <aside></aside>
    <main></main>
</div>
```

```css
.grid {
    display: grid;
    grid-template-columns: 200px auto;
}
```

## 三栏布局
样式：左右两侧栏定宽，主栏自适应

### 1. 圣杯布局
样式如图
![img](../static/Columns_Layout.png)

flex 实现方法如下所示
```html
<body class="HolyGrail">
  <header>...</header>
  <div class="HolyGrail-body">
    <main class="HolyGrail-content">...</main>
    <nav class="HolyGrail-nav">...</nav>
    <aside class="HolyGrail-ads">...</aside>
  </div>
  <footer>...</footer>
</body>
```

```css
.HolyGrail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

header,
footer {
  flex: 1;
}

.HolyGrail-body {
  display: flex;
  flex: 1;
}

.HolyGrail-content {
  flex: 1;
}

.HolyGrail-nav, .HolyGrail-ads {
  /* 两个边栏的宽度设为12em */
  flex: 0 0 12em;
}

.HolyGrail-nav {
  /* 导航放到最左边 */
  order: -1;
}
```

### 2. 双飞翼布局
TODO: 

### 3. float + overflow（BFC 原理）

### 4. flex
效果如图

![img](../static/Columns_Layout_2.png)

```html
<section class="layout">
  <aside>aside</aside>
  <main>main</main>
  <aside>aside</aside>
</section>
```

```css
.layout {
  display: flex;
}

aside {
  width: 200px;
}

main {
  flex: 1;
}
```

### 5. grid
```html
<div class="container">
    <div></div>
    <div></div>
    <div></div>
</div>
```
```css
.container {
    display: grid;
    grid-template-columns: 200px auto 200px;
}
```