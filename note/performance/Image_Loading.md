# 大量图片加载

> 当页面上有大量图片需要加载时，如何做性能优化？本文从减小体积、提升策略、减少请求、优化体验四个维度进行系统性讲解。

## 优化思路

- **减少请求次数**：降低服务器压力和网络开销。
- **减小图片体积**：加快单个文件的传输速度。
- **提升加载策略**：控制加载优先级，优先保障首屏体验。
- **利用缓存与分发**：利用物理距离和存储机制加速。

## 1. 减小图片体积

选择合适的图片格式是优化图片体积最直接的方式。

### 1.1 现代图片格式

- **WebP / AVIF**：相比传统的 JPEG 和 PNG，WebP 通常能减少 30% 以上的体积，AVIF 则更进一步。
- **SVG**：针对图标、简单矢量图，使用代码描述，体积极小且无损缩放。

### 1.2 图片压缩

使用工具（如 `image-min` 或 CDN 自动压缩）去除图片元数据，降低质量（通常降至 80% 视觉无损）。

## 2. 提升加载策略

### 2.1 懒加载

- **原生支持**：直接在 `<img>` 标签添加 `loading="lazy"`。
- **Intersection Observer**：通过 JS 监听图片是否进入视口，实现更精细的控制。

```javascript
// 使用 Intersection Observer 实现懒加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 将真实地址赋值给 src
      observer.unobserve(img); // 加载后取消观察
    }
  });
});

// 为所有带有 data-src 属性的图片设置观察者
document.querySelectorAll("img[data-src]").forEach((img) => {
  observer.observe(img);
});
```

### 2.2 响应式图片

使用 `srcset` 和 `<picture>` 标签。根据用户的屏幕分辨率（Retina 屏）或设备宽度加载不同尺寸的图片，避免在手机上加载 4K 大图。

```html
<!-- 根据设备像素比选择不同分辨率的图片 -->
<img
  srcset="image-1x.png 1x, image-2x.png 2x, image-3x.png 3x"
  src="image-1x.png"
  alt="响应式图片示例"
/>
```

### 2.3 异步解码

给图片添加 `decoding="async"` 属性，防止图片解码过程阻塞主线程渲染。

```html
<img src="large-image.jpg" decoding="async" alt="异步解码图片" />
```

## 3. 减少网络请求

### 3.1 精灵图

将多个小图标合成一张大图。虽然在 HTTP/2 下必要性降低，但在处理大量小图标时依然有效。

### 3.2 Base64 内联

对于极小的图标（如 < 2KB），可以直接转为 Base64 嵌入 CSS 或 HTML，减少一次 HTTP 请求。

### 3.3 HTTP/2 多路复用

确保服务器开启 HTTP/2，解决浏览器对同域名并发请求限制的问题。

## 4. 优化感知体验

### 4.1 占位技巧

- **Blur-up**：加载一张极小的模糊缩略图（Base64），待大图加载完后再替换。
- **骨架屏**：在图片位置显示灰色占位块，缓解用户等待焦虑。

### 4.2 CDN 分发

将图片部署在 CDN 上，利用地理位置最近的节点进行分发，并设置长效缓存策略（Cache-Control）。

## 💡 进阶思考题

> 在面试中，面试官可能会追问：「如果图片非常多，懒加载虽然能减少首屏压力，但用户快速滚动时会出现白屏，你会怎么处理？」

**参考回答方向：**

- **预加载**：对当前视口下方 1-2 屏的图片进行预加载，而不是等到进入视口才开始。
- **优先级提示**：使用 `fetchpriority="high"` 显式告知浏览器哪些核心图片（如 Hero Image）需要最先下载。
