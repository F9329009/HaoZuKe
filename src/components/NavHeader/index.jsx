import { NavBar } from "antd-mobile";
import { withRouter } from "react-router-dom";

import PropTypes from "prop-types";

import styles from "./index.module.css";

function NavHeader(props) {
  // 左边图标默认点击事件
  const defaultLeftClick = () => props.history.go(-1);

  return (
    <NavBar
      className={[styles.navBar, props.className || ""].join(" ")}
      mode={props.mode}
      icon={props.icon}
      onLeftClick={props.onLeftClick || defaultLeftClick}
      rightContent={props.rightContent}
      style={props.style}
    >
      {props.children}
    </NavBar>
  );
}

// props 校验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
  className: PropTypes.string,
};

export default withRouter(NavHeader);
