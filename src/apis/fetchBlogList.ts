import $https from ".";

import dotenv from "dotenv";

dotenv.config();

type visibleState = "0" | "1" | "6";

export const visibleCNMap: Record<visibleState, string> = {
  0: "公开",
  1: "仅自己可见",
  6: "好友圈",
};

export interface BlogListParams {
  uid: string;
  page: number;
  feature: "0";
  since_id: string | null;
}

export interface Blogs {
  since_id: string;
  list: Array<BlogList>;
  status_visible: number;
}

export interface BlogList {
  visible: {
    type: number;
    list_id: number;
  };
  idstr: string;
}

const fetchBlogList = async (page: number, since_id: string | null) => {
  console.log(`🐱 current page ${page}`);
  let currentPage = page;
  if (!process.env.UID) {
    return;
  }

  const params: BlogListParams = {
    uid: process.env.UID,
    page: currentPage,
    feature: "0",
    since_id,
  };
  return await $https.get<{ data: Blogs; ok: number }>(
    "/ajax/statuses/mymblog",
    {
      params,
    }
  );
};

export default fetchBlogList;
