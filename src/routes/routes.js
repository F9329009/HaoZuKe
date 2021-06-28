import App from "../App";
import Home from "../pages/Home";
import FindHouse from "../pages/FindHouse";
import News from "../pages/News";
import Profile from "../pages/Profile";
import CityList from "../pages/CityList";
import MapFindHouse from "../pages/MapFindHouse";

import { Redirect } from "react-router-dom";

const routes = [
  {
    path: "/",
    component: App,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/home"} />,
      },
      {
        path: "/home",
        component: Home,
        meta: {
          title: "首页",
        },
      },
      {
        path: "/findhouse",
        component: FindHouse,
        meta: {
          title: "找房",
        },
      },
      {
        path: "/news",
        component: News,
        meta: {
          title: "资讯",
        },
      },
      {
        path: "/profile",
        component: Profile,
        meta: {
          title: "我的",
        },
      },
      {
        path: "/citylist",
        component: CityList,
        meta: {
          title: "城市列表",
        },
      },
      {
        path: "/mapfindhouse",
        component: MapFindHouse,
        meta: {
          title: "地图找房",
        },
      },
    ],
  },
];

export default routes;
