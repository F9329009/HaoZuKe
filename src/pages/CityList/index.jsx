import { Icon, Toast } from "antd-mobile";

import { createRef, useEffect, useState } from "react";

import { httpGet } from "../../utils/axios/http";
import { AreaAPI } from "../../api";

import NavHeader from "../../components/NavHeader";
import { AutoSizer, List } from "react-virtualized";

import cityListFormat from "../../utils/cityListFormat";
import getCityInfo from "../../utils/getCityInfo";

import "./index.css";

function CityList(props) {
  //#region 当前城市
  const getCurCity = () => {
    getCityInfo(CurCity => {
      console.log("getCurCity", CurCity);
      const list = { cityList, cityIndex };
      // 把当前城市添加到城市列表的 #
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
          // 把热门城市数据添加到城市列表的 hot
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
          // 往 cityIndex 的前面添加 # 和 hot
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
  // 有房源的城市
  // 有房源的城市
  const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];

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
  // 获取每列的列表高度
  const getRowHeight = index => {
    // 城市列表分类的标题高度+(50*当前分类的数组看到)
    return 36 + 50 * cityList[cityIndex[index]].length;
  };

  // 切换城市
  const handleChangeCity = ({ label, value }) => {
    if (HOUSE_CITY.indexOf(label) > -1) {
      // 有房源
      window.localStorage.setItem("hzk_curcity", JSON.stringify({ label, value }));
      window.localStorage.setItem("hzk_city", JSON.stringify({ label, value }));
      props.history.go(-1);
    } else {
      // 无房源
      Toast.info("该城市暂无房源数据", 1, null, false);
    }
  };
  // 渲染
  const renderCityList = ({
    key, // 每一行在数组中的唯一标识
    index, // 索引
    style, // 当前行的样式
  }) => {
    return (
      <div className="city" key={key} style={style}>
        <div className="title">{formatCityTitle(cityIndex[index])}</div>
        {cityList[cityIndex[index]].map(item => (
          <div className="name" key={item.label} onClick={() => handleChangeCity(item)}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  //#endregion

  //#region 城市列表索引
  // 当前高亮索引
  const [activeIndex, setActiveIndex] = useState(0);
  // 城市列表 Ref
  const [listRef, setListRef] = useState(createRef());
  // 渲染
  const renderCityIndex = () => {
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={index}
        onClick={() => {
          // 设置当前高亮索引
          setActiveIndex(index);
          // 使用 Ref 修改 CityLife 列表当前对齐的行
          listRef.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>{item === "hot" ? "热" : item.toUpperCase()}</span>
      </li>
    ));
  };
  //#endregion

  return (
    <div className="citylist">
      {/* 顶部导航栏 */}
      <NavHeader mode="light" icon={<Icon type="left" />} style={{ backgroundColor: "#F6F5F6" }} children="城市列表" />
      {/* 城市列表 */}
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            // 列表宽高
            width={width}
            height={height - 45}
            // 列表长度
            rowCount={cityIndex.length}
            // 每列高度
            rowHeight={({ index }) => getRowHeight(index)}
            // 列表数据
            rowRenderer={renderCityList}
            // 渲染行的信息
            onRowsRendered={({ startIndex }) => setActiveIndex(startIndex)}
            // 控制滚动到行的对齐方式
            scrollToAlignment="start"
          />
        )}
      </AutoSizer>
      {/* 城市列表索引 */}
      <ul className="city-index">{renderCityIndex()}</ul>
    </div>
  );
}

export default CityList;
