"use client";
import { LoaderCircle } from "lucide-react";
import Post from "@/components/post/Post";
import { loadMorePosts, PostLoaderActionProps } from "@/actions/post";
import { useSession } from "next-auth/react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

type PostsInfiniteScrollProps = {
  authorId?: string;
  getBy?: "following" | "author";
  initialPosts: Post[];
  hideFollowButton?: boolean;
};

const PostsInfiniteScroll = ({
  initialPosts,
  authorId,
  getBy,
}: PostsInfiniteScrollProps) => {
  const { data: session } = useSession();
  const {
    data: posts,
    status,
    ref,
  } = useInfiniteScroll<Post, PostLoaderActionProps>(
    initialPosts || [],
    loadMorePosts,
    { authorId, getBy }
  );
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} authenticatedUser={session?.user} post={post} />
      ))}
      {status.hasMore && (
        <div ref={ref} className="flex justify-center py-3">
          {status.error ? (
            <p className="text-sm">Loading posts failed ...</p>
          ) : (
            <LoaderCircle className="animate-spin" />
          )}
        </div>
      )}
    </>
  );
};

export default PostsInfiniteScroll;
