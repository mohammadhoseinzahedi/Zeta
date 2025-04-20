"use client";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, use } from "react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import FollowButton from "@/components/user/FollowButton";
import UserAvatar from "@/components/user/UserAvatar";
import type { User } from "@/db/user";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { UserLoaderActionProps } from "@/actions/user";

type UsersInfiniteScrollProps = {
  userId?: string;
  initialUsers: User[];
  userLoaderAction: (
    page: number,
    { userId }: UserLoaderActionProps
  ) => Promise<User[]>;
};

const UsersInfiniteScroll = ({
  userId,
  initialUsers,
  userLoaderAction,
}: UsersInfiniteScrollProps) => {
  const {
    data: users,
    status,
    ref,
  } = useInfiniteScroll<User, UserLoaderActionProps>(
    initialUsers || [],
    userLoaderAction,
    { userId }
  );

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.username} className="space-y-4">
          <div className="flex gap-2 items-center">
            <Link className="block" href={`/users/${user.username}`}>
              <UserAvatar user={user} />
            </Link>
            <Link className="block" href={`/users/${user.username}`}>
              {user.name && <h3>{user.name}</h3>}
              <h2 className="text-slate-900">@{user.username}</h2>
            </Link>
            <div className="ms-auto">
              {!user.isAuthenticatedUser && <FollowButton user={user} />}
            </div>
          </div>
        </div>
      ))}
      {status.hasMore && (
        <div ref={ref} className="flex justify-center py-3">
          {status.error ? (
            <p className="text-sm">Loading users failed ...</p>
          ) : (
            <LoaderCircle className="animate-spin" />
          )}
        </div>
      )}
    </div>
  );
};

export default UsersInfiniteScroll;
