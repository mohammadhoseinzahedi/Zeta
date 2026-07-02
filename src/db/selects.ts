import type { Post } from "@/db/post";

export const commentAuthorSelect = {
  username: true,
  name: true,
  image: true,
} as const;

export const commentWithAuthorSelect = {
  id: true,
  postId: true,
  authorId: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: { select: commentAuthorSelect },
} as const;

export const userBasicSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} as const;

export const userDetailSelect = {
  id: true,
  name: true,
  username: true,
  bio: true,
  image: true,
  createdAt: true,
  _count: {
    select: {
      posts: true,
      followedBy: true,
      following: true,
    },
  },
} as const;

export function postSelect(authUserId?: string) {
  const uid = authUserId ?? "";
  return {
    id: true,
    content: true,
    image: true,
    likes: {
      where: { id: uid },
      select: { username: true },
    },
    author: {
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        followedBy: {
          where: { id: uid },
          select: { username: true },
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
  } as const;
}

type PostRaw = {
  id: string;
  content: string;
  image: string | null;
  likes: { username: string }[];
  author: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
    followedBy: { username: string }[];
  };
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export function mapPost(
  post: PostRaw,
  authenticatedUserId?: string,
): Post {
  return {
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
  };
}
