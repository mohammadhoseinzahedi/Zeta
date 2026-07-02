import { prisma } from "@/lib/prisma";
import { postSelect, mapPost } from "@/db/selects";
import type { PostInputDb } from "@/schema/post";

export type Post = {
  id: string;
  content: string;
  image: string | null;
  author: {
    username: string;
    name: string | null;
    image: string | null;
    isFollowedByAuthenticatedUser: boolean;
    isAuthenticatedUser: boolean;
  };
  isLikedByAuthenticatedUser: boolean;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
};

export async function getPost(
  postId: string,
  authenticatedUserId?: string,
): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: postSelect(authenticatedUserId),
  });
  return post ? mapPost(post, authenticatedUserId) : null;
}

export async function getPosts(authenticatedUserId?: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {},
    select: postSelect(authenticatedUserId),
    orderBy: { createdAt: "desc" },
  });
  return posts.map((post) => mapPost(post, authenticatedUserId));
}

export async function getUserPosts(
  authorId: string,
  authenticatedUserId?: string,
): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { authorId },
    select: postSelect(authenticatedUserId),
    orderBy: { createdAt: "desc" },
  });
  return posts.map((post) => mapPost(post, authenticatedUserId));
}

export async function getUserFollowingsPosts(
  authenticatedUserId?: string,
): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { author: { followedBy: { some: { id: authenticatedUserId } } } },
    select: postSelect(authenticatedUserId),
    orderBy: { createdAt: "desc" },
  });
  return posts.map((post) => mapPost(post, authenticatedUserId));
}

export async function createPost(
  username: string,
  data: PostInputDb,
): Promise<void> {
  await prisma.post.create({
    data: {
      ...data,
      author: { connect: { username } },
    },
  });
}

export async function updatePost(
  id: string,
  data: PostInputDb,
): Promise<void> {
  await prisma.post.update({
    where: { id },
    data,
  });
}

export async function deletePost(postId: string): Promise<void> {
  await prisma.post.delete({
    where: { id: postId },
  });
}

export async function likePost(
  username: string,
  postId: string,
): Promise<void> {
  await prisma.post.update({
    where: { id: postId },
    data: {
      likes: { connect: { username } },
    },
  });
}

export async function unLikePost(
  username: string,
  postId: string,
): Promise<void> {
  await prisma.post.update({
    where: { id: postId },
    data: {
      likes: { disconnect: { username } },
    },
  });
}

export async function isLikedPost(
  id: string,
  username: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      likedPosts: {
        where: { id },
      },
    },
  });
  return user ? user.likedPosts.length > 0 : false;
}
