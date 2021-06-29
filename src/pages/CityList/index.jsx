import { ListView } from "antd-mobile";

import { useEffect, useState } from "react";

import { httpGet } from "../../utils/axios/http";
import { AreaAPI } from "../../api";

import cityListFormat from "../../utils/cityListFormat";
import getCurrentCity from "../../utils/getCurrentCity";

function CityList() {
  //#region 当前城市
  const getCurCity = () => {
    getCurrentCity(CurCity => {
      console.log("getCurCity", CurCity);
      const list = { cityList, cityIndex };
      list.cityList["#"] = CurCity;

      setCityList({ ...cityList, ...list.cityList });
    });
  };
  //#endregion

  //#region 热门城市
  // 获取数据
  const getHotList = () => {
    httpGet(AreaAPI.hot)
      .then(res => {
        console.log("getHotList", res);
        if (res.status === 200) {
          const list = { cityList, cityIndex };
          list.cityList["hot"] = res.body;

          setCityList({ ...cityList, ...list.cityList });
        }
      })
      .catch(err => console.log(err));
  };
  //#endregion

  //#region 城市列表
  // 城市列表数据
  const [cityList, setCityList] = useState({});
  const [cityIndex, setCityIndex] = useState([]);
  // 获取数据
  const getCityList = (level = 1) => {
    httpGet(AreaAPI.city, { level })
      .then(res => {
        console.log("getCityList", res);
        if (res.status === 200) {
          const list = cityListFormat(res.body);

          list.cityIndex.unshift("hot");
          list.cityIndex.unshift("#");

          setCityList({ ...cityList, ...list.cityList });
          setCityIndex([...cityIndex, ...list.cityIndex]);
        }
      })
      .catch(err => console.log(err));
  };
  //#endregion

  useEffect(() => {
    getCurCity();
    getHotList();
    getCityList(1);
  }, []);

  return (
    <div>
      <h1>CityList</h1>
      {console.log("最终", cityList, cityIndex)}
      {/* <ListView /> */}
    </div>
  );
}

export default CityList;
