import { PostInputDbSchema, PostInputDb } from "@/schema/post";
import { prisma } from "@/lib/prisma";

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
    select: {
      id: true,
      content: true,
      image: true,
      likes: {
        where: { id: authenticatedUserId },
        select: {
          username: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          followedBy: {
            where: {
              id: authenticatedUserId,
            },
            select: {
              username: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return (
    post && {
      id: post.id,
      content: post.content,
      image: post.image,
      author: {
        username: post.author.username,
        name: post.author.name,
        image: post.author.image,
        isFollowedByAuthenticatedUser: authenticatedUserId
          ? post.author.followedBy.length > 0
          : false,
        isAuthenticatedUser: post.author.id === authenticatedUserId,
      },
      isLikedByAuthenticatedUser: authenticatedUserId
        ? post.likes.length > 0
        : false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
    }
  );
}

export async function getPosts(authenticatedUserId?: string): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {},
    select: {
      id: true,
      content: true,
      image: true,
      likes: {
        where: { id: authenticatedUserId },
        select: {
          username: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          followedBy: {
            where: {
              id: authenticatedUserId,
            },
            select: {
              username: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    image: post.image,
    author: {
      username: post.author.username,
      name: post.author.name,
      image: post.author.image,
      isFollowedByAuthenticatedUser: authenticatedUserId
        ? post.author.followedBy.length > 0
        : false,
      isAuthenticatedUser: post.author.id === authenticatedUserId,
    },
    isLikedByAuthenticatedUser: authenticatedUserId
      ? post.likes.length > 0
      : false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
  }));
}

export async function getUserPosts(
  authorId: string,
  authenticatedUserId?: string,
): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { authorId },
    select: {
      id: true,
      content: true,
      image: true,
      likes: {
        where: { id: authenticatedUserId },
        select: {
          username: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          followedBy: {
            where: {
              id: authenticatedUserId,
            },
            select: {
              username: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    image: post.image,
    author: {
      username: post.author.username,
      name: post.author.name,
      image: post.author.image,
      isFollowedByAuthenticatedUser: authenticatedUserId
        ? post.author.followedBy.length > 0
        : false,
      isAuthenticatedUser: post.author.id === authenticatedUserId,
    },
    isLikedByAuthenticatedUser: authenticatedUserId
      ? post.likes.length > 0
      : false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
  }));
}

export async function getUserFollowingsPosts(
  authenticatedUserId?: string,
): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { author: { followedBy: { some: { id: authenticatedUserId } } } },
    select: {
      id: true,
      content: true,
      image: true,
      likes: {
        where: { id: authenticatedUserId },
        select: {
          username: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          followedBy: {
            where: {
              id: authenticatedUserId,
            },
            select: {
              username: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    image: post.image,
    author: {
      username: post.author.username,
      name: post.author.name,
      image: post.author.image,
      isFollowedByAuthenticatedUser: authenticatedUserId
        ? post.author.followedBy.length > 0
        : false,
      isAuthenticatedUser: post.author.id === authenticatedUserId,
    },
    isLikedByAuthenticatedUser: authenticatedUserId
      ? post.likes.length > 0
      : false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
  }));
}

export async function createPost(
  username: string,
  unSafeData: PostInputDb,
): Promise<void> {
  const data = await PostInputDbSchema.parseAsync(unSafeData);
  await prisma.post.create({
    data: {
      ...data,
      author: {
        connect: {
          username,
        },
      },
    },
  });
}

export async function updatePost(
  id: string,
  unSafeData: PostInputDb,
): Promise<void> {
  const data = await PostInputDbSchema.parseAsync(unSafeData);
  await prisma.post.update({
    where: { id },
    data,
  });
}

export async function deletePost(postId: string) {
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
      likes: {
        connect: {
          username,
        },
      },
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
      likes: {
        disconnect: {
          username,
        },
      },
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
