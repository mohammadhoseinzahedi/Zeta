import PostForm from "@/components/post/PostForm";
import { verifySession } from "@/modules/auth/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const CreatePost = async () => {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/api/auth/signin");
  return <PostForm />;
};

const CreatePostPage = () => {
  return (
    <Suspense>
      <CreatePost />
    </Suspense>
  );
};

export default CreatePostPage;
