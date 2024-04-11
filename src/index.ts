import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const baseURL = "https://weibo.com";

let visibleState = "2";

if (process.argv.length === 2) {
  visibleState = process.argv[2];
}

app.get("/", (req: Request, res: Response) => {
  res.send(`serve running at ${process.env.PORT}`);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

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

const authHeader = {
  cookie: process.env.COOKIE,
  "x-Xsrf-Token": getStrBetween("XSRF-TOKEN=", ";", process.env.COOKIE),
};

authHeader;
