/*
 * @Author: 九玖
 * @Date: 2021-06-29 09:37:53
 * @LastEditTime: 2021-06-29 10:54:22
 * @LastEditors: 九玖
 * @Description: 获取当前城市
 * @FilePath: \haozuke\src\utils\getCurrentCity.js
 */

import { httpGet } from "../utils/axios/http";
import { AreaAPI } from "../api";

import { getCity, setCity } from "../utils/storage";

const getCurrentCity = callback => {
  let curCity = getCity();
  if (curCity) {
    // 有数据，直接返回
    callback({ label: "上海", value: "AREA|dbf46d32-7e76-1196" });
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
          httpGet(AreaAPI.info, { name: result.city })
            .then(res => {
              if (res.status === 200) {
                curCity = res.body;
                setCity(curCity);
                callback(curCity);
              }
            })
            .catch(err => console.log(err));
        }
      });
    });
  }
};

export default getCurrentCity;
