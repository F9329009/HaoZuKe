import { useState, useEffect } from "react";

import { httpGet } from "../../utils/axios/http";
import { AreaAPI } from "../../api";

import { Icon } from "antd-mobile";

import NavHeader from "../../components/NavHeader";

import getCurrentCity from "../../utils/getCurrentCity";
import getAmap from "../../utils/getAmap";

import "./index.css";

function MapFindHouse(props) {
  console.log("MapFindHouse", props);
  // 高德地图数据
  const [amap, setAmap] = useState(null);
  // 当前城市
  const [activeCity, setActiveCity] = useState(null);

  //#region 查询房源数据
  const getMapHouse = () => {};
  //#endregion

  useEffect(() => {
    // 获取当前城市信息
    const HZK_CITY = window.localStorage.getItem("hzk_city");
    if (HZK_CITY) {
      setActiveCity(HZK_CITY.label);
    } else {
      getCurrentCity(CurCity => setActiveCity(CurCity));
    }
    // 获取高德地图数据
    getAmap(map => setAmap(map));
  }, []);

  // 地图城市切换
  useEffect(() => {
    if (amap && activeCity) amap.setCity(activeCity);
  }, [amap, activeCity]);

  return (
    <div>
      {/* {console.log("amap", amap)} */}
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
