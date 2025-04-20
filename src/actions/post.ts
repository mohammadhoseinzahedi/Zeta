"use server";
import { getAuthenticatedUser } from "@/auth";
import type { PostInputDb } from "@/schema/post";
import {
  createPost as createPostDb,
  updatePost as updatePostDb,
  deletePost as deletePostDb,
  likePost as likePostDb,
  unLikePost as unLikePostDb,
  getPost,
  getPosts,
  getUserPosts,
  getUserFollowingsPosts,
} from "@/db/post";
import { notFound, redirect, unauthorized } from "next/navigation";
import { canUpdatePost } from "@/permissions/post";

export type PostLoaderActionProps = {
  authorId?: string;
  getBy?: "following" | "author";
};

export async function loadMorePosts(
  page: number,
  { authorId, getBy }: PostLoaderActionProps
) {
  const authenticatedUser = await getAuthenticatedUser();
  if (page < 1) page = 1;

  switch (getBy) {
    case "author":
      if (!authorId) throw new Error("Author ID is required");
      return await getUserPosts(authorId, authenticatedUser?.id, page);

    case "following":
      return await getUserFollowingsPosts(authenticatedUser?.id, page);

    default:
      return await getPosts(authenticatedUser?.id, page);
  }
}

export async function createPost(unSafeData: PostInputDb) {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) unauthorized();

  await createPostDb(authenticatedUser.username, unSafeData);
}

export async function updatePost(postId: string, unSafeData: PostInputDb) {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) unauthorized();
  const post = await getPost(postId);
  if (!post) notFound();
  if (!canUpdatePost(authenticatedUser, post)) unauthorized();

  await updatePostDb(postId, unSafeData);
}

export async function deletePost(postId: string) {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) unauthorized();
  const post = await getPost(postId);
  if (!post) notFound();
  if (!canUpdatePost(authenticatedUser, post)) unauthorized();

  await deletePostDb(postId);
}

export async function likePost(postId: string) {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) redirect("/api/auth/signin");
  await likePostDb(authenticatedUser.username, postId);
}

export async function unLikePost(postId: string) {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) redirect("/api/auth/signin");
  await unLikePostDb(authenticatedUser.username, postId);
}
