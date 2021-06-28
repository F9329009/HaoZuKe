import { Flex } from "antd-mobile";
import "./index.css";

function SearchHeader(props) {
  return (
    <Flex className="search-box">
      {/* 搜索框左边 */}
      <Flex className="search">
        <div className="search-location">
          <span>{props.amap.city}</span>
          <i class="iconfont icon-arrow" />
        </div>
        <div className="search-form">
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      {/* 地图找房 */}
      <i className="iconfont icon-map" />
    </Flex>
  );
}

export default SearchHeader;
