/**
 * Ajax GET request
 * @param {string} url request URL
 * @param {object} data request params
 * @return {Promise} request Promise
 */
function ajax(url, data) {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.ontimeout = () => {
      reject("timeout");
    };

    xhr.onerror = (err) => {
      reject(err);
    };

    // Handling response
    xhr.onreadystatechange = () => {
      if(xhr.readyState !== 4) {
        return;
      }

      if(xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText);
      } else {
        reject("status code: " + xhr.status);
      }
    };

    // Encode request params
    let paramList = [];
    if(!(data instanceof Object)) {
      reject("param is not an object");
    }
    for(let key in data) {
      paramList.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }

    // Concat query strings
    let questionIndex = url.indexOf("?");
    if(questionIndex === -1) {
      url += "?";
    }
    url += paramList.join("&");

    // Sending request
    xhr.open("get", url);
    xhr.send();
  });
}