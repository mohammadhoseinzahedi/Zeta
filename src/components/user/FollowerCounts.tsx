"use client"
import { useUserContext } from "@/context/UserContext";

const FollowerCounts = () => {
  const { user } = useUserContext();
  return (
    <p>
      <span className="text-black">{user._count.followedBy}</span> Followers
    </p>
  );
};

export default FollowerCounts;
