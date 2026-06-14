import { AuthenticatedUser } from "@/lib/auth";

export function canUpdateUser(
  authenticatedUser: AuthenticatedUser,
  username: string,
) {
  return (
    username === authenticatedUser.username ||
    ["OWNER"].includes(authenticatedUser.role)
  );
}
