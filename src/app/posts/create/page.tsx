import { getAuthenticatedUser } from "@/lib/auth";
import PostForm from "@/components/post/PostForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const CreatePost = async () => {
  const authenticatedUser = await getAuthenticatedUser();
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
