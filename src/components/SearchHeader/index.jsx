import { Flex } from "antd-mobile";
import { withRouter } from "react-router-dom";
import "./index.css";

function SearchHeader(props) {
  const HZK_CITY = JSON.parse(window.localStorage.getItem("hzk_city"));

  return (
    <Flex className="search-box">
      {/* 搜索框左边 */}
      <Flex className="search">
        <div className="search-location">
          <span
            onClick={() => {
              props.history.push("/citylist");
            }}
          >
            {HZK_CITY == null ? (props.info == null ? props.amap.city : props.info.label) : HZK_CITY.label}
          </span>
          <i class="iconfont icon-arrow" />
        </div>
        <div className="search-form">
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      {/* 地图找房 */}
      <i className="iconfont icon-map" onClick={() => props.history.push("/mapfindhouse")} />
    </Flex>
  );
}

export default withRouter(SearchHeader);
