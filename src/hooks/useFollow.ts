import { useState, useCallback } from "react";
import { followUser, unFollowUser, isFollowingUser } from "@/actions/user";

export const useFollow = (username: string, initialIsFollowing: boolean) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, setIsPending] = useState(false);

  const toggleFollow = useCallback(async () => {
    setIsPending(true);
    try {
      if (isFollowing) {
        await unFollowUser(username);
        setIsFollowing(false);
      } else {
        await followUser(username);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow state:", error);
    } finally {
      setIsPending(false);
    }
  }, [isFollowing, username]);

  const refreshFollowState = useCallback(async () => {
    setIsPending(true);
    try {
      const following = await isFollowingUser(username);
      setIsFollowing(following);
    } catch (error) {
      console.error("Failed to refresh follow state:", error);
    } finally {
      setIsPending(false);
    }
  }, [username]);

  return { isFollowing, isPending, toggleFollow, refreshFollowState };
};