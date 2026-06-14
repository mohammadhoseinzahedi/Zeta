import { Post } from "@/db/post";
import { AuthenticatedUser } from "@/lib/auth";

export function canUpdatePost(
  authenticatedUser: AuthenticatedUser | null,
  post: Post
) {
  return (
    post.author.username === authenticatedUser?.username ||
    (authenticatedUser && ["OWNER"].includes(authenticatedUser.role))
  );
}
