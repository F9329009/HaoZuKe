import { useEffect, useState } from "react";
import { Carousel, WingBlank, Flex, Grid } from "antd-mobile";

import { httpGet } from "../../utils/axios/http";
import { HomeAPI, AreaAPI } from "../../api";

import SearchHeader from "../../components/SearchHeader";

import getCurrentCity from "../../utils/getCurrentCity";

import "./index.css";

// react 认为所有的图片都应该来自于网络
// 如果没有来自于网络 就通过 import 引入
import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";

const navList = [
  {
    title: "整租",
    path: "/findhouse",
    imgSrc: nav1,
  },
  {
    title: "合租",
    path: "/findhouse",
    imgSrc: nav2,
  },
  {
    title: "地图找房",
    path: "/mapfindhouse",
    imgSrc: nav3,
  },
  {
    title: "去出租",
    path: "/findhouse",
    imgSrc: nav4,
  },
];

function Home(props) {
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
  //#endregion

  //#region 根据城市名称查询该城市信息
  // 当前城市信息
  const [info, setInfo] = useState(JSON.parse(window.localStorage.getItem("hzk_city")));
  // 获取数据
  useEffect(() => {
    if (amap.city) {
      getCurrentCity(CurCity => setInfo(CurCity));
    }
  }, [amap]);
  //#endregion

  //#region 轮播图
  // 数据
  const [swiperData, setSwiperData] = useState([]);
  // 轮播图高度
  const [imgHeight, setImageHeight] = useState(212);
  // 获取数据
  const getSwiper = () => {
    httpGet(HomeAPI.swiper)
      .then(res => {
        console.log("swiper", res);
        if (res.status === 200) {
          setSwiperData(res.body);
        }
      })
      .catch(err => console.log(err));
  };
  // 渲染
  const renderSwipers = () => {
    return swiperData.map(item => (
      <a key={item.id} href="http://127.0.0.1" style={{ display: "inline-block", width: "100%", height: imgHeight }}>
        <img
          src={`http://127.0.0.1:8080${item.imgSrc}`}
          alt={item.alt}
          style={{ width: "100%", verticalAlign: "top" }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
            setImageHeight("auto");
          }}
        />
      </a>
    ));
  };
  //#endregion

  //#region 租房小组
  // 数据
  const [groupData, setGroupData] = useState([]);
  // 获取数据
  const getGroups = areaId => {
    httpGet(HomeAPI.groups, {
      area: areaId,
    })
      .then(res => {
        console.log("groups", res);
        if (res.status === 200) {
          setGroupData(res.body);
        }
      })
      .catch(err => console.log(err));
  };
  // 渲染
  const renderGroup = () => {
    return (
      <Grid
        data={groupData}
        columnNum={2}
        hasLine={false}
        square={false}
        renderItem={item => (
          <Flex className="group-item" justify="around" key={item.id}>
            <div className="group-item-desc">
              <p className="group-item-desc-title">{item.title}</p>
              <span className="group-item-desc-info">{item.desc}</span>
            </div>
            <img className="group-item-img" src={`http://127.0.0.1:8080${item.imgSrc}`} alt="" />
          </Flex>
        )}
      />
    );
  };
  //#endregion

  //#region 最新资讯
  // 数据
  const [newsData, setNewsData] = useState([]);
  // 获取数据
  const getNews = areaId => {
    httpGet(HomeAPI.news, { area: areaId })
      .then(res => {
        console.log("news", res);
        if (res.status === 200) {
          setNewsData(res.body);
        }
      })
      .catch(err => console.log(err));
  };
  // 渲染
  const renderNews = () => {
    return newsData.map(item => (
      <div className="news-item" key={item.id}>
        <div className="news-item-imgwrap">
          <img src={`http://127.0.0.1:8080${item.imgSrc}`} alt="" />
        </div>
        <Flex className="news-item-content" direction="column" justify="between">
          <h3>{item.title}</h3>
          <Flex className="news-item-content-info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  };
  //#endregion

  useEffect(() => {
    getAmap();
    getSwiper();
  }, []);

  useEffect(() => {
    if (info) {
      getGroups(info.value);
      getNews(info.value);
    }
  }, [info]);

  return (
    <div className="home">
      <div id="map-container" style={{ width: "0", height: "0" }}></div>
      {/* 搜索框 */}
      <SearchHeader history={props.history} amap={amap} info={info} />
      {/* 轮播图 */}
      {swiperData.length <= 0 ? null : (
        <Carousel autoplay={true} infinite>
          {renderSwipers()}
        </Carousel>
      )}
      {/* 导航 */}
      <Flex className="nav">
        {navList.map((item, index) => (
          <Flex.Item key={index} onClick={() => props.history.push(item.path)}>
            <img src={item.imgSrc} alt="" />
            <p>{item.title}</p>
          </Flex.Item>
        ))}
      </Flex>
      {/* 租房小组 */}
      <div className="group">
        <h3 className="group-title">
          租房小组<span className="group-title-more">更多</span>
        </h3>
        {renderGroup()}
      </div>
      {/* 最新资讯 */}
      <div className="news">
        <h3 className="news-group-title">最新资讯</h3>
        <WingBlank size="md">{renderNews()}</WingBlank>
      </div>
    </div>
  );
}

export default Home;
