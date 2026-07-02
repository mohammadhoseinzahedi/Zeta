import { prisma } from "@/lib/prisma";
import { commentWithAuthorSelect } from "@/db/selects";
import { pagination } from "@/db/utils";
import type { CommentInputDb } from "@/schema/comment";

export type Comment = {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    username: string;
    name: string | null;
    image: string | null;
  };
};

export async function getComment(id: string): Promise<Comment | null> {
  return await prisma.comment.findUnique({
    where: { id },
    select: commentWithAuthorSelect,
  });
}

export async function getCommentsByAuthorId(
  authorId: string,
  page: number = 1,
  limit: number = 10
): Promise<Comment[]> {
  const { take, skip } = pagination(page, limit);
  return await prisma.comment.findMany({
    skip,
    take,
    where: { authorId },
    select: commentWithAuthorSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCommentsByPostId(
  postId: string,
  page: number = 1,
  limit: number = 10
): Promise<Comment[]> {
  const { take, skip } = pagination(page, limit);
  return await prisma.comment.findMany({
    skip,
    take,
    where: { postId },
    select: commentWithAuthorSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(
  username: string,
  postId: string,
  data: CommentInputDb
): Promise<Comment> {
  return await prisma.comment.create({
    data: {
      ...data,
      author: { connect: { username } },
      post: { connect: { id: postId } },
    },
    select: commentWithAuthorSelect,
  });
}

export async function updateComment(
  id: string,
  data: CommentInputDb
): Promise<Comment> {
  return await prisma.comment.update({
    where: { id },
    data,
    select: commentWithAuthorSelect,
  });
}

export async function deleteComment(id: string): Promise<void> {
  await prisma.comment.delete({
    where: { id },
  });
}
