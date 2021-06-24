// export const baseHost = {
//   API1: {
//     // 开发的基准地址
//     dev_host: "http://127.0.0.1:8080/",
//     // 线上的基准地址
//     pro_host: "https://127.0.0.1:8080/",
//   },
// };

export const baseHost = {
  API1: process.env.REACT_APP_URL,
};
