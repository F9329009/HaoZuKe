import { useState } from "react";
import { PickerView } from "antd-mobile";

import FilterFooter from "../../../FilterFooter";

function FilterPicker(props) {
  const [value, setValue] = useState(props.defaultValue);
  return (
    <>
      {/*
        选择器组件：
        注意：一定要设置组件 value 属性的值，为当前选中状态的值，否则，无法实现切换选中项
      */}
      <PickerView data={props.data} value={value} cols={props.cols} onChange={val => setValue(val)} />

      {/* 底部按钮 */}
      <FilterFooter onCancel={() => props.onCancel(props.type)} onOk={() => props.onSave(props.type, value)} />
    </>
  );
}

export default FilterPicker;
