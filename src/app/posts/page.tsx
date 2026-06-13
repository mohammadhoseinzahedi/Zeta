import { getPosts, getUserFollowingsPosts } from "@/db/post";
import { Suspense } from "react";
import Posts from "@/components/post/Posts";
import { getAuthenticatedUser } from "@/auth";
import Container from "@/components/Container";
import PostsPageTabs from "@/components/post/PostsPageTabs";
import { redirect } from "next/navigation";
import PostsSkeleton from "@/components/post/PostsSkeleton";

const UserFollowingsPosts = async () => {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) redirect("/api/auth/signin");
  const posts = await getUserFollowingsPosts(authenticatedUser?.id);
  return <Posts posts={posts} />;
};

const AllPosts = async () => {
  const authenticatedUser = await getAuthenticatedUser();
  const posts = await getPosts(authenticatedUser?.id);
  return <Posts posts={posts} />;
};

const PostsTabs = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { tab = "all" } = await searchParams;
  return (
    <>
      {tab === "all" && (
        <Suspense fallback={<PostsSkeleton />}>
          <AllPosts />
        </Suspense>
      )}
      {tab === "following" && (
        <Suspense fallback={<PostsSkeleton />}>
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
    <Container className="space-y-4">
      <PostsPageTabs />
      <PostsTabs searchParams={searchParams} />
    </Container>
  );
};

export default PostsPage;
