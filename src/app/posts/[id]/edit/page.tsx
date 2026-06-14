import Loading from "@/app/loading";
import { getAuthenticatedUser } from "@/lib/auth";
import PostForm from "@/components/post/PostForm";
import { getPost } from "@/db/post";
import { canUpdatePost } from "@/permissions/post";
import { notFound, redirect, unauthorized } from "next/navigation";
import { Suspense } from "react";

const EditPost = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) redirect("/api/auth/signin");
  const post = await getPost(id);
  if (!post) notFound();
  if (!canUpdatePost(authenticatedUser, post)) unauthorized();
  return <PostForm post={post} />;
};

const EditPostPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<Loading />}>
      <EditPost params={params} />
    </Suspense>
  );
};

export default EditPostPage;
