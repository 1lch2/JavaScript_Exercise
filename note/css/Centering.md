# CSS基础 - 居中
## 水平居中
### 行内元素
```css
.parent {
    text-align: center;
}
```

### 块级元素
#### 一般方法
```css
.son {
    margin: 0, auto;
}
```

#### 子元素含float
```css
.parent {
    width: fit-content;
    margin: 0, auto;
}

.son {
    float: left
}
```

#### flexbox
2012 version
```css
.parent {
    display: flex;
    justify-content: center;
}
```
#### 绝对定位
transform
```css
.son {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
}
```

left: 50%
```css
.son {
    position: absolute;
    width: (宽度);
    left: 50%;
    margin-left: -0.5 * (宽度);
}
```

left/right: 0
```css
.son {
    position: absolute;
    width: (宽度);
    left: 0;
    right: 0;
    margin: 0 auto;
}
```

## 垂直居中
### 行内元素
```css
.parent {
    height: (高度);
}

.son {
    line-height: (高度);
}
```

### 块级元素
#### 行内块级元素
```css
.parent::after, .son{
    display: inline-block;
    vertical-align: middle;
}
.parent::after{
    content:'';
    height:100%;
}
```

#### flexbox
```css
.parent {
    display: flex;
    align-items: center;
}
```

#### 绝对定位
transform
```css
.son {
    position: absolute;
    top: 50%;
    transform: translate( 0, -50%);
}
```

top: 50%
```css
.son {
    position: absolute;
    top: 50%;
    height: 高度;
    margin-top: -0.5高度;
}
```

top/bottom: 0
```css
.son {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
}
```