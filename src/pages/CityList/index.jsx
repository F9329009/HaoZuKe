import { Icon } from "antd-mobile";

import { useEffect, useState } from "react";

import { httpGet } from "../../utils/axios/http";
import { AreaAPI } from "../../api";

import NavHeader from "../../components/NavHeader";
import { AutoSizer, List } from "react-virtualized";

import cityListFormat from "../../utils/cityListFormat";
import getCurrentCity from "../../utils/getCurrentCity";

import "./index.css";

function CityList(props) {
  //#region 当前城市
  const getCurCity = () => {
    getCurrentCity(CurCity => {
      console.log("getCurCity", CurCity);
      const list = { cityList, cityIndex };
      list.cityList["#"] = [CurCity];

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

  //#region 城市列表
  // 格式化标题
  const formatCityTitle = letter => {
    switch (letter) {
      case "#":
        return "当前定位";
      case "hot":
        return "热门城市";
      default:
        return letter.toUpperCase();
    }
  };
  // 渲染
  const cityListRenderer = ({
    key, // 每一行在数组中的唯一标识
    index, // 索引
    isScrolling, // 当前渲染出来的数据是否正在滚动
    isVisible, // 当前行在列表中是否显示
    style, // 当前行的样式
  }) => {
    return (
      <div className="city" key={key} style={style}>
        <div className="title">{formatCityTitle(cityIndex[index])}</div>
        {cityList[cityIndex[index]].map(item => (
          <div className="name">{item.label}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="citylist">
      {console.log("最终", cityList, cityIndex)}
      <NavHeader history={props.history} mode="light" icon={<Icon type="left" />} style={{ backgroundColor: "#F6F5F6" }} children="城市列表" />

      {/* 城市列表 */}
      <AutoSizer>
        {({ height, width }) => (
          <List
            // 列表宽高
            width={width}
            height={height - 45}
            // 列表长度
            rowCount={cityIndex.length}
            // 每列高度=城市列表分类的标题高度+(50*当前分类的数组看到)
            rowHeight={({ index }) => 36 + 50 * cityList[cityIndex[index]].length}
            // 列表数据
            rowRenderer={cityListRenderer}
          />
        )}
      </AutoSizer>

      <AutoSizer>
        {({ height, width }) => (
          <ul style={{ position: "absolute", top: 45, right: 6, height: height - 45, paddingTop: 100 / cityIndex.length + "%", paddingLeft: 0, marginTop: 0, textAlign: "center" }}>
            {cityIndex.map(item => (
              <li style={{ listStyle: "none", height: 100 / cityIndex.length + "%" }}>{item.toUpperCase()}</li>
            ))}
          </ul>
        )}
      </AutoSizer>
    </div>
  );
}

export default CityList;
