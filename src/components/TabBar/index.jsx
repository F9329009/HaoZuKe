import { TabBar } from "antd-mobile";
import { useState, useEffect } from "react";

import "./index.css";

// 需要显示 TabBar 的页面路由
const TabBarRouterList = ["/home", "/findhouse", "/news", "/profile"];

function TabBarCom(props) {
  // 当前选中的 TabBar
  const [selectedTab, setSelectedTab] = useState(props.history.location.pathname);
  // TabBar 是否隐藏
  const [isTabBar, serIsTabBar] = useState(true);

  useEffect(() => {
    // 设置当前选中的 TabBar
    setSelectedTab(props.history.location.pathname);
    // 设置 TabBar 是否隐藏
    serIsTabBar(!TabBarRouterList.includes(props.history.location.pathname));
  }, [props.history.location.pathname]);

  return (
    <div className="tabbar">
      <TabBar unselectedTintColor="#949494" tintColor="#24B770" barTintColor="white" hidden={isTabBar}>
        {props.tabBarList.map(item => (
          <TabBar.Item
            title={item.title}
            key={item.path}
            selected={selectedTab === item.path}
            icon={<i className={"iconfont " + item.icon} />}
            selectedIcon={<i className={"iconfont " + item.icon}></i>}
            onPress={() => {
              props.history.push(item.path);
            }}
          />
        ))}
      </TabBar>
    </div>
  );
}

export default TabBarCom;
