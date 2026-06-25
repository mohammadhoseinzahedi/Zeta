import Loading from "@/app/loading";
import PostForm from "@/components/post/PostForm";
import { getPost } from "@/db/post";
import { canCUD } from "@/modules/auth/lib/permissions";
import { verifySession } from "@/modules/auth/lib/session";
import { notFound, redirect, unauthorized } from "next/navigation";
import { Suspense } from "react";

const EditPost = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/api/auth/signin");
  const post = await getPost(id);
  if (!post) notFound();
  if (!canCUD(post.author.username, authenticatedUser)) unauthorized();
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
