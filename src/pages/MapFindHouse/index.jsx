import { useState, useEffect } from "react";

import { httpGet } from "../../utils/axios/http";
import { AreaAPI } from "../../api";

import { Icon, Toast } from "antd-mobile";

import NavHeader from "../../components/NavHeader";

import getCityInfo from "../../utils/getCityInfo";
import getAmap from "../../utils/getAmap";

import "./index.css";

function MapFindHouse() {
  // 高德地图数据
  const [amap, setAmap] = useState(null);
  // 遮罩物数据
  const [overlaysData, setOverlaysData] = useState([]);

  //#region 查询房源数据
  const getMapHouse = id => {
    // 开启loading
    Toast.loading("加载中...", 0, null, false);
    console.log(AreaAPI.map, { id: id });
    // 发请求
    httpGet(AreaAPI.map, { id: id })
      .then(res => {
        console.log("getMapHouse", res);
        if (res.status === 200) {
          setOverlaysData(res.body);

          // 关闭 loading
          Toast.hide();
        }
      })
      .catch(err => {
        console.log(err);
        // 关闭 loading
        Toast.hide();
      });
  };
  //#endregion

  //#region 获取当前城市级别、地图中心位置、当前城市信息
  // 当前城市级别
  const [amapZoom, setAmapZoom] = useState(10);
  // 地图中心位置
  const [amapCenter, setAmapCenter] = useState(null);
  // 当前城市信息
  const [amapCity, setAmapCity] = useState({});

  // 获取当前城市级别和地图中心位置
  const getMapinfo = activeCity => {
    //获取当前地图级别
    setAmapZoom(amap.getZoom());
    //获取当前地图中心位置
    setAmapCenter(amap.getCenter());

    amap.getCity(info => {
      // 解决直辖市 city 为空的问题
      if (info.city === "") activeCity.city = activeCity.province;

      if (amap.getZoom() < 12) {
        // 如果区和镇没有修改则不更新城市信息
        if (!(activeCity.province !== info.province || activeCity.city !== info.city)) {
          // 更新当前城市信息
          setAmapCity(activeCity);
          // 查询房源数据
          getCityInfo(info => getMapHouse(info.value), activeCity.city);
        }
      } else {
        // 如果小区没有修改则不更新城市信息
        if (activeCity.district !== info.district) {
          // 更新当前城市信息
          setAmapCity(activeCity);
          // 查询房源数据
          getCityInfo(info => getMapHouse(info.value), activeCity.district);
        }
      }
    });
  };
  //#endregion

  //#region 创建区、镇(圆形)遮罩物
  const createCircle = data => {
    const circle = new window.AMap.Text({
      text: `
        <div class="bubble">
          <p class="name">${data.label}</p>
          <p>${data.count}套</p>
        </div>`,
      position: new window.AMap.LngLat(data.coord.longitude, data.coord.latitude),
    });

    // 添加唯一标识
    circle.id = data.value;

    // 添加点击事件
    circle.on("click", e => {
      // 使用clearMap方法删除所有覆盖物
      amap.clearMap();

      //设置地图中心点
      amap.setCenter([e.lnglat.lng, e.lnglat.lat]);

      //设置地图层级
      const level = amap.getZoom();
      console.log("当前地图等级：", level);
      // 省
      if (level >= 10 && level < 12) {
        amap.setZoom(12);
        setAmapZoom(12);
      }
      // 市
      if (level >= 12 && level < 14) {
        amap.setZoom(14);
        setAmapZoom(14);
      }

      console.log("======================circle", e.target.id);
      // 获取下一级数据
      getMapHouse(e.target.id);
    });
    // 渲染到页面上
    amap.add(circle);
  };
  //#endregion

  //#region 创建小区覆盖物
  const createRect = data => {
    const rect = new window.AMap.Text({
      text: `
        <div class="rect">
          <span class="housename">${data.label}</span>
          <span class="housenum">${data.count}套</span>
          <i class="arrow"></i>
        </div>`,
      position: new window.AMap.LngLat(data.coord.longitude, data.coord.latitude),
    });

    // 添加唯一标识
    rect.id = data.value;

    // 添加点击事件
    rect.on("click", e => {
      //设置地图中心点
      amap.setCenter([e.lnglat.lng, e.lnglat.lat]);

      console.log("======================rect", e.target.id);
      // 获取下一级数据
      // getMapHouse(e.target.id);
    });
    // 渲染到页面上
    amap.add(rect);
  };
  //#endregion

  //#region 创建并渲染覆盖物
  let curOverlaysLevel;
  const createOverlays = (type = "province") => {
    // 使用clearMap方法删除所有覆盖物
    amap.clearMap();
    // 遍历渲染所有覆盖物
    overlaysData.forEach(item => {
      switch (type) {
        case "province":
          createCircle(item);
          break;
        case "city":
          createCircle(item);
          break;
        case "district":
          createRect(item);
          break;
        default:
          break;
      }
    });
  };
  //#endregion

  //#region 渲染遮罩物
  const renderOverlays = () => {
    // 获取当前城市级别
    const level = amap.getZoom();
    // 判断城市级别创建不同的遮罩物样式
    if (level >= 10 && level < 12 && curOverlaysLevel !== "province") {
      // 区
      curOverlaysLevel = "province";
      createOverlays("province");
    } else if (level >= 12 && level < 14 && curOverlaysLevel !== "city") {
      // 镇
      curOverlaysLevel = "city";
      createOverlays("city");
    } else if (level >= 14 && curOverlaysLevel !== "district") {
      // 小区
      curOverlaysLevel = "districts";
      createOverlays("district");
    }
  };
  //#endregion

  useEffect(() => {
    // 获取当前城市信息
    const HZK_CITY = JSON.parse(window.localStorage.getItem("hzk_city"));
    if (HZK_CITY) {
      // 获取高德地图数据
      getAmap(map => {
        setAmap(map);
      }, HZK_CITY.label);
      // 查询房源数据
      getMapHouse(HZK_CITY.value);
    } else {
      getCityInfo(CurCity => {
        // 获取高德地图数据
        getAmap(map => {
          setAmap(map);
        });
        // 查询房源数据
        getMapHouse(CurCity.value);
      });
    }
  }, []);

  useEffect(() => {
    if (amap) {
      console.log("--------------------------------");

      // 绑定地图移动与缩放事件
      amap.on("moveend", () => {
        // 设置当前城市信息
        amap.getCity(info => {
          console.log("moveend(info)", info);
          getMapinfo(info);
        });
      });
      amap.on("zoomend", () => {
        // 设置当前城市信息
        amap.getCity(info => {
          console.log("zoomend(info)", info, amapCity);
          getMapinfo(info);
        });
      });
    }
  }, [amap]);

  // useEffect(() => {
  //   console.log("useEffect(amapZoom)：amapCity", amapCity, "amapZoom", amapZoom, "curOverlaysLevel", curOverlaysLevel);
  //   if (amapCity) {
  //     // 判断城市级别创建不同的覆盖物样式
  //     if (amapZoom >= 10 && amapZoom < 12 && curOverlaysLevel !== "city") {
  //       // 镇
  //       getCityInfo(info => getMapHouse(info.value), amapCity.city);
  //     } else if (amapZoom >= 12 && amapZoom < 14 && curOverlaysLevel !== "district") {
  //       // 小区
  //       getCityInfo(info => getMapHouse(info.value), amapCity.district);
  //     }
  //   }
  // }, [amapZoom]);

  useEffect(() => {
    // 判断数组是否有内容
    if (overlaysData.length > 0) {
      // 渲染覆盖物
      renderOverlays();
    }
  }, [overlaysData]);

  useEffect(() => {
    console.log(amapZoom, amapCity, amapCenter, overlaysData);
    console.log("===============================================================");
  }, [amapZoom, amapCity, amapCenter, overlaysData]);

  return (
    <div>
      {/* 顶部导航栏 */}
      <NavHeader mode="light" icon={<Icon type="left" />} children="地图找房" />
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
