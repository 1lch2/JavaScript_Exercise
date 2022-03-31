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
.parent {
    position: relative;
}

.son {
    position: absolute;
    top: 50%;
}
```

## 水平垂直居中
```html
<div class="layout">
    <div class="center"></div>
</div>
```

### flex
```css
div.layout {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### position: absolute
```css
div.layout {
    position: relative;
}

div.center {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
```


TODO: fix error