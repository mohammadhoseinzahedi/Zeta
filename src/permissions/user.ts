import { authenticatedUserType } from "@/auth";

export function canUpdateUser(
  authenticatedUser: NonNullable<authenticatedUserType>,
  username: string
) {
  return (
    username === authenticatedUser.username ||
    ["OWNER"].includes(authenticatedUser.role)
  );
}
