import PropTypes from "prop-types";

import styles from "./index.module.css";

function NoHouse(props) {
  return (
    <div className={styles.root}>
      <img className={styles.img} src={process.env.REACT_APP_URL + "/img/not-found.png"} alt="暂无数据" />
      <p className={styles.msg}>{props.children}</p>
    </div>
  );
}

NoHouse.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NoHouse;
