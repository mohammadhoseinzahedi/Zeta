import Link from "next/link";
import { Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Comment } from "@/db/comment";
import UserAvatar from "@/components/user/UserAvatar";
import { getTextDirection } from "@/lib/utils";
import CommentMoreDropdownMenu from "./CommentMoreDropdownMenu";
import { authenticatedUserType } from "@/auth";
import type { Dispatch, SetStateAction } from "react";

const Comment = ({
  comment,
  getBy = "post",
  authenticatedUser,
  setComments,
  setStatus,
}: {
  comment: Comment;
  getBy?: "post" | "author";
  authenticatedUser: authenticatedUserType;
  setComments?: Dispatch<SetStateAction<Comment[]>>;
  setStatus?: Dispatch<
    SetStateAction<{
      page: number;
      hasMore: boolean;
      error: boolean;
    }>
  >;
}) => {
  return (
    <div className="space-y-3 border-b pb-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Link className="block" href={`/users/${comment.author.username}`}>
          <UserAvatar user={comment.author} />
        </Link>
        <Link className="block" href={`/users/${comment.author.username}`}>
          {comment.author.name && <h3>{comment.author.name}</h3>}
          <h2 className="text-slate-900">@{comment.author.username}</h2>
        </Link>
        <div className="flex flex-wrap gap-3 ms-auto text-slate-700">
          {getBy === "author" && (
            <Link href={`/posts/${comment.postId}`}>
              <Eye />
            </Link>
          )}
          <CommentMoreDropdownMenu
            comment={comment}
            authenticatedUser={authenticatedUser}
            setComments={setComments}
            setStatus={setStatus}
          />
        </div>
      </div>
      <p dir={getTextDirection(comment.content)}>{comment.content}</p>
      <div className="text-slate-500 text-sm text-end">
        • {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
      </div>
    </div>
  );
};

export default Comment;
