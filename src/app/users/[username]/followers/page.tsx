import { loadMoreUserFollowers } from "@/actions/user";
import Loading from "@/app/loading";
import { getAuthenticatedUser } from "@/auth";
import Container from "@/components/Container";
import UsersInfiniteScroll from "@/components/user/UsersInfiniteScroll";
import { getUserFollowers, getUserIdByUsername } from "@/db/user";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const Wrapper = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const authenticatedUser = await getAuthenticatedUser();
  const { username } = await params;
  const userId = await getUserIdByUsername(username);
  if (!userId) notFound();
  const users = await getUserFollowers(userId, authenticatedUser?.id);
  return (
    <Container className="py-4">
      <UsersInfiniteScroll
        userId={userId}
        initialUsers={users}
        userLoaderAction={loadMoreUserFollowers}
      />
    </Container>
  );
};

const UserFollowersPage = ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <Wrapper params={params} />
    </Suspense>
  );
};

export default UserFollowersPage;
