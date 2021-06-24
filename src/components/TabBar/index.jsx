import { TabBar } from "antd-mobile";
import { useState, useEffect } from "react";

function TabBarCom(props) {
  const [selectedTab, setSelectedTab] = useState(props.history.location.pathname);

  useEffect(() => {
    // 设置当前选中的 TabBar
    setSelectedTab(props.history.location.pathname);
  }, [props.history.location.pathname]);

  return (
    <div className="tabbar">
      <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white" hidden={false}>
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
