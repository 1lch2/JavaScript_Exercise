/* eslint-disable no-prototype-builtins */

/**
 * 解析URL的参数，并返回一个对象
 * @param {String} url 
 * @returns {Object}
 */
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};

  // 将 params 存到对象中
  paramsArr.forEach(param => {
    if (/=/.test(param)) { // 处理有 value 的参数
      let [key, val] = param.split("="); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else { // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else { // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}

/**
 * my implementation
 * 
 * extract query string as json object from an url
 * @param {String} url url containing query string
 */
const parseQueryString = function(url) {
  if (typeof (url) !== "string") {
    return {};
  }

  let queryIndex = url.indexOf("?");
  if (queryIndex === -1) {
    return {};
  }

  let queryString = url.split("?")[1];
  let shouldDecodeUrl = queryString.indexOf("%") !== -1;
  if (shouldDecodeUrl) {
    queryString = decodeURIComponent(queryString);
  }

  let result = {};
  // check if value is integer
  let regex = /^[0-9]*$/;
  let params = queryString.split("&");
  for (let each of params) {
    let pair = each.split("=");
    result[pair[0]] = regex.test(pair[1]) ? parseInt(pair[1], 10) : pair[1];
  }

  return result;
};

// test case
let input = "https://steamcommunity.com/workshop/browse/?appid=431960&searchtext=%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F&childpublishedfileid=0&browsesort=totaluniquesubscribers&section=readytouseitems&requiredtags%5B0%5D=Everyone&excludedtags%5B0%5D=MMD&created_date_range_filter_start=0&created_date_range_filter_end=0&updated_date_range_filter_start=0&updated_date_range_filter_end=0&actualsort=totaluniquesubscribers&p=5";

console.log(parseQueryString(input));