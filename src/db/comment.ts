import { CommentInputDbSchema, CommentInputDb } from "@/schema/comment";
import { prisma } from "@/lib/prisma";

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
    where: {
      id,
    },
    select: {
      id: true,
      postId: true,
      authorId: true,
      content: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getCommentsByAuthorId(
  authorId: string,
  page: number = 1,
  limit: number = 10
): Promise<Comment[]> {
  const take = limit;
  const skip = take * (page - 1);
  return await prisma.comment.findMany({
    skip,
    take,
    where: {
      authorId,
    },
    select: {
      id: true,
      postId: true,
      authorId: true,
      content: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCommentsByPostId(
  postId: string,
  page: number = 1,
  limit: number = 10
): Promise<Comment[]> {
  const take = limit;
  const skip = take * (page - 1);
  return await prisma.comment.findMany({
    skip,
    take,
    where: {
      postId,
    },
    select: {
      id: true,
      postId: true,
      authorId: true,
      content: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(
  username: string,
  postId: string,
  unSafeData: CommentInputDb
): Promise<Comment> {
  const data = await CommentInputDbSchema.parseAsync(unSafeData);
  return await prisma.comment.create({
    data: {
      ...data,
      author: {
        connect: {
          username,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
    select: {
      id: true,
      postId: true,
      authorId: true,
      content: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateComment(
  id: string,
  unSafeData: CommentInputDb
): Promise<Comment> {
  const data = await CommentInputDbSchema.parseAsync(unSafeData);
  return await prisma.comment.update({
    where: { id },
    data,
    select: {
      id: true,
      postId: true,
      authorId: true,
      content: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteComment(id: string): Promise<void> {
  await prisma.comment.delete({
    where: { id },
  });
}
