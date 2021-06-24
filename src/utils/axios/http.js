/**
 * 封装GET、POST、PUT、DELETE方法
 */

// 引入config.js
import request from "./request";
import { baseHost } from "../../config";

/**
 * @method httpGet
 *
 * import { httpGet } from '@/utils/http';
 *
 * httpGet('', payload).then().catch();
 *
 * @param {*} url [ 请求地址 ]
 * @param {*} payload [ 请求参数 ]
 * @param {*} type [ 设置 baseURL ]
 */
export const httpGet = async (url, payload, type = "API1") => {
  try {
    request.defaults.baseURL = baseHost[type];
    const response = await request.get(`${url}`, {
      params: payload,
    });

    const result = response.data;
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @method httpPost
 *
 * import { httpPost } from '@/libraries/axios/http'
 *
 * httpPost('', payload).then().catch()
 *
 * @param { String } url  [ 请求地址 ]
 * @param { Object } payload  [ 请求参数 ]
 */
export const httpPost = async (url, payload, type = "API1") => {
  try {
    request.defaults.baseURL = baseHost[type];
    const response = await request.post(`${url}`, payload);

    const result = response.data;
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @method httpPut
 *
 * import { httpPut } from '@/utils/http'
 *
 * httpPut('', payload).then().catch()
 *
 *
 * @param {*} url [ 请求地址 ]
 * @param {*} payload [ 请求参数 ]
 * @param {*} type [ 设置 baseURL ]
 */
export const httpPut = async (url, payload, type = "API1") => {
  try {
    request.defaults.baseURL = baseHost[type];
    const response = await request.put(`${url}`, payload);

    const result = response.data;
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @method httpDelete
 *
 * import { httpDelete } from '@/utils/http'
 *
 * httpDelete('', payload).then().catch()
 *
 * @param {*} url [ 请求地址 ]
 * @param {*} payload [ 请求参数 ]
 * @param {*} type [ 设置 baseURL ]
 */
export const httpDelete = async (url, payload, type = "API1") => {
  try {
    request.defaults.baseURL = baseHost[type];
    const response = await request.delete(`${url}`, {
      data: payload,
    });

    const result = response.data;
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
