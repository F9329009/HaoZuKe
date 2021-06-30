import React from "react";
import ReactDOM from "react-dom";
import "antd-mobile/dist/antd-mobile.css";
import "./assets/fonts/iconfont.css";
// 导入 react-virtualized css文件
import "react-virtualized/styles.css";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "./routes/routes";

ReactDOM.render(<BrowserRouter>{renderRoutes(routes)}</BrowserRouter>, document.getElementById("root"));
