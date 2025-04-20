"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PostsPageTabs = () => {
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "all";
  return (
    <div className="flex justify-around text-slate-700 border-b">
      <div className={tab === "all" ? "py-3 px-2 text-black border-b-4 rounded border-blue-500" : "py-3 px-2"}>
        <Link href={"?tab=all"}>All</Link>
      </div>
      <div className={tab === "following" ? "py-3 text-black border-b-4 rounded border-blue-500" : "py-3"}>
        <Link href={"?tab=following"}>Following</Link>
      </div>
    </div>
  );
};

export default PostsPageTabs;
