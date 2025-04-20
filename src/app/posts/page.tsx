import { getPosts, getUserFollowingsPosts } from "@/db/post";
import { Suspense } from "react";
import PostsInfiniteScroll from "@/components/post/PostsInfiniteScroll";
import { getAuthenticatedUser } from "@/auth";
import Container from "@/components/Container";
import Loading from "@/app/loading";
import PostsPageTabs from "@/components/post/PostsPageTabs";
import { redirect } from "next/navigation";

const UserFollowingsPosts = async () => {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) redirect("/api/auth/signin");
  const posts = await getUserFollowingsPosts(authenticatedUser?.id);
  return <PostsInfiniteScroll initialPosts={posts} getBy="following" />;
};

const AllPosts = async () => {
  const authenticatedUser = await getAuthenticatedUser();
  const posts = await getPosts(authenticatedUser?.id);
  return <PostsInfiniteScroll initialPosts={posts} />;
};

const Posts = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { tab = "all" } = await searchParams;
  return (
    <>
      {tab === "all" && (
        <Suspense fallback={<Loading />}>
          <AllPosts />
        </Suspense>
      )}
      {tab === "following" && (
        <Suspense fallback={<Loading />}>
          <UserFollowingsPosts />
        </Suspense>
      )}
    </>
  );
};

const PostsPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <Container className="space-y-4">
        <PostsPageTabs />
        <Posts searchParams={searchParams} />
      </Container>
    </Suspense>
  );
};

export default PostsPage;
