"use server";
import {
  getComment,
  getCommentsByAuthorId,
  getCommentsByPostId,
} from "@/db/comment";
import { CommentInputDb } from "@/schema/comment";
import { notFound, redirect, unauthorized } from "next/navigation";
import {
  createComment as createCommentDb,
  updateComment as updateCommentDb,
  deleteComment as deleteCommentDb,
} from "@/db/comment";
import { verifySession } from "@/modules/auth/lib/session";
import { canCUD } from "@/modules/auth/lib/permissions";

export type CommentLoaderActionProps = {
  postId?: string;
  authorId?: string;
  getBy: "post" | "author";
};

export async function loadMoreComments(
  page: number,
  { postId, authorId, getBy }: CommentLoaderActionProps,
) {
  if (page < 1) page = 1;
  switch (getBy) {
    case "author":
      if (!authorId) throw new Error("Author ID is required");
      return await getCommentsByAuthorId(authorId, page);

    default:
      if (!postId) throw new Error("Post ID is required");
      return await getCommentsByPostId(postId, page);
  }
}

export async function createComment(
  postId: string,
  unSafeData: CommentInputDb,
) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/signin");
  return await createCommentDb(authenticatedUser.username, postId, unSafeData);
}

export async function updateComment(id: string, unSafeData: CommentInputDb) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) unauthorized();
  const comment = await getComment(id);
  if (!comment) notFound();
  if (!canCUD(comment.author.username, authenticatedUser)) unauthorized();
  await updateCommentDb(id, unSafeData);
}

export async function deleteComment(id: string) {
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) unauthorized();
  const comment = await getComment(id);
  if (!comment) notFound();
  if (!canCUD(comment.author.username, authenticatedUser)) unauthorized();
  await deleteCommentDb(id);
}
