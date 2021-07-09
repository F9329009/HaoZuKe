import { useState } from "react";

import { Spring } from "react-spring/renderprops";

import FilterFooter from "../../../FilterFooter";

import styles from "./index.module.css";

function FilterMore(props) {
  const [selectedValues, setSelectedValues] = useState(props.defaultValue);
  // 组件是否显示
  const isOpen = props.type === "more";

  console.log(props, isOpen);

  //#region 鼠标点击事件
  const onTagClick = value => {
    // 创建新数组
    const newSelectedValues = [...selectedValues];

    if (newSelectedValues.indexOf(value) <= -1) {
      // 没有当前项的值
      newSelectedValues.push(value);
    } else {
      // 有当前项的值
      const index = newSelectedValues.findIndex(item => item === value);
      newSelectedValues.splice(index, 1);
    }

    setSelectedValues(newSelectedValues);
  };
  //#endregion

  //#region 渲染标签
  const renderFilters = data => {
    return data.map(item => {
      const isSelected = selectedValues.indexOf(item.value) > -1;

      return (
        <span key={item.value} className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")} onClick={() => onTagClick(item.value)}>
          {item.label}
        </span>
      );
    });
  };
  //#endregion

  // 取消按钮的事件处理程序
  const onCancel = () => {
    setSelectedValues([]);
  };

  // 确定按钮的事件处理程序
  const onOk = () => {
    // 调用父组件的 onSave 方法
    props.onSave(props.type, selectedValues);
  };

  return (
    <div className={styles.root}>
      {/* 遮罩层 */}
      <Spring to={{ opacity: isOpen ? 1 : 0 }}>
        {springProps => {
          if (springProps.opacity === 0) {
            return null;
          }

          return <div style={springProps} className={styles.mask} onClick={() => props.onCancel(props.type)} />;
        }}
      </Spring>

      <Spring to={{ transform: `translate(${isOpen ? "0px" : "100%"}, 0px)` }}>
        {springProps => {
          return (
            <>
              {/* 条件内容 */}
              <div style={springProps} className={styles.tags}>
                <dl className={styles.dl}>
                  <dt className={styles.dt}>户型</dt>
                  <dd className={styles.dd}>{renderFilters(props.data.roomType)}</dd>

                  <dt className={styles.dt}>朝向</dt>
                  <dd className={styles.dd}>{renderFilters(props.data.oriented)}</dd>

                  <dt className={styles.dt}>楼层</dt>
                  <dd className={styles.dd}>{renderFilters(props.data.floor)}</dd>

                  <dt className={styles.dt}>房屋亮点</dt>
                  <dd className={styles.dd}>{renderFilters(props.data.characteristic)}</dd>
                </dl>
              </div>

              {/* 底部按钮 */}
              <FilterFooter style={springProps} className={styles.footer} cancelText="清除" onCancel={onCancel} onOk={onOk} />
            </>
          );
        }}
      </Spring>
    </div>
  );
}

export default FilterMore;
