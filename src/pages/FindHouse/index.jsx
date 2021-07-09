import { useEffect, useState } from "react";
import { Flex, Toast } from "antd-mobile";
import { List, AutoSizer, WindowScroller, InfiniteLoader } from "react-virtualized";

import { httpGet } from "../../utils/axios/http";
import { HouseAPI } from "../../api";

import SearchHeader from "../../components/SearchHeader";
import Sticky from "../../components/Sticky";
import NoHouse from "../../components/NoHouse";
import Filter from "../../components/Filter";
import HouseItem from "../../components/HouseItem";

import getCityInfo from "../../utils/getCityInfo";

import "./index.css";

function FindHouse(props) {
  //#region 获取定位信息
  // 定位数据
  const [amap, setAmap] = useState({});
  // 获取定位信息
  const getAmap = () => {
    window.AMap.plugin("AMap.Geolocation", function () {
      const geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：5s
        GeoLocationFirst: true,
      });

      geolocation.getCityInfo(function (status, result) {
        console.log("getCityInfo", status, result);
        if (status === "complete") {
          setAmap(result);
        }
      });
    });
  };
  useEffect(() => {
    getAmap();
  }, []);
  //#endregion

  //#region 根据城市名称查询该城市信息
  // 当前城市信息
  const [info, setInfo] = useState(JSON.parse(window.localStorage.getItem("hzk_city")));
  // 获取数据
  useEffect(() => {
    if (amap.city) {
      getCityInfo(CurCity => setInfo(CurCity));
      // 获取房屋列表数据
      searchHouseList();
    }
  }, [amap]);

  useEffect(() => {
    if (cityId) cityId = info.value;
  }, [info]);
  //#endregion

  //#region 获取房屋列表数据
  // 房屋列表数据
  const [housesList, setHouseList] = useState([]);
  // 房源数量
  const [housesCount, setHouseCount] = useState(0);
  // 初始化城市ID
  let cityId = "";
  let filters = {};
  const searchHouseList = () => {
    // 开启loading
    Toast.loading("加载中...", 0, null, false);
    httpGet(HouseAPI.houses, { cityId: cityId, ...filters, start: 1, end: 20 })
      .then(res => {
        console.log("searchHouseList", res);
        if (res.status == 200) {
          setHouseList(res.body.list);
          setHouseCount(res.body.count);
          // 关闭loading
          Toast.hide();

          // 提示房源数量
          if (res.body.count !== 0) {
            Toast.info(`共找到 ${res.body.count} 套房源`, 2, null, false);
          }
        }
      })
      .catch(err => console.log(err));
  };
  //#endregion

  //#region 渲染房屋列表
  // 判断列表中的每一行是否加载完成
  const isRowLoaded = ({ index }) => {
    return !!housesList[index];
  };
  // 用来获取更多房屋列表数据
  // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让Promise对象的状态变为已完成。
  const loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      httpGet(HouseAPI.houses, { cityId: cityId, ...filters, start: startIndex, end: stopIndex })
        .then(res => {
          console.log("loadMoreRows", res);
          if (res.status == 200) {
            setHouseList([...housesList, ...res.body.list]);

            // 数据加载完成时，调用 resolve 即可
            resolve();
          }
        })
        .catch(err => console.log(err));
    });
  };
  // 渲染房屋列表项
  const renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const house = housesList[index];

    // 判断 house 是否存在
    // 如果不存在，就渲染 loading 元素占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className="loading" />
        </div>
      );
    }

    return (
      <HouseItem
        key={key}
        onClick={() => props.history.push(`/detail/${house.houseCode}`)}
        // 注意：该组件中应该接收 style，然后给组件元素设置样式！！！
        style={style}
        src={process.env.REACT_APP_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    );
  };
  // 渲染房屋列表
  const renderList = () => {
    // 关键点：在数据加载完成后，再进行 count 的判断
    // 解决方式：如果数据加载中，则不展示 NoHouse 组件；而，但数据加载完成后，再展示 NoHouse 组件
    if (housesCount === 0 && housesList.length <= 0) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>;
    }

    return (
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={housesCount}>
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                    width={width} // 视口的宽度
                    height={height} // 视口的高度
                    rowCount={housesCount} // List列表项的行数
                    rowHeight={120} // 每一行的高度
                    rowRenderer={renderHouseList} // 渲染列表项中的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  };
  //#endregion

  // 接收 Filter 组件中的筛选条件数据
  const onFilter = f => {
    // 返回页面顶部
    window.scrollTo(0, 0);

    filters = f;

    // 调用获取房屋数据的方法
    searchHouseList();
  };

  return (
    <div>
      {/* 顶部搜索导航 */}
      <Flex className="header">
        <i className="iconfont icon-back" onClick={() => props.history.go(-1)} />
        {/* <SearchHeader className="searchHeader" cityName={amap.city} /> */}
        <SearchHeader className="search-header" cityName={info == null ? amap.city : info.label} />
      </Flex>
      {/* 条件筛选栏 */}
      <Sticky height={40}>
        <Filter onFilter={onFilter} />
      </Sticky>
      {/* 房屋列表 */}
      <div className="house-items">{renderList()}</div>
    </div>
  );
}

export default FindHouse;
