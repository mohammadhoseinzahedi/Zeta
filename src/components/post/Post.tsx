import { type Post } from "@/db/post";
import PostLike from "@/components/post/PostLike";
import { MessageCircle } from "lucide-react";
import { Share2 } from "lucide-react";
import Time from "@/components/Time";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user/UserAvatar";
import PostMoreDropdownMenu from "@/components/post/PostMoreDropdownMenu";
import { getTextDirection } from "@/lib/utils";

const Post = ({ post }: { post: Post }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Link className="block" href={`/users/${post.author.username}`}>
          <UserAvatar user={post.author} />
        </Link>
        <Link className="block" href={`/users/${post.author.username}`}>
          {post.author.name && <h3>{post.author.name}</h3>}
          <h2 className="text-slate-900">@{post.author.username}</h2>
        </Link>
        <div className="ms-auto">
          <PostMoreDropdownMenu post={post} />
        </div>
      </div>
      <Link className="block space-y-4" href={`/posts/${post.id}`}>
        {post.image && (
          <img
            loading="lazy"
            src={post.image}
            className="rounded-lg w-full h-auto"
          />
        )}
        <p dir={getTextDirection(post.content)}>{post.content}</p>
      </Link>
      <p>
        <Time date={post.createdAt} />
      </p>
      {post.updatedAt.getTime() !== post.createdAt.getTime() && (
        <p className="text-slate-500 text-xs"> • Edited</p>
      )}
      <div className="text-slate-700 text-sm flex items-center gap-6 border-y py-1">
        <Link
          className="flex gap-2 items-center"
          href={`/posts/${post.id}#comments`}
        >
          <MessageCircle size={20} />
          {post.commentsCount}
        </Link>

        <PostLike post={post} />
        <Button
          disabled={true}
          variant={"ghost"}
          className="ms-auto cursor-pointer"
        >
          <Share2 size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Post;
