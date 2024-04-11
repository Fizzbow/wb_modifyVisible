import $https from ".";
import { BlogList } from "./fetchBlogList";

/** 0:公开,1:自己可见,2:好友圈可见 */
export type ModifyVisible = "0" | "1" | "2";

const modifyBlogVisible = (ids: string, visible: ModifyVisible) => {
  return $https.post<{
    ok: number;
    statuses: [BlogList];
  }>("/ajax/statuses/modifyVisible", {
    ids,
    visible,
  });
};

export default modifyBlogVisible;
