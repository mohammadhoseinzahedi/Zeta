"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const UserPageTabs = () => {
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "posts";
  return (
    <div className="mt-8 flex justify-around text-slate-700 border-y py-2">
      <div className={tab === "posts" ? "text-black" : ""}>
        <Link href={"?tab=posts"}>Posts</Link>
      </div>
      <div className={tab === "comments" ? "text-black" : ""}>
        <Link href={"?tab=comments"}>Comments</Link>
      </div>
    </div>
  );
};

export default UserPageTabs;
