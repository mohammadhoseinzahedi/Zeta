import { prisma } from "@/prisma";
import { UserInputDbSchema, UserInputDbType } from "@/schema/user";

export type User = NonNullable<Awaited<ReturnType<typeof getUserByUsername>>>;

export async function getUserByUsername(
  username: string,
  authenticatedUserId: string | undefined
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      followedBy: {
        where: {
          id: authenticatedUserId,
        },
        select: {
          username: true,
        },
      },
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followedBy: true,
          following: true,
        },
      },
    },
  });

  return (
    user &&
    (() => {
      const { followedBy, ...rest } = user; // Destructure `followedBy` to exclude it
      return {
        ...rest,
        isFollowedByAuthenticatedUser: authenticatedUserId
          ? followedBy.length > 0
          : false,
        isAuthenticatedUser: user.id === authenticatedUserId, // Check if the user is the authenticated user
      };
    })()
  );
}

export async function getUserIdByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
    },
  });

  return user && user.id;
}

export async function getUserFollowers(
  userId: string,
  authenticatedUserId: string | undefined,
  page: number = 1,
  limit: number = 20
) {
  const take = limit;
  const skip = take * (page - 1);
  const users = await prisma.user.findMany({
    skip,
    take,
    where: { following: { some: { id: userId } } },
    select: {
      id: true,
      name: true,
      username: true,
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
  });
  return users.map((user) => ({
    username: user.username,
    name: user.name,
    image: user.image,
    isAuthenticatedUser: user.id === authenticatedUserId,
    isFollowedByAuthenticatedUser: authenticatedUserId
      ? user.followedBy.length > 0
      : false,
  }));
}

export async function getUserFollowings(
  userId: string,
  authenticatedUserId: string | undefined,
  page: number = 1,
  limit: number = 20
) {
  const take = limit;
  const skip = take * (page - 1);

  const users = await prisma.user.findMany({
    skip,
    take,
    where: { followedBy: { some: { id: userId } } },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      followedBy: {
        where: {
          id: authenticatedUserId, // Filter by authenticatedUserId
        },
        select: {
          username: true, // Select the ID to check if the user is followed
        },
      },
    },
  });

  return users.map((user) => ({
    username: user.username,
    name: user.name,
    image: user.image,
    isAuthenticatedUser: user.id === authenticatedUserId,
    isFollowedByAuthenticatedUser: authenticatedUserId
      ? user.followedBy.length > 0
      : false,
  }));
}

export async function isFollowingUser(following: string, followedBy: string) {
  const user = await prisma.user.findUnique({
    where: { username: following },
    select: {
      followedBy: {
        where: { username: followedBy },
      },
    },
  });
  return user ? user.followedBy.length > 0 : false;
}

export async function followUser(following: string, followedBy: string) {
  return await prisma.user.update({
    where: { username: following },
    data: {
      followedBy: {
        connect: {
          username: followedBy,
        },
      },
    },
  });
}

export async function unFollowUser(following: string, followedBy: string) {
  return await prisma.user.update({
    where: { username: following },
    data: {
      followedBy: {
        disconnect: {
          username: followedBy,
        },
      },
    },
  });
}

export async function updateUser(
  username: string,
  unSafeData: UserInputDbType
) {
  const data = await UserInputDbSchema.parseAsync(unSafeData);
  return await prisma.user.update({
    where: { username },
    data,
  });
}
