import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fetchBlogList, { BlogList, Blogs } from "./apis/fetchBlogList";

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

const allBlogList: Array<BlogList> = [];

const fetchAllList = (page: number, since_id: string | null) => {
  let currentPage = page;
  return fetchBlogList(page, since_id).then((response) => {
    const blogs = response?.data.data;

    if (!blogs) return;
    since_id = blogs.since_id;

    if (!blogs?.list.length) {
      console.log(`finished fetch all data`);
      return;
    }

    blogs?.list.forEach((blog) => {
      allBlogList.push(blog);
      console.log(`当前${blog.visible}微博可见范围为${blog.visible.type}`);
    });

    fetchAllList(++currentPage, blogs.since_id as string);
  });
};

fetchAllList(0, null);
