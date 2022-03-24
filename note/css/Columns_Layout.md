# CSS - 双栏，三栏布局
## 双栏布局
样式：边栏定宽，主栏自适应

### 1. float + overflow（BFC 原理）
```html
<div>
    <main></main>
    <aside></aside>
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
    <main></main>
    <aside></aside>
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
    <main></main>
    <aside></aside>
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
    <main></main>
    <aside></aside>
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
```html
<section class="layout">
    <main>main</main>
    <aside class="left">aside</aside>
    <aside class="right">aside</aside>
</section>
```

```css
.layout {
    padding: 0 200px;
}

main {
    float: left;
    width: 100%;
}

aside {
    float: left;
    width: 200px;
}

.left {
    position: relative;
    left: -200px;
    margin-left: -100%;
}

.right {
    position: relative;
    right: -200px;
    margin-left: -100%;
}
```

### 2. 双飞翼布局

### 3. float + overflow（BFC 原理）

### 4. flex
```html
<section class="layout">
    <aside class="left">aside</aside>
    <main>main</main>
    <aside class="right">aside</aside>
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

TODO: