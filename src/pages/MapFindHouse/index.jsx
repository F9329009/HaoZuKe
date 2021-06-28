import { useState, useEffect } from "react";
import "./index.css";
import { Icon } from "antd-mobile";

import NavHeader from "../../components/NavHeader";

function MapFindHouse(props) {
  console.log("MapFindHouse", props);
  const [amap, setAmap] = useState(null);

  //#region 获取定位信息
  const getAmap = () => {
    let map = new window.AMap.Map("map-container", {
      zoom: 12,
      center: [116.39, 39.9],
      resizeEnable: true,
      // 定位成功时是否在定位位置显示一个Marker 默认值：true
      showMarker: false,
      // 定位成功并且有精度信息时，是否用一个圆圈circle表示精度范围 默认值：true
      showCircle: false,
    });

    window.AMap.plugin("AMap.Geolocation", function () {
      let geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：5s
        position: "RT", //定位按钮的停靠位置
        zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
        GeoLocationFirst: true,
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

    //解析定位结果
    function onComplete(data) {
      document.getElementById("status").innerHTML = "定位成功";
      var str = [];
      str.push("定位结果：" + data.position);
      str.push("定位类别：" + data.location_type);
      if (data.accuracy) {
        str.push("精度：" + data.accuracy + " 米");
      } //如为IP精确定位结果则没有精度信息
      str.push("是否经过偏移：" + (data.isConverted ? "是" : "否"));
      document.getElementById("result").innerHTML = str.join("<br>");
    }

    //解析定位错误信息
    function onError(data) {
      document.getElementById("status").innerHTML = "定位失败";
      document.getElementById("result").innerHTML = "失败原因排查信息:" + data.message;
    }

    window.AMap.plugin("AMap.ToolBar", function () {
      //异步加载插件
      var toolbar = new window.AMap.ToolBar();
      map.addControl(toolbar);
    });
    console.log("map", map, map.options);
    setAmap(map);
  };
  //#endregion

  useEffect(() => {
    getAmap();
  }, []);

  return (
    <div>
      <NavHeader
        history={props.history}
        mode="light"
        icon={<Icon type="left" />}
        rightContent={[<Icon key="0" type="search" style={{ marginRight: "16px" }} />, <Icon key="1" type="ellipsis" />]}
        children="地图找房"
      />
      {/* 地图 */}
      <div id="map-container" style={{ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight - 45 }}></div>
      <div className="map-status">
        <div id="status"></div>
        <div id="result"></div>
      </div>
    </div>
  );
}

export default MapFindHouse;
