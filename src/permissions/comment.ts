import type { Comment } from "@/db/comment";
import { AuthenticatedUser } from "@/lib/auth";

export function canUpdateComment(
  authenticatedUser: AuthenticatedUser | null,
  comment: Comment,
) {
  if (!authenticatedUser) return false;
  if (["OWNER"].includes(authenticatedUser.role)) return true;
  if (comment.author.username === authenticatedUser.username) return true;
  return false;
}
