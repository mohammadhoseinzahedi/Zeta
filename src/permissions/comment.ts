import { authenticatedUserType } from "@/auth";
import type { Comment } from "@/db/comment";

export function canUpdateComment(
  authenticatedUser: authenticatedUserType,
  comment: Comment
) {
  if (!authenticatedUser) return false;
  if (["OWNER"].includes(authenticatedUser.role)) return true;
  if (comment.author.username === authenticatedUser.username) return true;
  return false;
}
