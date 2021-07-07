/*
 * @Author: 九玖
 * @Date: 2021-07-07 08:49:39
 * @LastEditTime: 2021-07-07 08:52:22
 * @LastEditors: 九玖
 * @Description: 小区关键词查询
 * @FilePath: \haozuke\src\utils\getCommunity.js
 */

import { httpGet } from "./axios/http";
import { AreaAPI } from "../api";

/**
 * 获取城市信息
 * @param {Function} callback callback 回调函数
 * @param {String} community 小区
 */
const getCommunity = (callback, community) => {
  // 发起请求

  httpGet(AreaAPI.community, { name: community })
    .then(res => {
      if (res.status === 200) {
        // 使用 callback 回调函数异步返回数据
        callback(res.body);
      }
    })
    .catch(err => console.log(err));
};

export default getCommunity;
