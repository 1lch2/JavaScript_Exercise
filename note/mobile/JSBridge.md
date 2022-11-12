# JSBridge
实现移动客户端原生方法和JS的交互，这里只讨论 Android 中使用 WebView 实现的方法。

JSBridge的实现主要有两点：
1. 将Native端原生接口封装成JavaScript接口
2. 将Web端JavaScript接口封装成原生接口

## 基础要点
### scheme
App 在手机上安装后，会使用 `AndroidManifest.xml` 中指定的值注册scheme，之后在访问以这个特定 scheme 开头的 URL 时，Android系统会启动对应的 app。示例如下：
```xml
<activity>
    <intent-filter>
    <data android:scheme="baiduboxapp"
        android:host="string"
        android:port="string"
        android:path="string"
        android:pathPattern="string"
        android:pathPrefix="string"
        android:mimeType="string" />
    </intent-filter>
</activity>
```

## Native -> Web
Native 调用 JS 一般就是直接执行 JS 代码字符串，一般可以用 `loadUrl` （Android 4.4 前）或者 `evaluateJavascript` （4.4 之后）方法。客户端能访问到的方法仅限于挂载到 `window` 对象上的。

具体到Android上，需要配合系统版本判断使用，示例如下：
```java
if (Build.VERSION.SDK_INT > 19) {
    webView.evaluateJavascript("javascript:foo()", null);
} else {
    webView.loadUrl("javascript:foo()");
}
```

使用 evaluateJavascript 可以传入一个匿名内部类来获取返回值来执行回调，示例如下：
```java
String jsCode = String.format("window.showWebDialog('%s')", text);
webView.evaluateJavascript(jsCode, new ValueCallback<String>() {
  @Override
  public void onReceiveValue(String value) {
    // callback
  }
});
```

## Web -> Native
### 拦截 scheme
WebView中所有的请求都可以被拦截，通过重写 WebView 的方法可以实现对原生方法调用的拦截。

Web 请求主要有以下几种：
1. `<a>`标签
    ```html
    <a href="baiduboxapp://swan/xxxxx?query=value"></a>
    ```
    需要主动点击
2. `location.href`
    ```js
    location.href = "baiduboxapp://swan/xxxxx?query=value"
    ```
    连续调用`location.href`会导致消息丢失，因为WebView限制连续跳转次数

3. iframe 的 src 属性
    ```js
    const iframe = document.createElement("iframe");
    iframe.src = "baiduboxapp://swan/xxxxx?query=value";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    ```
4. Ajax 请求
    
    Android 上无法拦截

Android端重写 WebViewClient 类的方法可以实现对特定 scheme 的拦截：
```java
@SuppressLint("SetJavaScriptEnabled")
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    // Get WebView object and enable JS
    WebView webView = (WebView) findViewById(R.id.webview);
    WebSettings webSettings = webView.getSettings();
    webSettings.setJavaScriptEnabled(true);

    // Set WebViewClient to disable customized URL scheme
    webView.setWebViewClient(new WebViewClient() {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url.startsWith("baiduboxapp")) {
                // 拿到调用路径后解析调用的指令和参数，根据这些去调用 Native 方法
            }

            // 如果返回false，则WebView处理链接url，如果返回true，代表WebView根据程序来执行url
            return false;
        }
    });
}
```

### 注入JS上下文
Android 4.2 以上需要使用 `addJavascriptInterface` 方法注入JS，同时提供了 `@JavascriptInterface` 注解标记可以被WebView调用的原生方法，示例如下：
```java
// 注入全局JS对象
webView.addJavascriptInterface(new NativeBridge(this), "NativeBridge");

class NativeBridge {
  private Context ctx;

  NativeBridge(Context ctx) {
    this.ctx = ctx;
  }

  // 增加JS调用接口
  @JavascriptInterface
  public void showNativeDialog(String text) {
    new AlertDialog.Builder(ctx).setMessage(text).create().show();
  }
}
```

在WebView中调用方法如下：
```js
window.NativeBridge.showNativeDialog('hello');
```
这里注册到 window 上的对象名对应 addJavascriptInterface 方法的第二个参数。

### 弹窗拦截
利用弹窗会触发 WebView 相应事件来拦截。安卓一般是在 `webview.setWebChromeClient` 里面的 onJsAlert、onJsConfirm、onJsPrompt 方法
拦截并解析他们传来的消息，示例如下：
```java
// 拦截 Prompt
@Override
public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
    if (xxx) {
        // 解析 message 的值，调用对应方法
    }
    return super.onJsPrompt(view, url, message, defaultValue, result);
}

// 拦截 Confirm
@Override
public boolean onJsConfirm(WebView view, String url, String message, JsResult result) // 拦截 Alert

@Override
public boolean onJsAlert(WebView view, String url, String message, JsResult result)
```

## 处理回调
在一端调用的时候在参数中加一个 callbackId 标记对应的回调函数。

以web调用native为例，前端封装 callbackId：
```js
let id = 1;
// 根据id保存callback
const callbackMap = {};
// 使用JSSDK封装调用与Native通信的事件，避免过多的污染全局环境
window.JSSDK = {
    // 获取Native端输入框value，带有回调
    getNativeEditTextValue(callback) {
        const callbackId = id++;
        callbackMap[callbackId] = callback;
        // 调用JSB方法，并将callbackId传入
        window.NativeBridge.getNativeEditTextValue(callbackId);
    },

    // 接收Native端传来的callbackId
    receiveMessage(callbackId, value) {
        if (callbackMap[callbackId]) {
            // 根据ID匹配callback，并执行
            callbackMap[callbackId](value);
        }
    }
};

const showBtn = document.querySelector('#showBtn');
showBtn.addEventListener('click', e => {
// 通过JSSDK调用，将回调函数传入
window.JSSDK.getNativeEditTextValue(value => window.alert('Natvie输入值：' + value));
});
```

Android端完成调用时，携带 callbackId 调用一次前端方法，完成消息的传递。

```java
// Android端代码
webView.addJavascriptInterface(new NativeBridge(this), "NativeBridge");

class NativeBridge {
    private Context ctx;

    NativeBridge(Context ctx) {
        this.ctx = ctx;
    }

    @JavascriptInterface
    public void getNativeEditTextValue(int callbackId) {
        MainActivity mainActivity = (MainActivity)ctx;
        // 获取Native端输入框的value
        String value = mainActivity.editText.getText().toString();

        // 需要注入在Web执行的JS代码
        String jsCode = String.format("window.JSSDK.receiveMessage(%s, '%s')", callbackId, value);

        // 在UI线程中执行
        mainActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mainActivity.webView.evaluateJavascript(jsCode, null);
            }
        });
  }
}
```
