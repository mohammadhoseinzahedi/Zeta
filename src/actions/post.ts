"use server";
import type { PostInputDb } from "@/schema/post";
import {
  createPost as createPostDb,
  updatePost as updatePostDb,
  deletePost as deletePostDb,
  likePost as likePostDb,
  unLikePost as unLikePostDb,
  getPost,
} from "@/db/post";
import { notFound, redirect, unauthorized } from "next/navigation";
import { verifySession } from "@/modules/auth/lib/session";
import { canCUD } from "@/modules/auth/lib/permissions";

export type PostLoaderActionProps = {
  authorId?: string;
  getBy?: "following" | "author";
};

export async function createPost(unSafeData: PostInputDb) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) unauthorized();

  await createPostDb(authenticatedUser.username, unSafeData);
}

export async function updatePost(postId: string, unSafeData: PostInputDb) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) unauthorized();
  const post = await getPost(postId);
  if (!post) notFound();
  if (!(canCUD(post.author.username, authenticatedUser))) unauthorized();

  await updatePostDb(postId, unSafeData);
}

export async function deletePost(postId: string) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) unauthorized();
  const post = await getPost(postId);
  if (!post) notFound();
  if (!canCUD(post.author.username, authenticatedUser)) unauthorized();

  await deletePostDb(postId);
}

export async function likePost(postId: string) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/signin");
  await likePostDb(authenticatedUser.username, postId);
}

export async function unLikePost(postId: string) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/signin");
  await unLikePostDb(authenticatedUser.username, postId);
}
