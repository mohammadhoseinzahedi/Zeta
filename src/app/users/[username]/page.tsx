import Container from "@/components/Container";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserByUsername, type User } from "@/db/user";
import { getAuthenticatedUser } from "@/auth";
import FollowButton from "@/components/user/FollowButton";
import Loading from "@/app/loading";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Posts from "@/components/post/Posts";
import { getUserPosts } from "@/db/post";
import UserPageTabs from "@/components/user/UserPageTabs";
import CommentsInfiniteScroll from "@/components/comment/CommentsInfiniteScroll";
import { getCommentsByAuthorId } from "@/db/comment";
import { cn } from "@/lib/utils";
import { UserRoundPen } from "lucide-react";
import { LogOut } from "lucide-react";
import PostsSkeleton from "@/components/post/PostsSkeleton";

const Header = ({ user: { name, username, _count } }: { user: User }) => {
  return (
    <header>
      <Container className="flex items-center gap-8 py-2">
        <BackButton />
        <div>
          <h1>{name ?? username}</h1>
          <p className="text-sm text-slate-700">{_count.posts} posts</p>
        </div>
      </Container>
    </header>
  );
};

const HeroSection = ({ user: { username, image } }: { user: User }) => {
  return (
    <div className="relative bg-slate-300 min-h-32 rounded-t-2xl">
      <Avatar className="absolute bottom-0 left-4 -mb-10 w-20 h-20 border-2 border-white">
        <AvatarImage src={image ?? "/img_avatar.png"} />
        <AvatarFallback>{username}</AvatarFallback>
      </Avatar>
    </div>
  );
};

const Buttons = async ({ user }: { user: User }) => {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) {
    return (
      <Link
        href={`/api/auth/signin`}
        className={`${buttonVariants({
          variant: "default",
        })} rounded-full cursor-pointer`}
      >
        Signin to follow
      </Link>
    );
  }
  if (user.username === authenticatedUser.username) {
    return (
      <>
        <Link
          href={`/users/${user.username}/edit`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-xs text-slate-900 rounded-full cursor-pointer min-w-[90px] me-4",
          )}
        >
          <UserRoundPen /> Edit profile
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-xs text-slate-900 rounded-full cursor-pointer min-w-[90px]",
          )}
          href="/api/auth/signout"
        >
          <LogOut /> Signout
        </Link>
      </>
    );
  }
  return <FollowButton user={user} />;
};

const UserInformations = ({
  user: { username, name, createdAt, bio, _count },
}: {
  user: User;
}) => {
  return (
    <div className="space-y-2">
      <h2>{name}</h2>
      <h3 className="text-slate-700 text-sm">@{username}</h3>
      <p>{bio}</p>
      <p className="flex gap-2 text-slate-700 text-sm items-center">
        <CalendarDays size={16} /> Joined{" "}
        {new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </p>
      <div className="flex gap-4 text-slate-700 text-sm items-center">
        <p>
          <Link href={`/users/${username}/followings`}>
            <span className="text-black">{_count.following}</span> Following
          </Link>
        </p>
        <p>
          <Link href={`/users/${username}/followers`}>
            <span className="text-black">{_count.followedBy}</span> Followers
          </Link>
        </p>
      </div>
    </div>
  );
};

const Comments = async ({ userId }: { userId: string }) => {
  const comments = await getCommentsByAuthorId(userId);
  return (
    <CommentsInfiniteScroll
      initialComments={comments}
      getBy="author"
      authorId={userId}
    />
  );
};

const PostsSection = async ({ userId }: { userId: string }) => {
  const authenticatedUser = await getAuthenticatedUser();
  const posts = await getUserPosts(userId, authenticatedUser?.id);
  return <Posts posts={posts} />;
};

const Wrapper = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { username } = await params;
  const authenticatedUser = await getAuthenticatedUser();
  const user = await getUserByUsername(username, authenticatedUser?.id);
  if (!user) notFound();
  const { tab = "posts" } = await searchParams;

  return (
    <Container>
      <Header user={user} />
      <HeroSection user={user} />
      <div className="flex justify-end mt-4">
        <Suspense fallback={<LoaderCircle className="animate-spin" />}>
          <Buttons user={user} />
        </Suspense>
      </div>
      <UserInformations user={user} />
      <UserPageTabs />
      <div className="space-y-4 mt-4">
        {tab === "posts" && (
          <Suspense fallback={<PostsSkeleton />}>
            <PostsSection userId={user.id} />
          </Suspense>
        )}
        {tab === "comments" && (
          <Suspense
            fallback={
              <div className="flex justify-center py-3">
                <LoaderCircle className="animate-spin" />
              </div>
            }
          >
            <Comments userId={user.id} />
          </Suspense>
        )}
      </div>
    </Container>
  );
};

const UserPage = ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <Wrapper params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default UserPage;
