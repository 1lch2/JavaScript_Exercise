import axios from "axios";

const pendingMap = new Map();

/**
 * 生成每个请求唯一的键
 * @param {{ url: string, method: string, params, data }} config 
 * @return {string} request key
 */
function getPendingKey(config) {
  let { url, method, params, data } = config;
  if (typeof data === "string") {
    // response 返回的 config.data 是字符串
    data = JSON.parse(data);
  }
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join("&");
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {any} config 
 */
function addPending(config) {
  const pendingKey = getPendingKey(config);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingMap.has(pendingKey)) {
      pendingMap.set(pendingKey, cancel);
    }
  });
}

/**
 * 删除重复的请求
 * @param {any} config 
 */
function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

export const myAxios = (axiosConfig) => {
  const service = axios.create({
    baseURL: "http://localhost:8888",
    timeout: 10000,
  });

  service.interceptors.request.use(
    config => {
      removePending(config);
      addPending(config);
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  service.interceptors.response.use(
    response => {
      removePending(response.config);
      return response;
    },
    error => {
      if (!error.config) {
        removePending(error.config);
      }
      return Promise.reject(error);
    }
  );

  return service(axiosConfig);
};
