"use server";
import { redirect, unauthorized } from "next/navigation";
import {
  followUser as followUserDb,
  unFollowUser as unFollowUserDb,
  updateUser as updateUserDb,
  isFollowingUser as isFollowingUserDb,
  getUserFollowers,
  getUserFollowings,
} from "@/db/user";
import { UserInputDbType } from "@/schema/user";
import { verifySession } from "@/modules/auth/lib/session";
import { canCUD } from "@/modules/auth/lib/permissions";

export type UserLoaderActionProps = {
  userId?: string;
};

export async function loadMoreUserFollowers(
  page: number,
  { userId }: UserLoaderActionProps,
) {
  if (!userId) throw new Error("User ID is required");
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) return redirect("/signin");
  return await getUserFollowers(userId, authenticatedUser.id, page);
}

export async function loadMoreUserFollowings(
  page: number,
  { userId }: UserLoaderActionProps,
) {
  if (!userId) throw new Error("User ID is required");
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) return redirect("/signin");
  return await getUserFollowings(userId, authenticatedUser.id, page);
}

export async function isFollowingUser(username: string) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) return false;
  return await isFollowingUserDb(username, authenticatedUser.username);
}

export async function followUser(username: string) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/signin");
  if (authenticatedUser.username === username)
    redirect(`/users/${username}/edit`);
  await followUserDb(username, authenticatedUser.username);
}

export async function unFollowUser(username: string) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/signin");
  if (authenticatedUser.username === username)
    redirect(`/users/${username}/edit`);
  await unFollowUserDb(username, authenticatedUser.username);
}

export async function updateUser(
  unSafeData: UserInputDbType,
  username: string,
) {
  if (!canCUD(username, await verifySession())) unauthorized();

  await updateUserDb(username, unSafeData);
}
