import { Flex } from "antd-mobile";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./index.css";

function SearchHeader(props) {
  const HZK_CITY = JSON.parse(window.localStorage.getItem("hzk_city"));

  return (
    <Flex className={["search-box", props.className || ""].join(" ")}>
      {/* 搜索框左边 */}
      <Flex className="search">
        <div className="search-location">
          <span
            onClick={() => {
              props.history.push("/citylist");
            }}
          >
            {props.cityName != null ? props.cityName : HZK_CITY != null ? HZK_CITY.label : ""}
          </span>
          <i className="iconfont icon-arrow" />
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
// 添加属性校验
SearchHeader.propTypes = {
  cityName: PropTypes.string,
  className: PropTypes.string,
};

export default withRouter(SearchHeader);
