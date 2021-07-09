import { useEffect, useState } from "react";

import { httpGet } from "../../utils/axios/http";
import { HouseAPI } from "../../api";
// 导入 Spring 组件
import { Spring } from "react-spring/renderprops";

import FilterTitle from "./components/FilterTitle";
import FilterPicker from "./components/FilterPicker";
import FilterMore from "./components/FilterMore";

import styles from "./index.module.css";

function Filter(props) {
  // 标题高亮状态
  const [titleSelectedStatus, setTitleSelectedStatus] = useState({
    area: false,
    mode: false,
    price: false,
    more: false,
  });
  // FilterPicker 和 FilterMore 的展示或隐藏
  const [openType, setOpenType] = useState("");
  // 所有筛选条件数据
  const [filtersData, setFiltersData] = useState({
    // FilterMore
    roomType: [],
    oriented: [],
    floor: [],
    characteristic: [],
    // FilterPicker
    area: {},
    subway: {},
    rentType: [],
    price: [],
  });
  // FilterPicker 和 FilterMore 筛选条件的选中值
  const [selectedValues, setSelectedValues] = useState({
    area: ["area", "null"],
    mode: ["null"],
    price: ["null"],
    more: [],
  });

  //#region 获取房屋查询条件
  const getFiltersData = () => {
    // 获取当前定位城市id
    const HZK_CITY = JSON.parse(window.localStorage.getItem("hzk_city"));

    httpGet(HouseAPI.condition, {
      id: HZK_CITY.value,
    })
      .then(res => {
        console.log("groups", res);
        if (res.status === 200) {
          setFiltersData(res.body);
        }
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getFiltersData();
  }, []);
  //#endregion

  //#region 点击标题菜单实现高亮
  const onTitleClick = type => {
    console.log(type);
    // props.onFilter();

    // 给 body 添加样式
    document.body.className = "body-fixed";

    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    // 遍历标题选中状态对象
    // Object.keys() => ['area', 'mode', 'price', 'more']
    Object.keys(titleSelectedStatus).forEach(key => {
      // key 表示数组中的每一项，此处，就是每个标题的 type 值。
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true;
        return;
      }

      // 其他标题：
      const selectedVal = selectedValues[key];
      if (key === "area" && (selectedVal.length !== 2 || selectedVal[0] !== "area")) {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "mode" && selectedVal[0] !== "null") {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "price" && selectedVal[0] !== "null") {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "more" && selectedVal.length !== 0) {
        // 更多选择项 FilterMore 组件
        newTitleSelectedStatus[key] = true;
      } else {
        newTitleSelectedStatus[key] = false;
      }
    });

    // 展示对话框
    setOpenType(type);
    // 使用新的标题选中状态对象来更新
    setTitleSelectedStatus(newTitleSelectedStatus);
  };
  //#endregion

  //#region 渲染 FilterMore 组件
  const renderFilterMore = () => {
    // 移除 return null
    const data = {
      roomType: filtersData.roomType,
      oriented: filtersData.oriented,
      floor: filtersData.floor,
      characteristic: filtersData.characteristic,
    };

    const defaultValue = selectedValues.more;

    return <FilterMore data={data} type={openType} onSave={onSave} onCancel={onCancel} defaultValue={defaultValue} />;
  };
  //#endregion

  //#region 渲染 FilterPicker 组件
  const renderFilterPicker = () => {
    console.log("renderFilterPicker==openType", openType);
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }

    // 根据 openType 来获取到当前筛选条件数据
    let data = [];
    let cols = 3;
    let defaultValue = selectedValues[openType];
    switch (openType) {
      case "area":
        // 获取到区域数据
        data = [filtersData.area, filtersData.subway];
        cols = 3;
        break;
      case "mode":
        data = filtersData.rentType;
        cols = 1;
        break;
      case "price":
        data = filtersData.price;
        cols = 1;
        break;
      default:
        break;
    }

    console.log("renderFilterPicker==data", data);

    return <FilterPicker key={openType} onCancel={onCancel} onSave={onSave} data={data} cols={cols} type={openType} defaultValue={defaultValue} />;
  };

  // 取消（隐藏对话框）
  const onCancel = type => {
    document.body.className = "";

    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    // 菜单高亮逻辑处理
    const selectedVal = selectedValues[type];
    if (type === "area" && (selectedVal.length !== 2 || selectedVal[0] !== "area")) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }

    // 隐藏对话框
    setOpenType("");
    // 更新菜单高亮状态数据
    setTitleSelectedStatus(newTitleSelectedStatus);
  };

  // 确定（隐藏对话框）
  const onSave = (type, value) => {
    document.body.className = "";

    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    // 菜单高亮逻辑处理
    const selectedVal = value;
    if (type === "area" && (selectedVal.length !== 2 || selectedVal[0] !== "area")) {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      // 高亮
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }

    /*
      组装筛选条件：
      1 在 Filter 组件的 onSave 方法中，根据最新 selectedValues 组装筛选条件数据 filters。
      2 获取区域数据的参数名：area 或 subway（选中值数组的第一个元素）。
      3 获取区域数据的值（以最后一个 value 为准）。
      4 获取方式和租金的值（选中值的第一个元素）。
      5 获取筛选（more）的值（将选中值数组转化为以逗号分隔的字符串）。

      {
        area: 'AREA|67fad918-f2f8-59df', // 或 subway: '...'
        mode: 'true', // 或 'null'
        price: 'PRICE|2000',
        more: 'ORIEN|80795f1a-e32f-feb9,ROOM|d4a692e4-a177-37fd'
      }
    */

    const newSelectedValues = {
      ...selectedValues,
      // 只更新当前 type 对应的选中值
      [type]: value,
    };

    const { area, mode, price, more } = newSelectedValues;

    // 筛选条件数据
    const filters = {};

    // 区域
    const areaKey = area[0];
    let areaValue = "null";
    if (area.length === 3) {
      areaValue = area[2] !== "null" ? area[2] : area[1];
    }
    filters[areaKey] = areaValue;

    // 方式和租金
    filters.mode = mode[0];
    filters.price = price[0];

    // 更多筛选条件 more
    filters.more = more.join(",");

    console.log(filters);

    // 调用父组件中的方法，来将筛选数据传递给父组件
    props.onFilter(filters);

    // 隐藏对话框
    setOpenType("");
    // 更新菜单高亮状态数据
    setTitleSelectedStatus(newTitleSelectedStatus);
    // 更新筛选条件的选中值
    setSelectedValues(newSelectedValues);
  };
  //#endregion

  //#region 渲染遮罩层
  const renderMask = () => {
    // 遮罩层是否隐藏
    const isHide = openType === "more" || openType === "";

    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          // 说明遮罩层已经完成动画效果，隐藏了
          if (props.opacity === 0) {
            return null;
          }

          return <div style={props} className={styles.mask} onClick={() => onCancel(openType)} />;
        }}
      </Spring>
    );
  };
  //#endregion

  return (
    <div className={styles.root}>
      {/* 前三个菜单的遮罩层 */}
      {renderMask()}
      <div className={styles.content}>
        {/* 标题栏 */}
        <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={onTitleClick} />
        {/* 前三个菜单对应的内容： */}
        {renderFilterPicker()}
        {/* 最后一个菜单对应的内容： */}
        {renderFilterMore()}
      </div>
    </div>
  );
}

export default Filter;
