import { prisma } from "@/lib/prisma";
import { userBasicSelect, userDetailSelect } from "@/db/selects";
import { pagination } from "@/db/utils";
import type { UserInputDbType } from "@/schema/user";

export type UserBasic = {
  username: string;
  name: string | null;
  image: string | null;
  isAuthenticatedUser: boolean;
  isFollowedByAuthenticatedUser: boolean;
};

export type User = NonNullable<Awaited<ReturnType<typeof getUserByUsername>>>;

export async function getUserByUsername(
  username: string,
  authenticatedUserId: string | undefined,
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...userDetailSelect,
      followedBy: {
        where: { id: authenticatedUserId ?? "" },
        select: { username: true },
      },
    },
  });

  if (!user) return null;

  const { followedBy, ...rest } = user;
  return {
    ...rest,
    isFollowedByAuthenticatedUser: authenticatedUserId
      ? followedBy.length > 0
      : false,
    isAuthenticatedUser: user.id === authenticatedUserId,
  };
}

export async function getUserIdByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function getUserFollowers(
  userId: string,
  authenticatedUserId: string | undefined,
  page: number = 1,
  limit: number = 20,
) {
  const { take, skip } = pagination(page, limit);
  const users = await prisma.user.findMany({
    skip,
    take,
    where: { following: { some: { id: userId } } },
    select: {
      ...userBasicSelect,
      followedBy: {
        where: { id: authenticatedUserId ?? "" },
        select: { username: true },
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
  limit: number = 20,
) {
  const { take, skip } = pagination(page, limit);
  const users = await prisma.user.findMany({
    skip,
    take,
    where: { followedBy: { some: { id: userId } } },
    select: {
      ...userBasicSelect,
      followedBy: {
        where: { id: authenticatedUserId ?? "" },
        select: { username: true },
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
  await prisma.user.update({
    where: { username: following },
    data: {
      followedBy: { connect: { username: followedBy } },
    },
  });
}

export async function unFollowUser(following: string, followedBy: string) {
  await prisma.user.update({
    where: { username: following },
    data: {
      followedBy: { disconnect: { username: followedBy } },
    },
  });
}

export async function updateUser(
  username: string,
  data: UserInputDbType,
) {
  await prisma.user.update({
    where: { username },
    data,
  });
}
