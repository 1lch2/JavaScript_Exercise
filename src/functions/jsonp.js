/**
 * JSONP 
 * 
 * script 标签不受同源策略约束，所以可以用来进行跨域请求.
 * 优点是兼容性好，但是只能用于 GET 请求
 * @param {Object} param request object
 * @returns 
 */
function jsonp({
  url,
  params,
  callbackName
}) {
  const generateUrl = () => {
    let dataSrc = "";
    // 添加 GET 参数
    for (let key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        dataSrc += `${key}=${params[key]}&`;
      }
    }
    dataSrc += `callback=${callbackName}`;
    return `${url}?${dataSrc}`;
  };

  return new Promise((resolve, reject) => {
    const container = document.getElementsByTagName("head")[0];
    const scriptEle = document.createElement("script");
    scriptEle.src = generateUrl();
    container.appendChild(scriptEle);

    // 将回调函数注册到 window 对象上
    // 同时需要保证属性名唯一
    window[callbackName] = function(data) {
      container.removeChild(scriptEle);
      delete window[callbackName];
      resolve(data);
    };

    // 异常处理
    scriptEle.onerror = function() { 
      container.removeChild(scriptEle);
      delete window[callbackName];
      reject("Error");
    };
  });
}

// 使用JSONP
jsonp({
  url: "https://jsonplaceholder.typicode.com/users",
  params: [],
  callbackName: "sample"
}).then((response) => {
  console.log(response);
});