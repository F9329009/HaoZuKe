/*
 * @Author: 九玖
 * @Date: 2021-06-29 09:37:53
 * @LastEditTime: 2021-07-09 08:11:05
 * @LastEditors: 九玖
 * @Description: 获取城市信息
 * @FilePath: \haozuke\src\utils\getCityInfo.js
 */

import { httpGet } from "./axios/http";
import { AreaAPI } from "../api";

import { getCity, setCity } from "./storage";

/**
 * 获取城市信息
 * @param {Function} callback callback 回调函数
 * @param {String} city 城市 默认：当前定位城市
 */
const getCityInfo = (callback, city) => {
  let curCity = getCity();
  // 判断是否有指定城市
  if (city) {
    getInfo(city);
  } else {
    if (curCity) {
      // 有数据，直接返回
      callback(curCity);
    } else {
      // 没有数据，获取定位数据
      window.AMap.plugin("AMap.Geolocation", function () {
        const geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          GeoLocationFirst: true,
        });

        geolocation.getCityInfo(function (status, result) {
          console.log("getCityInfo", status, result);
          if (status === "complete") {
            getInfo(result.city);
          }
        });
      });
    }
  }

  // 发起请求
  function getInfo(name) {
    httpGet(AreaAPI.info, { name })
      .then(res => {
        if (res.status === 200) {
          curCity = res.body;
          // 保存到 localStorage
          setCity(curCity);
          // 使用 callback 回调函数异步返回数据
          callback && callback(curCity);
        }
      })
      .catch(err => console.log(err));
  }
};

export default getCityInfo;
