"use client";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useFollow } from "@/hooks/useFollow";
import { UserBasic } from "@/db/user";

const FollowButton = ({ user }: { user: UserBasic }) => {
  const { isFollowing, isPending, toggleFollow } = useFollow(
    user.username,
    user.isFollowedByAuthenticatedUser
  );

  return (
    <Button
      onClick={toggleFollow}
      className="rounded-full cursor-pointer min-w-[90px]"
      disabled={isPending}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowButton;
