import { NavBar } from "antd-mobile";

function NavHeader(props) {
  // 左边图标默认点击事件
  const defaultLeftClick = () => props.history.go(-1);

  return (
    <NavBar className={props.className} mode={props.mode} icon={props.icon} onLeftClick={props.onLeftClick || defaultLeftClick} rightContent={props.rightContent} style={props.style}>
      {props.children}
    </NavBar>
  );
}

export default NavHeader;
