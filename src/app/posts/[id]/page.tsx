import { getPost } from "@/db/post";
import { notFound } from "next/navigation";
import Post from "@/components/post/Post";
import Container from "@/components/Container";
import BackButton from "@/components/BackButton";
import { Suspense } from "react";
import CommentsInfiniteScroll from "@/components/comment/CommentsInfiniteScroll";
import { getCommentsByPostId } from "@/db/comment";
import Loading from "@/app/loading";
import { LoaderCircle } from "lucide-react";
import { getAuthenticatedUser } from "@/auth";

const Comments = async ({ postId }: { postId: string }) => {
  const comments = await getCommentsByPostId(postId);
  return (
    <CommentsInfiniteScroll
      initialComments={comments}
      postId={postId}
      getBy="post"
    />
  );
};

const Wrapper = async ({ params }: { params: Promise<{ id: string }> }) => {
  const authenticatedUser = await getAuthenticatedUser();
  const post = await getPost((await params).id, authenticatedUser?.id);
  if (!post) notFound();
  return (
    <Container className="py-4 space-y-4">
      <header className="flex items-center gap-8">
        <BackButton />
        <h1 className="font-semibold">Post</h1>
      </header>
      <Post authenticatedUser={authenticatedUser} post={post} />
      <Suspense
        fallback={
          <div className="h-96">
            <LoaderCircle className="animate-spin mx-auto" />
          </div>
        }
      >
        <Comments postId={post.id} />
      </Suspense>
    </Container>
  );
};

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<Loading />}>
      <Wrapper params={params} />
    </Suspense>
  );
};

export default PostPage;
