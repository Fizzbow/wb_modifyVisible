import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fetchBlogList from "./apis/fetchBlogList";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const baseURL = "https://weibo.com/ajax/statuses";

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

fetchBlogList(0, null).then((response) => {
  const blogs = response?.data.data;
  console.log("blogsblogs", blogs.list[0]);
});
