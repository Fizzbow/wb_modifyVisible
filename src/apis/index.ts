import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
console.log("envvvvv", process.env);

const getStrBetween = (startStr: string, endStr: string, allStr?: string) => {
  if (!allStr) {
    console.log("err 请在.env文件中配置COOKIE");
    return;
  }

  allStr = allStr.replace(/\s/g, "");

  const startIdx = allStr.indexOf(startStr);
  const endIdx = allStr.indexOf(endStr, startIdx);

  if (startIdx < 1 || endIdx < 1) {
    return;
  }

  return allStr.substring(startIdx + startStr.length, endIdx);
};

const $https = axios.create({
  baseURL: "https://weibo.com",
  headers: {
    cookie: process.env.COOKIE,
    "x-Xsrf-Token": getStrBetween("XSRF-TOKEN=", ";", process.env.COOKIE),
  },
});

$https.interceptors.request.use(
  (config) => {
    console.log("configgg", config);
    return config;
  },
  (err) => {
    throw Error(err);
    // return Promise.reject(err);
  }
);

$https.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    throw Error(err);
  }
);

export default $https;
