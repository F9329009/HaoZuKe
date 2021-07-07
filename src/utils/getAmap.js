/*
 * @Author: 九玖
 * @Date: 2021-07-02 10:00:39
 * @LastEditTime: 2021-07-05 09:31:16
 * @LastEditors: 九玖
 * @Description: 获取高德地图定位信息
 * @FilePath: \haozuke\src\utils\getAmap.js
 */

/**
 * 获取高德地图定位信息
 * @param {Function} callback callback 回调函数
 * @param {String} city 要显示的城市
 * @param {String} containerId 显示地图的容器ID
 */
const getAmap = (callback, city, containerId = "map-container") => {
  // 没有数据，获取定位数据
  let map = new window.AMap.Map(containerId, {
    zoom: 10,
    center: [116.39, 39.9],
    resizeEnable: true,
    // 定位成功时是否在定位位置显示一个Marker 默认值：true
    showMarker: false,
    // 定位成功并且有精度信息时，是否用一个圆圈circle表示精度范围 默认值：true
    showCircle: false,
  });

  // 如果有 city 则直接定位到指定行政区
  if (city) {
    // 设置地图当前行政区
    map.setCity(city);
  } else {
    window.AMap.plugin("AMap.Geolocation", function () {
      const geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：5s
        position: "RB", //定位按钮的停靠位置
        GeoLocationFirst: true, // 设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位，默认：false
        showCircle: false, // 定位成功后用圆圈表示定位精度范围，默认：true
        zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      map.addControl(geolocation);

      geolocation.getCurrentPosition(function (status, result) {
        if (status === "complete") {
          onComplete(result);
        } else {
          onError(result);
        }
      });
    });

    map.plugin(["AMap.ToolBar", "AMap.Scale"], function () {
      // 工具条
      const toolBar = new window.AMap.ToolBar({ position: "RT" });
      map.addControl(toolBar);

      // 地图比例尺
      const Scale = new window.AMap.Scale();
      map.addControl(Scale);
    });

    //解析定位结果
    function onComplete(data) {
      const str = {};
      str.position = "定位结果：" + data.position;
      str.location_type = "定位类别：" + data.location_type;
      //如为IP精确定位结果则没有精度信息
      if (data.accuracy) str.accuracy = "精度：" + data.accuracy + " 米";
      str.isConverted = "是否经过偏移：" + (data.isConverted ? "是" : "否");
      console.log(str);
    }

    //解析定位错误信息
    function onError(data) {
      console.log("定位失败", "失败原因排查信息:" + data.message);
    }
  }

  // 使用 callback 回调函数异步返回数据
  callback && callback(map);
};

export default getAmap;
