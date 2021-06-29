/*
 * @Author: 九玖
 * @Date: 2021-06-29 08:39:34
 * @LastEditTime: 2021-06-29 11:47:56
 * @LastEditors: 九玖
 * @Description: 格式化城市列表数据
 * @FilePath: \haozuke\src\utils\cityListFormat.js
 */

const cityListFormat = list => {
  let cityList = {};
  let cityIndex = [];

  // 遍历 list 数组
  list.forEach(item => {
    let firstLetter = item.short[0];
    // 判断 CityLife 对象中是否含有某一个字母的键
    if (firstLetter in cityList) {
      // 如果存在，把这个值添加到对应键的数组中
      cityList[firstLetter].push(item);
    } else {
      // 如果不存在，创建一个键 并把这个键对应的数据添加到这个键的数组中
      cityList[firstLetter] = [item];
    }
  });

  cityIndex = Object.keys(cityList).sort();

  console.log(cityList, cityIndex);
  return { cityList, cityIndex };
};

export default cityListFormat;
