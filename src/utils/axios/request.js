// axios 配置项

// 引入 axios 库
import axios from "axios";
// 创建 axios 实例
const instance = axios.create({
  // 返回数据类型
  responseType: "json",
  // 超时时间
  timeout: 6000,
  // 最大发包长度
  maxContentLength: 2000,
  // 重试次数
  retry: 3,
  // 重试延时，3秒重试一次
  retryDelay: 3000,
  // 重试条件，默认只要是错误都需要重试
  shouldRetry: () => true,
});

// 3.声明请求拦截器
instance.interceptors.request.use(
  config => {
    // 在 headers 头上添加参数
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 4.声明响应拦截器
instance.interceptors.response.use(
  response => {
    const { status: code } = response;

    // 对后端的一些状态码进行处理
    switch (code) {
      // 这里可以跟你们的后台开发人员协商好统一的错误状态码
      // 如果返回的状态码为200说明接口请求成功
      // 否则的话抛出错误
      case 200:
        // 请求成功
        return Promise.resolve(response);
      case 400:
        // 请求错误
        return Promise.reject(response);
      case 401:
        // error.message = "未授权，请重新登录";
        break;
      case 403:
        // error.message = "拒绝访问";
        break;
      case 404:
        // error.message = "请求错误,未找到该资源";
        // window.location.href = "/NotFound";
        break;
      case 405:
        // error.message = "请求方法未允许";
        break;
      case 408:
        // error.message = "请求超时";
        break;
      case 500:
        // error.message = "服务器端出错";
        break;
      case 501:
        // error.message = "网络未实现";
        break;
      case 502:
        // error.message = "网络错误";
        break;
      case 503:
        // error.message = "服务不可用";
        break;
      case 504:
        // error.message = "网络超时";
        break;
      case 505:
        // error.message = "http版本不支持该请求";
        break;
      default:
        return Promise.resolve(response);
    }
  },
  error => {
    // 获取 error 对象的 config 属性
    const { config } = error;
    // 如果 config 不存在，或者 retry 选项没有设置，用 reject
    if (!config || !config.retry) return Promise.reject(error);

    // 设置变量来跟踪重试次数
    config.__retryCount = config.__retryCount || 0;

    // 检查我们重试的次数是否超出最大重试次数
    if (config.__retryCount >= config.retry) {
      // 使用 reject 方法抛出错误
      Notification({
        title: "请求超时",
        message: "当前网络不佳，请稍后刷新重试",
      });

      return Promise.reject(error);
    }

    // 计算重试次数
    config.__retryCount += 1;
    // 创建一个新的 Promise 来处理 exponential backOff
    let backOff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1);
    });

    // return the promise in which  recalls axios to retry the request
    return backOff.then(function () {
      return instance(config);
    });
  }
);

export default instance;
