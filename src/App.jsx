import { renderRoutes } from "react-router-config";

import TabBarCom from "./components/TabBar";

const tabBarList = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/findhouse",
  },
  {
    title: "资讯",
    icon: "icon-infom",
    path: "/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/profile",
  },
];

function App(props) {
  return (
    <div className="App">
      {/* 内容 */}
      {renderRoutes(props.route.routes)}

      {/* TabBar */}
      <TabBarCom {...props} tabBarList={tabBarList} />
    </div>
  );
}

export default App;
