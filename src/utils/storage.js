/*
 * @Author: 九玖
 * @Date: 2021-06-29 10:48:25
 * @LastEditTime: 2021-07-09 16:10:47
 * @LastEditors: 九玖
 * @Description: localStorage 封装
 * @FilePath: \haozuke\src\utils\storage.js
 */

const HZK_CITY = "hzk_city";

// 获取 localStorage 的值
export const getCity = () => {
  return JSON.parse(window.localStorage.getItem(HZK_CITY));
};

// 设置 localStorage 的值
export const setCity = value => {
  return window.localStorage.setItem(HZK_CITY, JSON.stringify(value));
};
