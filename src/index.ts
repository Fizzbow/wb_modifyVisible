import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fetchBlogList, { BlogList, visibleCNMap } from "./apis/fetchBlogList";
import modifyBlogVisible, { ModifyVisible } from "./apis/modifyBlogVisible";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

let modifyVisible: ModifyVisible = "2";

console.log("argvargv", process.argv);

if (process.argv.length === 2) {
  modifyVisible = process.argv[2] as ModifyVisible;
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

      allBlogList.forEach((blog) => {
        if (
          blog.visible.type === modifyVisible ||
          String(blog.share_repost_type) === "0"
        ) {
          return;
        }

        modifyBlogVisible(blog.idstr, modifyVisible)
          .then((res) => {
            if (String(res.data.ok) === "1") {
              console.log(
                `已将微博${blog.idstr}的可见范围设置为${
                  visibleCNMap[res.data.statuses[0].visible.type]
                }可见`
              );
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      });
      return;
    }

    blogs?.list.forEach((blog) => {
      allBlogList.push(blog);
    });

    fetchAllList(++currentPage, blogs.since_id as string);
  });
};

fetchAllList(0, null);
