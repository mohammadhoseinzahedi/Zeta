import { authenticatedUserType } from "@/auth";
import { Post } from "@/db/post";

export function canUpdatePost(
  authenticatedUser: authenticatedUserType,
  post: Post
) {
  return (
    post.author.username === authenticatedUser?.username ||
    (authenticatedUser && ["OWNER"].includes(authenticatedUser.role))
  );
}
