"use client";
import { LoaderCircle } from "lucide-react";
import {
  type CommentLoaderActionProps,
  loadMoreComments,
} from "@/actions/comment";
import type { Comment as CommentType } from "@/db/comment";
import Comment from "@/components/comment/Comment";
import CommentForm from "@/components/comment/CommentForm";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useAuth } from "@/context/AuthContext";

type CommonProps = {
  initialComments?: CommentType[];
};

type PostCommentsProps = CommonProps & {
  getBy: "post";
  postId: string;
  authorId?: never;
};

type AuthorCommentsProps = CommonProps & {
  getBy: "author";
  authorId: string;
  postId?: never;
};

type CommentsInfiniteScrollProps = PostCommentsProps | AuthorCommentsProps;

const CommentsInfiniteScroll = ({
  initialComments,
  getBy = "post",
  postId,
  authorId,
}: CommentsInfiniteScrollProps) => {
  const { user } = useAuth();
  const {
    data: comments,
    status,
    ref,
    setData: setComments,
    setStatus,
  } = useInfiniteScroll<CommentType, CommentLoaderActionProps>(
    initialComments || [],
    loadMoreComments,
    { postId, authorId, getBy },
  );

  return (
    <div className="space-y-4">
      {getBy === "post" && postId && (
        <>
          <CommentForm
            postId={postId}
            setStatus={setStatus}
            setComments={setComments}
          />
          <div
            id="comments"
            className="text-center text-slate-900 text-sm py-2 border-y"
          >
            Comments
          </div>
        </>
      )}
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          authenticatedUser={user}
          comment={comment}
          getBy={getBy}
          setComments={setComments}
          setStatus={setStatus}
        />
      ))}
      {status.hasMore && (
        <div ref={ref} className="flex justify-center py-3">
          {status.error ? (
            <p className="text-sm">Loading comments failed ...</p>
          ) : (
            <div>
              <LoaderCircle className="animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentsInfiniteScroll;
