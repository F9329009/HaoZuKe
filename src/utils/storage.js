/*
 * @Author: 九玖
 * @Date: 2021-06-29 10:48:25
 * @LastEditTime: 2021-06-29 10:53:19
 * @LastEditors: 九玖
 * @Description: localStorage 封装
 * @FilePath: \haozuke\src\utils\storage.js
 */

const HZK_CURCITY = "hzk_curcity";

// 获取 localStorage 的值
export const getCity = () => {
  return JSON.parse(window.localStorage.getItem(HZK_CURCITY));
};

// 设置 localStorage 的值
export const setCity = value => {
  return window.localStorage.setItem(HZK_CURCITY, JSON.stringify(value));
};
