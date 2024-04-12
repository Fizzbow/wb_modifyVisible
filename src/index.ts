import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fetchBlogList, { BlogList, visibleCNMap } from "./apis/fetchBlogList";
import modifyBlogVisible, { ModifyVisible } from "./apis/modifyBlogVisible";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

let modifyVisible: ModifyVisible = "2";

if (process.argv.length === 3) {
  console.log("process.argv", process.argv.length);
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
      console.log(`finished | 一共有${allBlogList.length}条数据`);
      modifyAllBlogVisible(0);
      return;
    }

    blogs?.list.forEach((blog) => {
      allBlogList.push(blog);
    });

    fetchAllList(++currentPage, blogs.since_id as string);
  });
};

function modifyAllBlogVisible(index: number) {
  if (index >= allBlogList.length) {
    console.log(`🐶 modify blog visible finished ${index}`);
    return;
  }

  const currBlog = allBlogList[index];

  if (
    currBlog.visible.type == modifyVisible ||
    String(currBlog.share_repost_type) == "0" ||
    (modifyVisible == "2" && currBlog.visible.type == "6")
  ) {
    modifyAllBlogVisible(++index);
    return;
  }

  setTimeout(() => {
    console.log(
      "fetch modifyBlogVisible",
      modifyVisible,
      currBlog.visible.type
    );
    modifyAllBlogVisible(++index);
  }, 1000);

  // modifyBlogVisible(currBlog.idstr, modifyVisible)
  //   .then((res) => {
  //     if (res.data.ok == 1) {
  //       console.log(
  //         `已将微博${currBlog.idstr}的可见范围设置为${
  //           visibleCNMap[res.data.statuses[0].visible.type]
  //         }可见`
  //       );

  //       setTimeout(() => {
  //         modifyAllBlogVisible(++index);
  //       }, 1000);
  //     }
  //   })
  //   .catch((err) => {
  //     throw new Error(err);
  //   });
}

fetchAllList(1, null);
